const Song = require('../models/Song')

const getAllSongs = async (req, res) => {
    try {
        // Added filter so users can get all songs or songs by album
        const filter = req.params.albumId ? { album: req.params.albumId } : {}
        const songs = await Song.find(filter);

        res.status(200).json({
            message: 'GET - all songs',
            metadata: {
                hostname: req.hostname,
                method: req.method,
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

        if (!song) {
            return res.status(404).json({ message: 'Song not found' })
        }

        res.status(200).json({
            message: `GET - song with ID ${req.params.id}`,
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
        const { data } = req.body

        const song = await Song.create(req.body)

        // Respond
        res.status(201).json({
            message: 'POST - root',
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            data: song
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
            return res.status(404).json({ message: 'Song not found' })
        }

        // Repond
        res.status(200).json({
            message: `UPDATE - song with ID ${req.params.id}`,
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: `${song.name} has been updated`
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
            return res.status(404).json({ message: 'Song not found' })
        }

        // Respond
        res.status(200).json({
            message: `DELETE - song with ID ${req.params.id}`,
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: `${song.name} has been deleted`
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
