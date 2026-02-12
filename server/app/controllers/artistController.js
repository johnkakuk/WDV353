const Artist = require('../models/Artist')
const messages = require('../messages/messages')
const Album = require('../models/Album')
const Song = require('../models/Song')

// For detailed explanations on query filtering/pagination/select/sort mechanics, see albumController comments.
const getAllArtists = async (req, res) => {
    try {
        // Query params. Separates pagination and sorting params from filter params. Also converts gt, gte, lt, lte, and in to their MongoDB equivalents with the $ prefix.
        // Also BIG upgrade to filters. Can now use queries to filter by any field, not just name/genre. So you can do things like /artists?genre=Rock or /artists?listens[gte]=1000000. Very flexible!
        const { page = 1, limit = 10, sort, fields, ...filter } = req.query
        const skip = (parseInt(page) - 1) * parseInt(limit)
        const parsedFilter = JSON.parse(JSON.stringify(filter).replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`))
        const projection = fields ? fields.split(',').join(' ') : '';
        const total = await Artist.countDocuments(parsedFilter)

        let query = Artist.find(parsedFilter)
            .skip(skip)
            .limit(parseInt(limit, 10))
            .select(projection || '-__v -createdAt -updatedAt')

        if (sort) {
            query = query.sort(sort.split(',').join(' '))
        }

        const artists = await query

        if (!artists || artists.length === 0) {
            return res.status(200).json({ message: messages.artist_not_found })
        }

        res.status(200).json({
            message: messages.get_all_artists,
            metadata: {
                hostname: req.hostname,
                method: req.method,
                total: total,
            },
            result: artists
        })

        console.log('All artists found')
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const getArtistById = async (req,res) => {
    try {
        const artist = await Artist.findById(req.params.id)
            .select('-__v -createdAt -updatedAt')

        if (!artist) {
            return res.status(200).json({ message: messages.artist_not_found })
        }

        res.status(200).json({
            message: messages.get_artist_by_id(req.params.id),
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: artist
        })

        console.log('Artist found')
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: error.message })
    }
}

const createArtist = async (req, res) => {
    try {
        // Setup
        const artist = await Artist.create(req.body)

        // Respond
        res.status(201).json({
            message: messages.post_root,
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: artist
        })

        console.log('Artist created successfully')
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: error.message })
    }
}

const updateArtist =  async (req, res) => {
    try {
        const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!artist) {
            return res.status(200).json({ message: messages.artist_not_found })
        }

        // Repond
        res.status(200).json({
            message: messages.update_artist_by_id(req.params.id),
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: messages.resource_updated(artist.name)
        })

        console.log('Artist updated successfully')
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: error.message })
    }
}

const deleteArtist = async (req, res) => {
    try {
        // Execute
        await Song.deleteMany({ artist: req.params.id }) // Delete all songs with this artist ID first to prevent orphaned songs
        await Album.deleteMany({ artist: req.params.id }) // Delete all albums with this artist ID first to prevent orphaned albums
        const artist = await Artist.findByIdAndDelete(req.params.id)
            
        if (!artist) {
            return res.status(200).json({ message: messages.artist_not_found })
        }

        // Respond
        res.status(200).json({
            message: messages.delete_artist_by_id(req.params.id),
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: messages.resource_deleted(artist.name)
        })

        console.log('Artist deleted successfully')
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getAllArtists,
    getArtistById,
    createArtist,
    deleteArtist,
    updateArtist
}
