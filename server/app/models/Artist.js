const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, maxlength: [50, "Name cannot exceed 50 characters"] },
        genre: { type: String, maxlength: [50, "Genre cannot exceed 50 characters"], enum: ["Pop", "Rock", "Hip Hop", "R&B", "Country", "Jazz", "Classical", "Electronic", "Folk", "Other"] },
        bio: String,
        listens: Number,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Artist", artistSchema);
