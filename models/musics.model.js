const mongoose = require("mongoose");
// const errorsHandler = require("../middleware/modelsMiddleware/errorsHandler.middleware");
// const userCheck = require("../middleware/modelsMiddleware/userCheck.middleware");

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

// userSchema.pre(['updateOne', 'update', 'findOneAndUpdate', 'save'], userCheck);
// userSchema.post(['updateOne', 'update', 'findOneAndUpdate', 'save'], errorsHandler);

module.exports = mongoose.model("Musics", musicSchema);
