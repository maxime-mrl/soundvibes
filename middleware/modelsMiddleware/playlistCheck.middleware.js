const musicsModel = require("../../models/musics.model");

module.exports = async function(next) {
    const { content, name } = this._update ? this._update : this; // get the playlist infos to check them
    // check playlist name validity
    if (!/^[-a-z0-9]+$/i.test(name)) throw {
        message: `Please enter a valid playlist title`,
        status: 400
    };
    // musics check
    if (!Array.isArray(content) || content.length < 1) throw {
        message: "Invalid musics",
        code: 400
    }
    try {
        for (const musicId of content) { // for of instead of foreach to keep the async
            const music = await musicsModel.findOne({ _id: musicId });
            if (!music) throw {
                message: "Invalid musics",
                code: 404
            }
        }
    } catch(err) {
        if (err.kind === "ObjectId") throw {
            message: "Invalid music ID",
            code: 400
        }
        throw err;
    }
    // everythings is good => save to db
    next()
}
