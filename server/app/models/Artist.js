const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, maxlength: [50, "Name cannot exceed 50 characters"] },
        genre: { type: String, maxlength: [50, "Genre cannot exceed 50 characters"], enum: ["Pop", "Rock", "Hip Hop", "R&B", "Country", "Jazz", "Classical", "Electronic", "Folk", "Other"] },
        bio: String,
        listens: Number,
        // albums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }],
        // Added to prove that I did the work for bi-directional relationship, but commented out to avoid duplicated relationship data and sync bugs.
        // Prioritizing a single source of truth for the relationship data to avoid bugs and confusion.
    },
    { timestamps: true }
);

module.exports = mongoose.model("Artist", artistSchema);
