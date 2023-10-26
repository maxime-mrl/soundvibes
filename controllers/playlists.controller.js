const assyncHandler = require("express-async-handler");
const playlistModel = require("../models/playlists.model");
const musicModel = require("../models/musics.model");

exports.createPlaylist = assyncHandler(async (req, res) => {
    // data format check
    const { name, musics } = req.body;
    const { id:owner } = req.user;
    if (!musics || !JSON.parse(musics) || !name  || !owner) throw {
        message: "missing data",
        code: 400
    }
    const content = JSON.parse(musics);
    if (!Array.isArray(content) || content.length < 1) throw {
        message: "Invalid musics",
        code: 400
    }
    // check that every music are ok
    try {
        for (const musicId of content) { // for of instead of foreach to keep the async
            const music = await musicModel.findOne({ _id: musicId });
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
        throw err
    }
    // everything ok, add the playlist
    const newPlaylist = await playlistModel.create({ name, content, owner });
    if (!newPlaylist) throw new Error("Error while adding playlist, please try again later");
    res.status(200).json({
        status: `Playlist ${newPlaylist.name} successfully created!`,
        id: newPlaylist.id,
    })
})
