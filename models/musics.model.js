const mongoose = require("mongoose");

const musicSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    artist: {
        type: String,
        trim: true,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    genre: {
        type: String,
        trim: true,
        required: true,
    },
    similar: {
        type: Array,
        default: []
    },
    listenedCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("Musics", musicSchema);
