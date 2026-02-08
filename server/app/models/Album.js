const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, maxlength: [50, "Name cannot exceed 50 characters"] },
        artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
        genre: { type: String, maxlength: [50, "Genre cannot exceed 50 characters"], enum: ["Pop", "Rock", "Hip Hop", "R&B", "Country", "Jazz", "Classical", "Electronic", "Folk", "Other"] },
        runtime: Number,
        releaseYear: { type: Number, min: [1900, "Release year cannot be before 1900"], max: [new Date().getFullYear(), "Release year cannot be in the future"] }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Album", albumSchema);
