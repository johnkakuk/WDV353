const Album = require('../models/Album')
const messages = require('../messages/messages')

const getAllAlbums = async (req, res) => {
    try {
        // Added filter so users can get all albums or albums by artist
        const filter = req.params.artistId ? { artist: req.params.artistId } : {}
        const albums = await Album.find(filter)
            .select('-__v -createdAt -updatedAt')
            .populate({ path: 'artist', select: 'name _id'})
            // Hmm, works fine without it. What does this actually do? .exec()

        if (!albums || albums.length === 0) {
            return res.status(200).json({ message: messages.album_not_found })
        }

        res.status(200).json({
            message: messages.get_all_albums,
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: albums
        })

        console.log('All albums found')
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const getAlbumById = async (req,res) => {
    try {
        const album = await Album.findById(req.params.id)
            .select('-__v -createdAt -updatedAt')
            .populate({ path: 'artist', select: 'name _id'})

        if (!album) {
            return res.status(200).json({ message: messages.album_not_found })
        }

        res.status(200).json({
            message: messages.get_album_by_id(req.params.id),
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: album
        })

        console.log('Album found')
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: error.message })
    }
}

const createAlbum = async (req, res) => {
    try {
        // Setup
        const album = await Album.create(req.body)

        // Respond
        res.status(201).json({
            message: messages.post_root,
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: album
        })

        console.log('Album created successfully')
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: error.message })
    }
}

const updateAlbum =  async (req, res) => {
    try {
        const album = await Album.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!album) {
            return res.status(200).json({ message: messages.album_not_found })
        }

        // Repond
        res.status(200).json({
            message: messages.update_album_by_id(req.params.id),
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: messages.resource_updated(album.name)
        })

        console.log('Album updated successfully')
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: error.message })
    }
}

const deleteAlbum = async (req, res) => {
    try {
        // Setup
        const album = await Album.findByIdAndDelete(req.params.id)
            
        if (!album) {
            return res.status(200).json({ message: messages.album_not_found })
        }

        // Respond
        res.status(200).json({
            message: messages.delete_album_by_id(req.params.id),
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: messages.resource_deleted(album.name)
        })

        console.log('Album deleted successfully')
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getAllAlbums,
    getAlbumById,
    createAlbum,
    deleteAlbum,
    updateAlbum
}
