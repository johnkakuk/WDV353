const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, maxlength: [50, "Name cannot exceed 50 characters"] },
        artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
        album: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: true },
        duration: Number,
        genre: { type: String, maxlength: [50, "Genre cannot exceed 50 characters"], enum: ["Pop", "Rock", "Hip Hop", "R&B", "Country", "Jazz", "Classical", "Electronic", "Folk", "Other"] },
        trackNumber: { type: Number, default: 0 },
        trackNumberOf: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Song", songSchema);
