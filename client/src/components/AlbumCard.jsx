import { Link } from "react-router"

function AlbumCard({ album }) {
    return (
        <div className="card">
            <Link to={`/albums/${album._id}`}>
                <h3>{album.name}</h3>
            </Link>
            <p>{album.artist.name}</p>
        </div>
    )
}

export default AlbumCard
