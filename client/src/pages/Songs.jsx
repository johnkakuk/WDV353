import { useState, useEffect } from 'react'
import SongCard from '../components/SongCard'
import axios from 'axios'

function Songs() {
    const [songs, setSongs] = useState([])
    const [totalSongs, setTotalSongs] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    
    // const [artists, setArtists] = useState([])
    // const [albumsForArtist, setAlbumsForArtist] = useState([])
    // const [isLoadingAlbums, setIsLoadingAlbums] = useState(false)

    // const [formData, setFormData] = useState({
    //     name: '',
    //     artist: '',
    //     album: '',
    //     durationMinutes: '',
    //     durationSeconds: '',
    //     genre: '',
    //     trackNumber: '',
    //     trackNumberOf: '',
    // })

    const fetchSongs = async (page) => {
        const response = await axios.get(`http://localhost:3000/songs${page ? `?page=${page}` : ''}`)
        setSongs(response.data.result || [])
        setTotalSongs(response.data.metadata?.total || 0)
    }

    const handleDeleteSong = async (id) => {
        await axios.delete(`http://localhost:3000/songs/${id}`)
        setSongs(prev => prev.filter(song => song._id !== id))
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1
            setCurrentPage(newPage)
            fetchSongs(newPage)
        }
    }

    const handleNextPage = () => {
        const maxPage = Math.ceil(totalSongs / 10) // Assuming limit is 10
        if (currentPage < maxPage) {
            const newPage = currentPage + 1
            setCurrentPage(newPage)
            fetchSongs(newPage)
        }
    }

    // const fetchArtists = async () => {
    //     const response = await axios.get('http://localhost:3000/artists')
    //     setArtists(response.data.result || [])
    // }

    // Initial GET
    useEffect(() => {
        fetchSongs()
        // fetchArtists()
    }, [])

    // // Fetch albums for selected artist when artist changes
    // useEffect(() => {
    //     if (!formData.artist) {
    //         setAlbumsForArtist([])
    //         return
    //     }

    //     const fetchAlbumsForArtist = async () => {
    //         try {
    //             setIsLoadingAlbums(true)
    //             const response = await axios.get(`http://localhost:3000/artists/${formData.artist}/albums`)
    //             setAlbumsForArtist(response.data.result || [])
    //         } finally {
    //             setIsLoadingAlbums(false)
    //         }
    //     }

    //     fetchAlbumsForArtist()
    // }, [formData.artist])

    // // POST song
    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     const { durationMinutes, durationSeconds, ...payload } = formData
    //     const minutes = Number(formData.durationMinutes || 0)
    //     const seconds = Number(formData.durationSeconds || 0)
    //     const duration = Number((minutes + seconds / 60).toFixed(3))

    //     await axios.post('http://localhost:3000/songs', {
    //         ...payload,
    //         duration,
    //     })
    //     fetchSongs()
    // }

    // // Store form input changes for POST requests
    // const handleOnChange = (e) => {
    //     const { name, value } = e.target
    //     setFormData(prev => ({ ...prev, [name]: value }))
    // }

    // // Store form input changes for POST requests
    // const handleOnChangeArtist = async (e) => {
    //     const selectedArtistId = e.target.value
    //     setFormData(prev => ({ ...prev, artist: selectedArtistId, album: '' }))
    // }

    return (
        <section className="archive-page">
            <h1>Songs</h1>
            {songs ? <h2>{totalSongs} songs found</h2> : <p>Loading...</p>}
            <section className="cards-grid">
                {songs.map(song => (
                    <SongCard key={song._id} song={song} onDelete={handleDeleteSong} />
                ))}
            </section>
            <div className="button-row">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Prev
                </button>
                <button onClick={handleNextPage} disabled={currentPage === Math.ceil(totalSongs / 10)}>
                    Next
                </button>
            </div>
            {/* <h2>Add New</h2>
            <form onSubmit={handleSubmit}>
                <label>name:</label>
                <input type="text" name="name" onChange={handleOnChange} />
                <label>artist:</label>
                <select name="artist" value={formData.artist} onChange={handleOnChangeArtist}>
                    <option value="" disabled>Select artist</option>
                    {artists.map(artist => (
                        <option key={artist._id} value={artist._id}>{artist.name}</option>
                    ))}
                </select>
                <label>album:</label>
                <select name="album" value={formData.album} onChange={handleOnChange} disabled={!formData.artist || isLoadingAlbums || albumsForArtist.length === 0}>
                    {!formData.artist && <option value="" disabled>Select artist</option>}
                    {formData.artist && isLoadingAlbums && <option value="" disabled>Loading albums...</option>}
                    {formData.artist && !isLoadingAlbums && albumsForArtist.length === 0 && <option value="" disabled>No albums found</option>}
                    {formData.artist && !isLoadingAlbums && albumsForArtist.length > 0 && (
                        <>
                            <option value="" disabled>Select album</option>
                            {albumsForArtist.map(album => (
                                <option key={album._id} value={album._id}>{album.name}</option>
                            ))}
                        </>
                    )}
                </select>
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
                <label>M:</label>
                <input type="number" name="durationMinutes" min="0" value={formData.durationMinutes} onChange={handleOnChange} />
                <label>S:</label>
                <input type="number" name="durationSeconds" min="0" max="59" value={formData.durationSeconds} onChange={handleOnChange} />
                <label>track number:</label>
                <input type="number" name="trackNumber" min="0" value={formData.trackNumber} onChange={handleOnChange} />
                <label>track number of:</label>
                <input type="number" name="trackNumberOf" min="0" value={formData.trackNumberOf} onChange={handleOnChange} />
                <button type="submit">Add Song</button>
            </form> */}
        </section>
    )
}

export default Songs
