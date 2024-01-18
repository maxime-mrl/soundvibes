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
    };
    // no need to check if music exist because done automaticlly on every playlist get
    /* -------------------- everythings is good => save to db ------------------- */
    next();
};
