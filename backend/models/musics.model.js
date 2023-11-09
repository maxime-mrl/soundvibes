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
    tags: {
        type: String,
        trim: true,
        default: ""
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
musicSchema.index({ title: 'text', artist: 'text', tags: 'text' }, {
    default_language: "none",
    weight: {
        title: 8,
        artist: 4,
        tags: 1
    }
});

module.exports = mongoose.model("Musics", musicSchema);
