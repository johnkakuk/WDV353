const Geodata = require('../models/Geodata')
const { getWeatherData } = require('../getWeather')

// Get all stored geodata
const getAllGeodata = async (req, res) => {
    try {
        // One endpoint, two jobs:
        // 1) if lat/lon exist, fetch + store live weather
        // 2) if no lat/lon, query stored docs with filters/paging/sort
        const { page = 1, limit = 10, sort, ...filter } = req.query
        const skip = (parseInt(page) - 1) * parseInt(limit)  
        // Turn query operators like gte/lt/in into Mongo operators ($gte/$lt/$in)
        const parsedFilter = JSON.parse(JSON.stringify(filter).replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`))
        const { lat, lon } = filter

        // Validate query parameters
        if ((lat && !lon) || (!lat && lon)) {
            return res.status(400).json({ message: 'Latitude and longitude are required' })
        }

        // Fetch weather data for the provided coordinates
        if (lat && lon) {
            const geodata = await getWeatherData(lat, lon)

            if (!geodata) {
                return res.status(200).json({ message: 'Not found' })
            }

            // Save the geodata to the database
            const newGeodata = await Geodata.create({
                name: geodata.name || `Geodata for (${lat}, ${lon})`,
                longitutde: lon,
                latitude: lat,
                weatherData: geodata.main,
                visibility: geodata.visibility,
                wind: geodata.wind,
                clouds: geodata.clouds
            })

            return res.status(200).json({
                message: 'Successfully retrieved and stored geodata for provided coordinates',
                metadata: {
                    hostname: req.hostname,
                    method: req.method,
                },
                // Keep response small and hand back the new doc id
                result: `ID: ${newGeodata._id}`
            })
        }

        // If no coordinates are provided, return all stored geodata
        else {
            // Build base query, then conditionally layer on sorting
            let query = Geodata.find(parsedFilter)
                    .skip(skip)
                    .limit(parseInt(limit, 10))

            if (sort) {
                query = query.sort(sort.split(',').join(' '))
            }

            const geodata = await query

            if (!geodata || geodata.length === 0) {
                return res.status(200).json({ message: 'No geodata found' })
            }

            return res.status(200).json({
                message: 'Successfully retrieved all stored geodata',
                metadata: {
                    hostname: req.hostname,
                    method: req.method,
                },
                result: geodata
            })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Unspecified server error' })
    }
}

// Get one geodata record by Mongo id
const getGeodataById = async (req, res) => {
    try {
        const geodata = await Geodata.findById(req.params.id)

        if (!geodata) {
            return res.status(200).json({ message: 'Geodata not found' })
        }

        res.status(200).json({
            message: `Successfully retrieved geodata with ID ${req.params.id}`,
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: geodata
        })

        console.log('Geodata found')
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid geodata ID' })
        }
        return res.status(500).json({ message: 'Unspecified server error' })
     }
}

// Create geodata directly from request payload
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

// Patch one geodata record by id
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

// Delete one geodata record by id
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
