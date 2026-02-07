const express = require('express')
const router = express.Router({ mergeParams: true }) // Merge params needed for nested routes
const { getAllSongs, getSongById, createSong, deleteSong, updateSong } = require('../controllers/songController')

// GET all
router.get('/', getAllSongs)

// GET by ID
router.get('/:id', getSongById)

// POST
router.post('/', createSong)

// DELETE by ID
router.delete('/:id', deleteSong)

// PATCH by ID
router.patch('/:id', updateSong)

module.exports = router
