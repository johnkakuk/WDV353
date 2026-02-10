const express = require('express')
const router = express.Router()
const { getAllGeodata, getGeodataById, createGeodata, deleteGeodata, updateGeodata } = require('../controllers/geodataController')

// Route map for geodata CRUD + weather lookup flow

// GET all
router.get('/', getAllGeodata)

// GET by ID
router.get('/:id', getGeodataById)

// POST
router.post('/', createGeodata)

// DELETE by ID
router.delete('/:id', deleteGeodata)

// PATCH by ID
router.patch('/:id', updateGeodata)

module.exports = router
