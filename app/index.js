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

// Added three shiny new routers
app.use("/songs", require('./routes/songRouter'))
app.use("/albums", require('./routes/albumRouter'))
app.use("/artists", require('./routes/artistRouter'))

module.exports = app