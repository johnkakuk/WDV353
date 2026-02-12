const express = require('express')
const cors = require('cors')
const app = express()
const connectDB = require('./db/config')

connectDB();

app.use(express.json())
app.set('query parser', 'extended') // Allows for nested query objects, which is necessary for the new filter systems. Was this covered in class or am i missing something else?
app.use(cors())

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
