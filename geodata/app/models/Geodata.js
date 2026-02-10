const mongoose = require("mongoose");

// Pretty loose schema on purpose so weather payload chunks can be stored directly
const geodataSchema = new mongoose.Schema(
    {
        name: String,
        longitutde: Number,
        latitude: Number,
        weatherData: Object,
        visibility: Number,
        wind: Object,
        clouds: Object
    },
    { timestamps: true }
);

module.exports = mongoose.model("Geodata", geodataSchema);
