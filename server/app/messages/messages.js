const messages = {
    artist_not_found: 'Artist not found',
    album_not_found: 'Album not found',
    song_not_found: 'Song not found',
    post_root: 'POST - root',
    get_all_artists: 'GET - all artists',
    get_all_albums: 'GET - all albums',
    get_all_songs: 'GET - all songs',
    get_artist_by_id: (id) => `GET - artist with ID ${id}`,
    get_album_by_id: (id) => `GET - album with ID ${id}`,
    get_song_by_id: (id) => `GET - song with ID ${id}`,
    update_artist_by_id: (id) => `UPDATE - artist with ID ${id}`,
    update_album_by_id: (id) => `UPDATE - album with ID ${id}`,
    update_song_by_id: (id) => `UPDATE - song with ID ${id}`,
    delete_artist_by_id: (id) => `DELETE - artist with ID ${id}`,
    delete_album_by_id: (id) => `DELETE - album with ID ${id}`,
    delete_song_by_id: (id) => `DELETE - song with ID ${id}`,
    resource_updated: (name) => `${name} has been updated`,
    resource_deleted: (name) => `${name} has been deleted`,
}

module.exports = messages;
