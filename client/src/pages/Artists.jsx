import { useState, useEffect } from 'react'
import ArtistCard from '../components/ArtistCard'
import axios from 'axios'

function Artists() {
    const [artists, setArtists] = useState([])
    const [totalArtists, setTotalArtists] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [loadError, setLoadError] = useState('')
    const [formError, setFormError] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        genre: '',
        bio: '',
    })

    const fetchArtists = async (page) => {
        try {
            const response = await axios.get(`http://localhost:3000/artists${page ? `?page=${page}` : ''}`)
            setArtists(response.data.result || [])
            setTotalArtists(response.data.metadata?.total || 0)
        } catch (err) {
            setLoadError(err.response?.data?.message || err.message)
        }
    }

    // Initial GET artists
    useEffect(() => {
        fetchArtists()
    }, [])

    // POST artist
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setFormError('')
            await axios.post('http://localhost:3000/artists', formData)
            setFormData({
                name: '',
                genre: '',
                bio: '',
            })
            fetchArtists()
        } catch (err) {
            setFormError(err.response?.data?.message || err.message)
        }
    }

    // Store form input changes for POST requests
    const handleOnChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (formError) setFormError('')
    }

    const handleDeleteArtist = async (artist) => {
        if (!window.confirm(`WARNING: You are about to delete "${artist.name}" and all associated content. Are you sure?`)) {
            return
        }

        try {
            await axios.delete(`http://localhost:3000/artists/${artist._id}`)
            setArtists(prev => prev.filter(currentArtist => currentArtist._id !== artist._id))
            setTotalArtists(prev => Math.max(prev - 1, 0))
        } catch (err) {
            setLoadError(err.response?.data?.message || err.message)
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1
            setCurrentPage(newPage)
            fetchArtists(newPage)
        }
    }

    const handleNextPage = () => {
        const maxPage = Math.max(1, Math.ceil(totalArtists / 10))
        if (currentPage < maxPage) {
            const newPage = currentPage + 1
            setCurrentPage(newPage)
            fetchArtists(newPage)
        }
    }

    return (
        <section className="archive-page">
            <h1>Artists</h1>
            {loadError && <p>Error loading artists: {loadError}</p>}
            {artists ? <h2>{totalArtists} artists found</h2> : <p>Loading...</p>}
            <section className="cards-grid">
                {artists.map(artist => (
                    <ArtistCard key={artist._id} artist={artist} onDelete={handleDeleteArtist} />
                ))}
            </section>
            <div className="button-row">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Prev
                </button>
                <button onClick={handleNextPage} disabled={currentPage >= Math.max(1, Math.ceil(totalArtists / 10))}>
                    Next
                </button>
            </div>
            <h2>Add New</h2>
            <form className="add-form" onSubmit={handleSubmit}>
                <label>name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleOnChange}/>
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
                <label>bio:</label>
                <input type="textarea" name="bio" value={formData.bio} onChange={handleOnChange} />
                <button type="submit">Add Artist</button>
            </form>
            <p>{formError}</p>
        </section>
    )
}

export default Artists
