const mongoose = require("mongoose");
const playlistCheck = require("../middleware/modelsMiddleware/playlistCheck.middleware");
const errorsHandler = require("../middleware/modelsMiddleware/errorsHandler.middleware");

const playlistSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    content: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Musics" }],
        default: []
    },
    contentLength: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// check to make sure playlist format are good
playlistSchema.pre(["updateOne", "update", "findOneAndUpdate", "save"], playlistCheck);
// customize error thrown by mongoose
playlistSchema.post(["updateOne", "update", "findOneAndUpdate", "save"], errorsHandler);

module.exports = mongoose.model("Playlists", playlistSchema);
