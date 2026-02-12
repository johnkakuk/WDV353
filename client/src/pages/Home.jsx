function Home() {
    return (
        <>
            <h1>Home</h1>
            <p>
                This is a full-stack music library app for managing artists, albums, and songs.
                You can create records, browse archive pages, view single-detail pages, update entries,
                and delete content directly from the detail views.
            </p>
            <h2>What You Can Do</h2>
            <ul>
                <li>Create new artists from the Artists page.</li>
                <li>Add albums from Artist details and songs from Album details.</li>
                <li>Edit artist, album, and song data from single pages.</li>
                <li>Delete artists, albums, and songs from single pages.</li>
                <li>Use archive pages to browse collections with pagination controls.</li>
            </ul>
            <p>
                Stack: React on the front end with a Node/Express and MongoDB API on the back end.
            </p>
        </>
    )
}

export default Home
