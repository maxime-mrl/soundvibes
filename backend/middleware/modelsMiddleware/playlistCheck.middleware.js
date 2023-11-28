const musicsModel = require("../../models/musics.model");

module.exports = async function(next) {
    const { content, name } = this._update ? this._update : this; // get the playlist infos to check them (when updating it will be this._update else this)
    /* ---------------------- check playlist name validity ---------------------- */
    if (!/^[-a-z0-9\s]+$/i.test(name)) throw {
        message: `Please enter a valid playlist title`,
        status: 400
    };
    /* ------------------------------ musics check ------------------------------ */
    if (!Array.isArray(content) || content.length < 1) throw { // musics format is good
        message: "Invalid musics",
        status: 400
    }
    try { // every musics exists
        for (const musicId of content) { // for of instead of foreach to keep the async
            const music = await musicsModel.findOne({ _id: musicId });
            if (!music) throw {
                message: "Invalid musics",
                status: 404
            }
        }
    } catch(err) {
        if (err.kind === "ObjectId") throw {
            message: "Invalid music ID",
            status: 400
        }
        throw err;
    }
    /* --------------------------- set content length --------------------------- */
    // (used later to check that every songs are valid)
    if (this._update) this._update.contentLength = content.length;
    else this.contentLength = content.length;
    /* -------------------- everythings is good => save to db ------------------- */
    next();
}
