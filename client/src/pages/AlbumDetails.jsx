import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import axios from 'axios'

function AlbumDetails() {
    const { id } = useParams()
    const [album, setAlbum] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [loadError, setLoadError] = useState('')
    const [editError, setEditError] = useState('')
    const [formError, setFormError] = useState('')
    const [editData, setEditData] = useState({
        name: '',
        genre: '',
        releaseYear: '',
    })
    const [tracks, setTracks] = useState([])
    const [formData, setFormData] = useState({
        name: '',
        durationMinutes: '',
        durationSeconds: '',
        genre: '',
        trackNumber: '',
        trackNumberOf: '',
    })

    const fetchAlbum = async () => {
        const response = await axios.get(`http://localhost:3000/albums/${id}`)
        setAlbum(response.data.result ?? null)
    }

    const fetchTracks = async () => {
        const response = await axios.get(`http://localhost:3000/albums/${id}/songs?sort=trackNumber&limit=100`) // Arbitrarily high limit to ensure we get all tracks
        setTracks(response.data.result ?? [])
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([fetchAlbum(), fetchTracks()])
            } catch (err) {
                setLoadError(err.response?.data?.message || err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (formError) setFormError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setFormError('')
            const { durationMinutes, durationSeconds, ...payload } = formData
            const minutes = Number(formData.durationMinutes || 0)
            const seconds = Number(formData.durationSeconds || 0)
            const duration = Number((minutes + seconds / 60).toFixed(3))

            await axios.post(`http://localhost:3000/albums/${id}/songs`, {
                ...payload,
                duration,
                album: id,
                artist: album.artist._id,
            })
            setFormData({
                name: '',
                durationMinutes: '',
                durationSeconds: '',
                genre: '',
                trackNumber: '',
                trackNumberOf: '',
            })
            fetchTracks()
        } catch (err) {
            setFormError(err.response?.data?.message || err.message)
        }
    }

    const handleDeleteSong = async (track) => {
        if (!window.confirm(`Are you sure you want to delete "${track.name}"?`)) {
            return
        }

        await axios.delete(`http://localhost:3000/songs/${track._id}`)
        setTracks(prev => prev.filter(currentTrack => currentTrack._id !== track._id))
    }

    const handleDeleteAlbum = async () => {
        if (!window.confirm(`Are you sure you want to delete "${album.name}"?`)) {
            return
        }

        try {
            await axios.delete(`http://localhost:3000/albums/${id}`)
            // Redirect back to albums list after deletion
            window.location.href = '/albums'
        } catch (err) {
            setLoadError(err.response?.data?.message || err.message)
        }
    }

    const handleEditButtonClick = () => {
        if (isEditing) {
            setIsEditing(false)
            setEditError('')
            return
        }

        setIsEditing(true)
        setEditError('')
        setEditData({
            name: album.name || '',
            genre: album.genre || '',
            releaseYear: album.releaseYear ?? '',
        })
    }

    const handleSaveChanges = async (e) => {
        e.preventDefault()

        try {
            setEditError('')
            const payload = { ...editData }
            if (payload.releaseYear === '') {
                delete payload.releaseYear
            } else {
                payload.releaseYear = Number(payload.releaseYear)
            }

            await axios.patch(`http://localhost:3000/albums/${id}`, payload)
            setAlbum(prev => ({ ...prev, ...payload }))
            setIsEditing(false)
        } catch (err) {
            setEditError(err.response?.data?.message || err.message)
        }
    }

    if (loading) {
        return <p>Loading album...</p>
    }

    if (loadError) {
        return (
            <>
                <p>Error: {loadError}</p>
                <Link to="/albums">Back to albums</Link>
            </>
        )
    }

    if (!album) {
        return (
            <>
                <p>Album not found.</p>
                <Link to="/albums">Back to albums</Link>
            </>
        )
    }

    return (
        <section className="album-details-page">
            <h1>{album.name}</h1>
            {!isEditing && (
                <>
                    <p><strong>Artist:</strong> {album.artist.name || 'N/A'}</p>
                    <p><strong>Genre:</strong> {album.genre || 'N/A'}</p>
                    <p><strong>Release Year:</strong> {album.releaseYear || 'N/A'}</p>
                </>
            )}
            {isEditing && (
                <form onSubmit={handleSaveChanges}>
                    <label>name:</label>
                    <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                    <label>genre:</label>
                    <select
                        value={editData.genre}
                        onChange={(e) => setEditData({ ...editData, genre: e.target.value })}
                    >
                        <option value="" disabled>Select genre</option>
                        <option value="Pop">Pop</option>
                        <option value="Rock">Rock</option>
                        <option value="Hip Hop">Hip Hop</option>
                        <option value="R&B">R&B</option>
                        <option value="Country">Country</option>
                        <option value="Jazz">Jazz</option>
                        <option value="Classical">Classical</option>
                        <option value="Electronic">Electronic</option>
                        <option value="Folk">Folk</option>
                        <option value="Other">Other</option>
                    </select>
                    <label>release year:</label>
                    <input
                        type="number"
                        min="1900"
                        max={`${new Date().getFullYear()}`}
                        value={editData.releaseYear}
                        onChange={(e) => setEditData({ ...editData, releaseYear: e.target.value })}
                    />
                    <div className="button-row">
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
            )}
            <p>{editError}</p>

            <div className="details-actions">
                <button onClick={handleEditButtonClick}>{isEditing ? 'Cancel' : 'Edit'}</button>
                <button onClick={handleDeleteAlbum}>Delete</button>
                <Link to="/albums">Back to albums</Link>
            </div>

            <div className="tracklist">
                <p><strong>Track list:</strong></p>
                {tracks.length > 0 && (
                    <ol className="track-list">
                        {tracks.map(track => (
                            <li key={track._id} className="track-row">
                                <span className="track-item-content">
                                    <Link to={`/songs/${track._id}`}>{track.name}</Link>
                                    <button className="btn-delete" onClick={() => handleDeleteSong(track)}>Delete</button>
                                </span>
                            </li>
                        ))}
                    </ol>
                )}
            {tracks.length === 0 && <p>No tracks found for this album.</p>}
            </div>
            <h2>Add Song</h2>
            <form className="add-form" onSubmit={handleSubmit}>
                <label>name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleOnChange} />
                <label>genre:</label>
                <select name="genre" value={formData.genre} onChange={handleOnChange} required>
                    <option value="" disabled>Select genre</option>
                    <option value="Pop">Pop</option>
                    <option value="Rock">Rock</option>
                    <option value="Hip Hop">Hip Hop</option>
                    <option value="R&B">R&B</option>
                    <option value="Country">Country</option>
                    <option value="Jazz">Jazz</option>
                    <option value="Classical">Classical</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Folk">Folk</option>
                    <option value="Other">Other</option>
                </select>
                <label>M:</label>
                <input type="number" name="durationMinutes" value={formData.durationMinutes} min="0" onChange={handleOnChange} />
                <label>S:</label>
                <input type="number" name="durationSeconds" value={formData.durationSeconds} min="0" max="59" onChange={handleOnChange} />
                <label>track number:</label>
                <input type="number" name="trackNumber" value={formData.trackNumber} min="0" onChange={handleOnChange} />
                <label>track number of:</label>
                <input type="number" name="trackNumberOf" value={formData.trackNumberOf} min="0" onChange={handleOnChange} />
                <button type="submit">Add Song</button>
            </form>
            <p>{formError}</p>
        </section>
    )
}

export default AlbumDetails
