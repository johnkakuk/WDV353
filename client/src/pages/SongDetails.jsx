import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import axios from 'axios'

function SongDetails() {
    const { id } = useParams()
    const [song, setSong] = useState(null)
    const [artists, setArtists] = useState([])
    const [albumsForArtist, setAlbumsForArtist] = useState([])
    const [isLoadingAlbums, setIsLoadingAlbums] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState({
        name: '',
        artist: '',
        album: '',
        durationMinutes: '',
        durationSeconds: '',
        genre: '',
        trackNumber: '',
        trackNumberOf: '',
    })

    const handleEditButtonClick = () => {
        if (isEditing) {
            setIsEditing(false)
            // Save changes
        } else {
            setIsEditing(true)
            setEditData({
                name: song.name || '',
                artist: song.artist?._id || '',
                album: song.album?._id || '',
                durationMinutes: song.duration ? Math.floor(song.duration) : '',
                durationSeconds: song.duration ? Math.round((song.duration % 1) * 60) : '',
                genre: song.genre || '',
                trackNumber: song.trackNumber || '',
                trackNumberOf: song.trackNumberOf || '',
            })
        }
    }

    const handleSaveChanges = async (e) => {
        e.preventDefault()

        try {
            setError('')
            const { durationMinutes, durationSeconds, ...payload } = editData
            const minutes = Number(editData.durationMinutes || 0)
            const seconds = Number(editData.durationSeconds || 0)
            const duration = Number((minutes + seconds / 60).toFixed(3))
            await axios.patch(`http://localhost:3000/songs/${id}`, {
                ...payload,
                duration,
            })
            // Fetch updated song details after successful update
            const response = await axios.get(`http://localhost:3000/songs/${id}`)
            setSong(response.data.result ?? null)
            setIsEditing(false)
        } catch (err) {
            setError(err.response?.data?.message || err.message)
        }
    }

    const handleOnChangeArtist = (e) => {
        const selectedArtistId = e.target.value
        setEditData(prev => ({ ...prev, artist: selectedArtistId, album: '' }))
    }

    const handleDeleteSong = async () => {
        if (!window.confirm(`Are you sure you want to delete "${song.name}"?`)) {
            return
        }

        try {
            await axios.delete(`http://localhost:3000/songs/${id}`)
            // Redirect back to songs list after deletion
            window.location.href = '/songs'
        } catch (err) {
            setError(err.response?.data?.message || err.message)
        }
    }

    useEffect(() => {
        const fetchSong = async () => {
            const response = await axios.get(`http://localhost:3000/songs/${id}`)
            setSong(response.data.result ?? null)
        }

        const fetchArtists = async () => {
            const response = await axios.get('http://localhost:3000/artists')
            setArtists(response.data.result ?? [])
        }

        const fetchData = async () => {
            try {
                await Promise.all([fetchSong(), fetchArtists()]) // AI assisted, I've never used Promise.all before
            } catch (err) {
                setError(err.response?.data?.message || err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    useEffect(() => {
        if (!editData.artist) {
            setAlbumsForArtist([])
            return
        }

        const fetchAlbumsForArtist = async () => {
            try {
                setIsLoadingAlbums(true)
                const response = await axios.get(`http://localhost:3000/artists/${editData.artist}/albums`)
                setAlbumsForArtist(response.data.result || [])
            } finally {
                setIsLoadingAlbums(false)
            }
        }

        fetchAlbumsForArtist()
    }, [editData.artist])

    if (loading) {
        return <p>Loading song...</p>
    }

    if (error) {
        return (
            <section className="song-details-page">
                <p>Error: {error}</p>
                <Link to="/songs">Back to songs</Link>
            </section>
        )
    }

    if (!song) {
        return (
            <section className="song-details-page">
                <p>Song not found.</p>
                <Link to="/songs">Back to songs</Link>
            </section>
        )
    }

    return (
        <section className="song-details-page">
            <h1>{song.name}</h1>
            {!isEditing && (
                <>
                    <p><strong>Artist:</strong> {song.artist?.name || 'N/A'}</p>
                    <p><strong>Album:</strong> {song.album?.name || 'N/A'}</p>
                    <p><strong>Genre:</strong> {song.genre || 'N/A'}</p>
                    <p><strong>Duration:</strong> {Math.floor(song.duration)}:{((song.duration % 1) * 60).toFixed(0) ?? 'N/A'}</p> {/* Convert duration from minutes decimal to MM:SS */}
                    <p><strong>Track:</strong> {song.trackNumber ?? 'N/A'} / {song.trackNumberOf ?? 'N/A'}</p>
                </>
            )}
            {isEditing && (
                <form onSubmit={handleSaveChanges}>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                    </label>
                    <label>
                        Artist:
                        <select
                            value={editData.artist}
                            onChange={handleOnChangeArtist}
                        >
                            <option value="" disabled>Select artist</option>
                            {artists.map(artist => (
                                <option key={artist._id} value={artist._id}>{artist.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Album:
                        <select
                            value={editData.album}
                            onChange={(e) => setEditData({ ...editData, album: e.target.value })}
                            disabled={!editData.artist || isLoadingAlbums || albumsForArtist.length === 0}
                        >
                            {!editData.artist && <option value="" disabled>Select artist</option>}
                            {editData.artist && isLoadingAlbums && <option value="" disabled>Loading albums...</option>}
                            {editData.artist && !isLoadingAlbums && albumsForArtist.length === 0 && <option value="" disabled>No albums found</option>}
                            {editData.artist && !isLoadingAlbums && albumsForArtist.length > 0 && (
                                <>
                                    <option value="" disabled>Select album</option>
                                    {albumsForArtist.map(album => (
                                        <option key={album._id} value={album._id}>{album.name}</option>
                                    ))}
                                </>
                            )}
                        </select>
                    </label>
                    <label>
                        Genre:
                        <input
                            type="text"
                            value={editData.genre}
                            onChange={(e) => setEditData({ ...editData, genre: e.target.value })}
                        />
                    </label>
                    <label>
                        Duration (minutes):
                        <input
                            type="number"
                            value={editData.durationMinutes}
                            onChange={(e) => setEditData({ ...editData, durationMinutes: e.target.value })}
                        />
                    </label>
                    <label>
                        Duration (seconds):
                        <input
                            type="number"
                            value={editData.durationSeconds}
                            onChange={(e) => setEditData({ ...editData, durationSeconds: e.target.value })}
                        />
                    </label>
                    <label>
                        Track Number:
                        <input
                            type="number"
                            value={editData.trackNumber}
                            onChange={(e) => setEditData({ ...editData, trackNumber: e.target.value })}
                        />
                    </label>
                    <label>
                        Track of Total:
                        <input
                            type="number"
                            value={editData.trackNumberOf}
                            onChange={(e) => setEditData({ ...editData, trackNumberOf: e.target.value })}
                        />
                    </label>
                    <div className="button-row">
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
            )}
            <div className="details-actions">
                <button onClick={handleEditButtonClick}>{isEditing ? 'Cancel' : 'Edit'}</button>
                <button onClick={handleDeleteSong}>Delete</button>
                <Link to="/songs">Back to songs</Link>
            </div>
        </section>
    )
}

export default SongDetails
