const mongoose = require("mongoose");
const playlistCheck = require("../middleware/modelsMiddleware/playlistCheck.middleware")
const errorsHandler = require("../middleware/modelsMiddleware/errorsHandler.middleware");

const playlistSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    content: {
        type: Array,
        default: []
    },
}, { timestamps: true });


playlistSchema.pre(['updateOne', 'update', 'findOneAndUpdate', 'save'], playlistCheck);
playlistSchema.post(['updateOne', 'update', 'findOneAndUpdate', 'save'], errorsHandler);

module.exports = mongoose.model("Playlists", playlistSchema);
