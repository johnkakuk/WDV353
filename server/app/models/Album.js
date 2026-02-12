const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, maxlength: [50, "Name cannot exceed 50 characters"] },
        artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
        genre: { type: String, maxlength: [50, "Genre cannot exceed 50 characters"], enum: ["Pop", "Rock", "Hip Hop", "R&B", "Country", "Jazz", "Classical", "Electronic", "Folk", "Other"] },
        runtime: Number,
        releaseYear: { type: Number, min: [1900, "Release year cannot be before 1900"], max: [new Date().getFullYear(), "Release year cannot be in the future"] }
        // trackList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
        // Added to prove that I did the work for bi-directional relationship, but commented out to avoid duplicated relationship data and sync bugs.
        // Prioritizing a single source of truth for the relationship data to avoid bugs and confusion.
    },
    { timestamps: true }
);

module.exports = mongoose.model("Album", albumSchema);
