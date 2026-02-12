import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import axios from 'axios'

function ArtistDetails() {
    const { id } = useParams()
    const [artist, setArtist] = useState(null)
    const [albums, setAlbums] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [loadError, setLoadError] = useState('')
    const [albumsError, setAlbumsError] = useState('')
    const [formError, setFormError] = useState('')
    const [editError, setEditError] = useState('')
    const [editData, setEditData] = useState({
        name: '',
        genre: '',
        bio: '',
        listens: '',
    })
    const [formData, setFormData] = useState({
        name: '',
        genre: '',
        releaseYear: '',
    })

    const fetchArtist = async () => {
        const response = await axios.get(`http://localhost:3000/artists/${id}`)
        setArtist(response.data.result ?? null)
    }

    const fetchAlbums = async () => {
        const response = await axios.get(`http://localhost:3000/artists/${id}/albums`)
        setAlbums(response.data.result ?? [])
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([fetchArtist(), fetchAlbums()])
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
            await axios.post(`http://localhost:3000/artists/${id}/albums`, {
                ...formData,
                artist: id,
            })
            setFormData({
                name: '',
                genre: '',
                releaseYear: '',
            })
            fetchAlbums()
        } catch (err) {
            setFormError(err.response?.data?.message || err.message)
        }
    }

    const handleDeleteAlbum = async (album) => {
        if (!window.confirm(`Are you sure you want to delete "${album.name}"?`)) {
            return
        }

        try {
            setAlbumsError('')
            await axios.delete(`http://localhost:3000/albums/${album._id}`)
            setAlbums(prev => prev.filter(currentAlbum => currentAlbum._id !== album._id))
        } catch (err) {
            setAlbumsError(err.response?.data?.message || err.message)
        }
    }

    const handleDeleteArtist = async () => {
        if (!window.confirm(`Are you sure you want to delete "${artist.name}"?`)) {
            return
        }

        try {
            await axios.delete(`http://localhost:3000/artists/${id}`)
            // Redirect back to artists list after deletion
            window.location.href = '/artists'
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
            name: artist.name || '',
            genre: artist.genre || '',
            bio: artist.bio || '',
            listens: artist.listens ?? '',
        })
    }

    const handleSaveChanges = async (e) => {
        e.preventDefault()

        try {
            setEditError('')
            const payload = { ...editData }
            if (payload.listens === '') {
                delete payload.listens
            } else {
                payload.listens = Number(payload.listens)
            }

            await axios.patch(`http://localhost:3000/artists/${id}`, payload)
            setArtist(prev => ({ ...prev, ...payload }))
            setIsEditing(false)
        } catch (err) {
            setEditError(err.response?.data?.message || err.message)
        }
    }

    if (loading) {
        return <p>Loading artist...</p>
    }

    if (loadError) {
        return (
            <section className="artist-details-page">
                <p>Error: {loadError}</p>
                <Link to="/artists">Back to artists</Link>
            </section>
        )
    }

    if (!artist) {
        return (
            <section className="artist-details-page">
                <p>Artist not found.</p>
                <Link to="/artists">Back to artists</Link>
            </section>
        )
    }

    return (
        <section className="artist-details-page">
            <h1>{artist.name}</h1>
            {!isEditing && (
                <>
                    <p><strong>Genre:</strong> {artist.genre || 'N/A'}</p>
                    <p><strong>Bio:</strong> {artist.bio || 'N/A'}</p>
                    <p><strong>Listens:</strong> {artist.listens ?? 'N/A'}</p>
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
                    <label>bio:</label>
                    <input
                        type="text"
                        value={editData.bio}
                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    />
                    <label>listens:</label>
                    <input
                        type="number"
                        min="0"
                        value={editData.listens}
                        onChange={(e) => setEditData({ ...editData, listens: e.target.value })}
                    />
                    <div className="button-row">
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
            )}
            <p>{editError}</p>
            <p><strong>Albums:</strong></p>
            {albumsError && <p>{albumsError}</p>}
            {albums.length > 0 ? (
                <ul className="track-list">
                    {albums.map(album => (
                        <li key={album._id} className="track-row">
                            <span className="track-item-content">
                                <Link to={`/albums/${album._id}`}>{album.name}</Link>
                                <button className="btn-delete" onClick={() => handleDeleteAlbum(album)}>Delete</button>
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No albums found for this artist.</p>
            )}
            <div className="details-actions">
                <button onClick={handleEditButtonClick}>{isEditing ? 'Cancel' : 'Edit'}</button>
                <button onClick={handleDeleteArtist}>Delete</button>
                <Link to="/artists">Back to artists</Link>
            </div>
            <h2>Add Album</h2>
            <form className="add-form" onSubmit={handleSubmit}>
                <label>name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleOnChange} />
                <label>genre:</label>
                <select name="genre" value={formData.genre} onChange={handleOnChange}>
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
                <input type="number" name="releaseYear" value={formData.releaseYear} min="1900" max={`${new Date().getFullYear()}`} onChange={handleOnChange} />
                <button type="submit">Add Album</button>
            </form>
            <p>{formError}</p>
        </section>
    )
}

export default ArtistDetails
