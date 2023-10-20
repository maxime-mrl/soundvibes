const asyncHandler = require("express-async-handler");
const musicModel = require("../models/musics.model");

exports.postMusic = asyncHandler(async (req, res) => {
    // not used for test
    // if (req.user.right < 1) throw {
    //     message: `You are not authorized to do this!`,
    //     status: 403
    // }
    // const { title, artist, year, genre } = req.body;
    if (!req.files || !req.files.audio || !req.files.cover) throw {
        message: "missings files audio and/or cover",
        status: 400
    }
    const { audio, cover } = req.files;
    const id = "65323b8b569d32e100a620b4"; // next the id will be retrived from the added music in db but for now will do for test
    await audio.mv(`${"."}/songs/${id}/audio.mp3`);
    await cover.mv(`${"."}/songs/${id}/cover.jpg`);
    res.status(200).json({ status:"test" })
})