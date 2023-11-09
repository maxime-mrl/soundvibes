const mongoose = require("mongoose");

const recommendationsSchema = mongoose.Schema({
    name: {
        type: String,
    },
    targetUser: {
        type: mongoose.Schema.Types.ObjectId,
    },
    content: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Musics" }],
    },
}, { timestamps: true });

module.exports = mongoose.model("Recomendations", recommendationsSchema);
