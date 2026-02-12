import { useState, useEffect } from 'react'
import AlbumCard from '../components/AlbumCard'
import axios from 'axios'

function Albums() {
    const [artists, setArtists] = useState([])
    const [albums, setAlbums] = useState([])
    const [totalAlbums, setTotalAlbums] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        artist: '',
        genre: '',
        releaseYear: '',
    })

    const fetchArtists = async () => {
        const response = await axios.get('http://localhost:3000/artists')
        setArtists(response.data.result || [])
    }

    const fetchAlbums = async (page) => {
        const response = await axios.get(`http://localhost:3000/albums${page ? `?page=${page}` : ''}`)
        setAlbums(response.data.result || [])
        setTotalAlbums(response.data.metadata?.total || 0)
    }
    
    // Initial GET
    useEffect(() => {
        fetchArtists()
        fetchAlbums()
    }, [])

    // POST album
    const handleSubmit = async (e) => {
        e.preventDefault()
        await axios.post('http://localhost:3000/albums', formData)
        fetchAlbums()
    }

    // Store form input changes for POST requests
    const handleOnChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleDeleteAlbum = async (album) => {
        if (!window.confirm(`Are you sure you want to delete "${album.name}"?`)) {
            return
        }

        try {
            await axios.delete(`http://localhost:3000/albums/${album._id}`)
            setAlbums(prev => prev.filter(currentAlbum => currentAlbum._id !== album._id))
            setTotalAlbums(prev => Math.max(prev - 1, 0))
        } catch (err) {
            setError(err.response?.data?.message || err.message)
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1
            setCurrentPage(newPage)
            fetchAlbums(newPage)
        }
    }

    const handleNextPage = () => {
        const maxPage = Math.max(1, Math.ceil(totalAlbums / 10))
        if (currentPage < maxPage) {
            const newPage = currentPage + 1
            setCurrentPage(newPage)
            fetchAlbums(newPage)
        }
    }

    return (
        <section className="archive-page">
            <h1>Albums</h1>
            {error && <p>Error: {error}</p>}
            {albums ? <h2>{totalAlbums} albums found</h2> : <p>Loading...</p>}
            <section className="cards-grid">
                {albums.map(album => (
                    <AlbumCard key={album._id} album={album} onDelete={handleDeleteAlbum} />
                ))}
            </section>
            <div className="button-row">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Prev
                </button>
                <button onClick={handleNextPage} disabled={currentPage >= Math.max(1, Math.ceil(totalAlbums / 10))}>
                    Next
                </button>
            </div>
            {/* <h2>Add New</h2>
            <form onSubmit={handleSubmit}>
                <label>name:</label>
                <input type="text" name="name" onChange={handleOnChange}/>
                <label>artist:</label>
                <select name="artist" value={formData.artist.name} onChange={handleOnChange}>
                    <option value="" disabled>Select artist</option>
                    {artists.map(artist => (
                        <option key={artist._id} value={artist._id}>{artist.name}</option>
                    ))}
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
                <label>release year:</label>
                <input type="number" name="releaseYear" value={formData.releaseYear} min="1900" max={`${new Date().getFullYear()}`} onChange={handleOnChange} />
                <button type="submit">Add Album</button>
            </form> */}
        </section>
    )
}

export default Albums
