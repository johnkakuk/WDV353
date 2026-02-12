import { Link } from 'react-router'

function SongCard({ song }) {
    return (
        <div className="card">
            <Link to={`/songs/${song._id}`}>
                <h3>{song.name}</h3>
            </Link>
            <p>{song.artist?.name || 'Unknown artist'}</p>
            <p>{song.album?.name || 'Unknown album'}</p>
        </div>
    )
}

export default SongCard
