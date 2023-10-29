const mongoose = require("mongoose");

const musicSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    artist: {
        type: String,
        trim: true,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        trim: true,
        required: true
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

// index used for search musics
musicSchema.index({ title: 'text', artist: 'text' }, {
    default_language: "none",
    weight: {
        title: 2,
        artist: 1
    }
});

module.exports = mongoose.model("Musics", musicSchema);
