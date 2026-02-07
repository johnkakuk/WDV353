const Artist = require('../models/Artist')

const getAllArtists = async (req, res) => {
    try {
        const artists = await Artist.find({});

        res.status(200).json({
            message: 'GET - all artists',
            metadata: {
                hostname: req.hostname,
                method: req.method,
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

        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' })
        }

        res.status(200).json({
            message: `GET - artist with ID ${req.params.id}`,
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
        const { data } = req.body

        const artist = await Artist.create(req.body)

        // Respond
        res.status(200).json({
            message: 'POST - root',
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            data: artist
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
            return res.status(404).json({ message: 'Artist not found' })
        }

        // Repond
        res.status(200).json({
            message: `UPDATE - artist with ID ${req.params.id}`,
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: `${artist.name} has been updated`
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
        // Setup
        const artist = await Artist.findByIdAndDelete(req.params.id)
            
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' })
        }

        // Respond
        res.status(200).json({
            message: `DELETE - artist with ID ${req.params.id}`,
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: `${artist.name} has been deleted`
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
