// Database stuff
const express = require('express')
const app = express()
const connectDB = require('./db/config')

connectDB();

app.use(express.json())

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

app.use("/geo-data", require('./routes/geodataRouter'))

module.exports = app
