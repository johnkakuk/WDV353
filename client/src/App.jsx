import { useState } from 'react'
import { Routes, Route, Link } from 'react-router'
import './App.css'
import Home from './pages/Home'
import Artists from './pages/Artists'
import Albums from './pages/Albums'
import Songs from './pages/Songs'
import ArtistDetails from './pages/ArtistDetails'
import AlbumDetails from './pages/AlbumDetails'
import SongDetails from './pages/SongDetails'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/artists">Artists</Link></li>
                    <li><Link to="/albums">Albums</Link></li>
                    <li><Link to="/songs">Songs</Link></li>
                </ul>
            </nav>
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/artists" element={<Artists />} />
                    <Route path="/artists/:id" element={<ArtistDetails />} />
                    <Route path="/albums" element={<Albums />} />
                    <Route path="/albums/:id" element={<AlbumDetails />} />
                    <Route path="/songs" element={<Songs />} />
                    <Route path="/songs/:id" element={<SongDetails />} />
                </Routes>
            </main>
        </>
    )
}

export default App
