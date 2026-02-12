import { Link } from "react-router"

function ArtistCard({ artist }) {
    return (
        <div className="card">
            <Link to={`/artists/${artist._id}`}>
                <h3>{artist.name}</h3>
            </Link>
            <p>{artist.genre}</p>
        </div>
    )
}

export default ArtistCard
