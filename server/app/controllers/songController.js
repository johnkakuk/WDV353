const Song = require('../models/Song')
const messages = require('../messages/messages')

const getAllSongs = async (req, res) => {
    try {
        // Added filter so users can get all songs or songs by album
        const filter = req.params.albumId ? { album: req.params.albumId } : {}
        const songs = await Song.find(filter)
            .select('-__v -createdAt -updatedAt')
            .populate({ path: 'artist', select: 'name _id'})
            .populate({ path: 'album', select: 'name _id'})

        if (!songs || songs.length === 0) {
            return res.status(200).json({ message: messages.song_not_found })
        }
        
        res.status(200).json({
            message: messages.get_all_songs,
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
