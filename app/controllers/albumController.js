const Album = require('../models/Album')

const getAllAlbums = async (req, res) => {
    try {
        // Added filter so users can get all albums or albums by artist
        const filter = req.params.artistId ? { artist: req.params.artistId } : {}
        const albums = await Album.find(filter);

        res.status(200).json({
            message: 'GET - all albums',
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

        if (!album) {
            return res.status(404).json({ message: 'Album not found' })
        }

        res.status(200).json({
            message: `GET - album with ID ${req.params.id}`,
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
        const { data } = req.body

        const album = await Album.create(req.body)

        // Respond
        res.status(201).json({
            message: 'POST - root',
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            data: album
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
            return res.status(404).json({ message: 'Album not found' })
        }

        // Repond
        res.status(200).json({
            message: `UPDATE - album with ID ${req.params.id}`,
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: `${album.name} has been updated`
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
            return res.status(404).json({ message: 'Album not found' })
        }

        // Respond
        res.status(200).json({
            message: `DELETE - album with ID ${req.params.id}`,
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: `${album.name} has been deleted`
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
