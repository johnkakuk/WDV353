const Song = require('../models/Song')
const messages = require('../messages/messages')

// For detailed explanations on query filtering/pagination/select/sort mechanics, see albumController comments.
const getAllSongs = async (req, res) => {
    try {
        // Query params. Separates pagination and sorting params from filter params. Also converts gt, gte, lt, lte, and in to their MongoDB equivalents with the $ prefix.
        // Also BIG upgrade to filters. Can now use queries to filter by any field, not just album/artist. So you can do things like /songs?genre=Rock or /songs?duration[gte]=3. Very flexible!
        const { page = 1, limit = 10, sort, fields, ...filter } = req.query
        const skip = (parseInt(page) - 1) * parseInt(limit)
        const parsedFilter = JSON.parse(JSON.stringify(filter).replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`))
        const total = await Song.countDocuments(parsedFilter)

        // Preserve nested route behavior: /artists/:artistId/albums/:albumId/songs
        if (req.params.albumId) parsedFilter.album = req.params.albumId

        // Do not want artist if 1. fields are specified, 2. No minuses are present, and 3. artist is NOT included
        // OR if 1. fields are specified, 2, -artist is included. Christ what a headache
        const projection = fields ? fields.split(',').join(' ') : '';
        const doesNotWantArtist =
            (projection && !projection.includes('-') && !projection.includes('artist')) ||
            (projection && projection.includes('-artist'))
        const doesNotWantAlbum =
            (projection && !projection.includes('-') && !projection.includes('album')) ||
            (projection && projection.includes('-album'))

        let query = Song.find(parsedFilter)
            .skip(skip)
            .limit(parseInt(limit, 10))
            .select(projection || '-__v -createdAt -updatedAt')

        if (!doesNotWantArtist) query = query.populate({ path: 'artist', select: 'name _id' })
        if (!doesNotWantAlbum) query = query.populate({ path: 'album', select: 'name _id' })

        if (sort) {
            query = query.sort(sort.split(',').join(' '))
        }

        const songs = await query

        if (!songs || songs.length === 0) {
            return res.status(200).json({ message: messages.song_not_found })
        }
        
        res.status(200).json({
            message: messages.get_all_songs,
            metadata: {
                hostname: req.hostname,
                method: req.method,
                total: total,
            },
            result: songs
        })

        console.log('All songs found')
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const getSongById = async (req,res) => {
    try {
        const song = await Song.findById(req.params.id)
            .select('-__v -createdAt -updatedAt')
            .populate({ path: 'artist', select: 'name _id'})
            .populate({ path: 'album', select: 'name _id'})

        if (!song) {
            // Apparently standard practice is to return 200 with a message instead of 404 when a resource is not found in a GET request. Who am I to argue with the internet?
            return res.status(200).json({ message: messages.song_not_found })
        }

        res.status(200).json({
            message: messages.get_song_by_id(req.params.id),
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: song
        })

        console.log('Song found')
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: error.message })
    }
}

const createSong = async (req, res) => {
    try {
        // Setup
        const song = await Song.create(req.body)

        // Respond
        res.status(201).json({
            message: messages.post_root,
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: song
        })

        console.log('Song created successfully')
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: error.message })
    }
}

const updateSong =  async (req, res) => {
    try {
        const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!song) {
            return res.status(200).json({ message: messages.song_not_found })
        }

        // Repond
        res.status(200).json({
            message: messages.update_song_by_id(req.params.id),
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: messages.resource_updated(song.name)
        })

        console.log('Song updated successfully')
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: error.message })
    }
}

const deleteSong = async (req, res) => {
    try {
        // Setup
        const song = await Song.findByIdAndDelete(req.params.id)
            
        if (!song) {
            return res.status(200).json({ message: messages.song_not_found })
        }

        // Respond
        res.status(200).json({
            message: messages.delete_song_by_id(req.params.id),
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: messages.resource_deleted(song.name)
        })

        console.log('Song deleted successfully')
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getAllSongs,
    getSongById,
    createSong,
    deleteSong,
    updateSong
}
