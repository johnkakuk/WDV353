const express = require('express')
const router = express.Router({ mergeParams: true }) // Merge params needed for nested routes
const songRouter = require('./songRouter')
const { getAllAlbums, getAlbumById, createAlbum, deleteAlbum, updateAlbum } = require('../controllers/albumController')

// Nested route for songs by album
router.use('/:albumId/songs', songRouter)

// GET all
router.get('/', getAllAlbums)

// GET by ID
router.get('/:id', getAlbumById)

// POST
router.post('/', createAlbum)

// DELETE by ID
router.delete('/:id', deleteAlbum)

// PATCH by ID
router.patch('/:id', updateAlbum)

module.exports = router
