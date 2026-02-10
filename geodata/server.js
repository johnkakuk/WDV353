const http = require('http')
require('dotenv').config();
const app =  require('./app/')

// Keep bootstrapping tiny here: create the server and hand everything else to app/
const server = http.createServer(app)

// Start listening with whatever PORT is in .env
server.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`)
})
