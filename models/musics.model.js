const mongoose = require("mongoose");

const musicSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        // required: true,
        default: "test-title"
    },
    artist: {
        type: String,
        trim: true,
        // required: true,
        default: "test-artist"
    },
    year: {
        type: Number,
        // required: true,
        default: 2000
    },
    genre: {
        type: String,
        trim: true,
        // required: true,
        default: "test-genre"
    },
    similar: {
        type: Array,
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model("Musics", musicSchema);
