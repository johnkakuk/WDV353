const mongoose = require('mongoose')

// One place to manage Mongo connection logic for the app
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        // Fail fast if DB is down so we do not run half-alive
        console.log(`Error: ${error.message}`)
        process.exit(1)
    }
}

module.exports = connectDB;
