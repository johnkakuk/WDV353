const Geodata = require('../models/Geodata')

const getAllGeodata = async (req, res) => {
    try {
        // Added filter so users can get all geodata or geodata by artist
        const geodata = await Geodata.find({})
            .select('-__v -createdAt -updatedAt')

        if (!geodata || geodata.length === 0) {
            return res.status(200).json({ message: 'Not found' })
        }

        res.status(200).json({
            message: 'Successfully retrieved all geodata',
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: geodata
        })

        console.log('All geodata found')
    } catch (error) {
        return res.status(500).json({ message: 'Unspecified server error' })
    }
}

const getGeodataById = async (req,res) => {
    try {
        const geodata = await Geodata.findById(req.params.id)
            .select('-__v -createdAt -updatedAt')

        if (!geodata) {
            return res.status(200).json({ message: 'Not found' })
        }

        res.status(200).json({
            message: 'Successfully retrieved geodata by ID',
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: geodata
        })

        console.log('Geodata found')
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid geodata ID or validation error' })
        }
        return res.status(500).json({ message: 'Unspecified server error' })
    }
}

const createGeodata = async (req, res) => {
    try {
        // Setup
        const geodata = await Geodata.create(req.body)

        // Respond
        res.status(201).json({
            message: 'Successfully created geodata',
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: geodata
        })

        console.log('Geodata created successfully')
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid geodata data provided' })
        }
        return res.status(500).json({ message: 'Unspecified server error' })
    }
}

const updateGeodata =  async (req, res) => {
    try {
        const geodata = await Geodata.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!geodata) {
            return res.status(200).json({ message: 'Geodata not found' })
        }

        // Repond
        res.status(200).json({
            message: 'Successfully updated geodata',
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: geodata
        })

        console.log('Geodata updated successfully')
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid geodata data provided' })
        }
        return res.status(500).json({ message: 'Unspecified server error' })
    }
}

const deleteGeodata = async (req, res) => {
    try {
        // Setup
        const geodata = await Geodata.findByIdAndDelete(req.params.id)
            
        if (!geodata) {
            return res.status(200).json({ message: 'Geodata not found' })
        }

        // Respond
        res.status(200).json({
            message: 'Successfully deleted geodata',
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: 'Geodata deleted successfully'
        })

        console.log('Geodata deleted successfully')
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid geodata ID' })
        }
        return res.status(500).json({ message: 'Unspecified server error' })
    }
}

module.exports = {
    getAllGeodata,
    getGeodataById,
    createGeodata,
    deleteGeodata,
    updateGeodata
}
