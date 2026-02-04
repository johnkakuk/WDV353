const express = require('express')
const router = express.Router()
const fs = require('node:fs/promises')

async function readFromFile() {
    try {
        return JSON.parse(await fs.readFile('users.json', 'utf8'))
    } catch (err) {
        console.error('Error reading file:', err)
        return null
    }
}

// Add new user to users.json
async function writeToFile(data) {
    try {
        // Get new ID
        const existingData = JSON.parse(await fs.readFile('users.json', 'utf8'))

        // Prepend newId to data
        data.id = existingData.users.length + 1
        existingData.users.push(data)

        // Write JSON to file
        await fs.writeFile('users.json', JSON.stringify(existingData, null, 2), 'utf8')

        console.log('File written successfully')
        return true
    } catch (err) {
        console.error('Error writing file:', err)
        return false
    }
}

// GET all
router.get('/', async (req, res) => {
    const data = await readFromFile()

    if(!data) {
        res.status(500).json({
            message: 'Error reading from file'
        })
    } else {
        res.status(200).json({
            message: 'GET - all users',
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: data
        })
    }
})

// GET by ID
router.get('/:id', async (req,res) => {
    const { id } = req.params
    const data = await readFromFile()
    const user = data.users.find(user => user.id === parseInt(id))

    if(user) {
        res.status(200).json({
            message: `GET - user with ID ${id}`,
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: user
        })
    } else {
        res.status(404).json({
            message: `User with ID ${id} not found`
        })
    }
})

// POST
router.post('/', async (req, res) => {
    // Setup
    const { data } = req.body

    // Try to write to file
    if(await writeToFile(data)) {

        // Respond
        res.status(200).json({
            message: 'POST - root',
            metadata: {
                hostname: req.hostname,
                method: req.method,
            }
        })
    } else {
        res.status(500).json({
            message: 'Error writing to file'
        })
    }  
})

// DELETE by ID
router.delete('/:id', async (req, res) => {
    // Setup
    const { id } = req.params
    const data = await readFromFile()
    const userIndex = data.users.findIndex(user => user.id === parseInt(id))

    if(userIndex !== -1) {
        // "Delete" user by anonymizing data, preserving ID for record-keeping/sequential integrity
        data.users[userIndex].name = 'DELETED'
        data.users[userIndex].age = null

        // Apply to file
        await fs.writeFile('users.json', JSON.stringify(data, null, 2), 'utf8')

        // Repond
        res.status(200).json({
            message: `DELETE - user with ID ${id}`,
            metadata: {
                hostname: req.hostname,
                method: req.method,
            }
        })

        console.log('User deleted successfully')
    } else {
        res.status(404).json({
            message: `User with ID ${id} not found`
        })
    }
})

// PATCH by ID
router.patch('/:id', async (req, res) => {
    // Setup
    const { id } = req.params
    const { data: newData } = req.body
    const data = await readFromFile()
    const userIndex = data.users.findIndex(user => user.id === parseInt(id))
    console.log(newData)
    if(userIndex !== -1) {
        // Update info if applicable
        data.users[userIndex].name = newData.name || data.users[userIndex].name
        data.users[userIndex].age = newData.age || data.users[userIndex].age

        // Apply to file
        await fs.writeFile('users.json', JSON.stringify(data, null, 2), 'utf8')

        // Respond
        res.status(200).json({
            message: `PATCH - user with ID ${id}`,
            metadata: {
                hostname: req.hostname,
                method: req.method,
            },
            result: data.users[userIndex]
        })
    } else {
        res.status(404).json({
            message: `User with ID ${id} not found`
        })
    }
})

module.exports = router