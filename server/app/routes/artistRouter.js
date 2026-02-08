const express = require('express')
const router = express.Router()
const albumRouter = require('./albumRouter')
const { getAllArtists, getArtistById, createArtist, deleteArtist, updateArtist } = require('../controllers/artistController')

// Nested route for albums by artist
router.use('/:artistId/albums', albumRouter)

// GET all
router.get('/', getAllArtists)

// GET by ID
router.get('/:id', getArtistById)

// POST
router.post('/', createArtist)

// DELETE by ID
router.delete('/:id', deleteArtist)

// PATCH by ID
router.patch('/:id', updateArtist)

module.exports = router
