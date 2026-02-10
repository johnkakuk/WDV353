const mongoose = require("mongoose");

const geodataSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, maxlength: [50, "Name cannot exceed 50 characters"] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Geodata", geodataSchema);
