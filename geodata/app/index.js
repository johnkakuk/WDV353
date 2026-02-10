// Database stuff
const express = require('express')
const app = express()
const connectDB = require('./db/config')

// Rate limiting
const { rateLimit } = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    message: 'Too many requests from this IP, please try again after 15 minutes'
})

// Connect once when app spins up
connectDB();

// Parse JSON request bodies for POST/PATCH payloads
app.use(express.json())
app.set('query parser', 'extended') // Allows for nested query objects, which is necessary for the new filter systems. Was this covered in class or am i missing something else?
app.use(limiter) // Apply rate limiting to all requests

// localhost:3000/
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'GET - root',
        metadata: {
            hostname: req.hostname,
            method: req.method,
        },
    })
})

// Keep feature routes grouped under /geodata
app.use("/geodata", require('./routes/geodataRouter'))

module.exports = app
