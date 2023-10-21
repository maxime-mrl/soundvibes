const asyncHandler = require("express-async-handler");
const musicModel = require("../models/musics.model");
const sizeOf = require('buffer-image-size');
const fs = require("fs");
const path = require("path");
const rootPath = require("../rootPath");

exports.postMusic = asyncHandler(async (req, res) => {
    // not used for test
    // if (req.user.right < 1) throw {
    //     message: `You are not authorized to do this!`,
    //     status: 403
    // }
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { title, artist, genre } = req.body;
    const year = parseInt(req.body.year)
    if (!title || !artist || !year || !genre) throw {
        message: `fields missing: ${(!title ? "title " : "")}${(!artist ? "artist " : "")}${(!year ? "year " : "")}${(!genre ? "genre" : "")}`,
        status: 400
    };
    if (!/^[-a-z0-9\s]+$/i.test(title)) throw {
        message: "invalid title",
        status: 400
    }
    if (!/^[-a-z0-9\s]+$/i.test(artist)) throw {
        message: "invalid artist",
        status: 400
    }
    if (!/^[-a-z0-9]+$/i.test(genre)) throw {
        message: "invalid genre",
        status: 400
    }
    const actualYear = new Date().getFullYear()
    if (!year || year > actualYear) throw {
        message: 'invalid published date',
        status: 400
    }
    /* ------------------------------- FILE CHECK ------------------------------- */
    if (!req.files || !req.files.audio || !req.files.cover) throw {
        message: "missing file and/or audio cover",
        status: 400
    };
    const { audio, cover } = req.files;
    // get files extension (used to check file validity)
    audio.extension = audio.name.split('.')[audio.name.split('.').length - 1].toLowerCase();
    cover.extension = cover.name.split('.')[cover.name.split('.').length - 1].toLowerCase();
    // check inputed files type
    if (audio.mimetype !== "audio/mpeg" || audio.extension !== "mp3") throw {
        message: "Incorrect audio type, please use only .mp3 files",
        status: 400
    }
    if (cover.mimetype !== "image/jpeg" || !/^jpg$|^jpeg$/.test(cover.extension)) throw {
        message: "Incorrect cover image type, please use only .jpg or .jpeg files",
        status: 400
    }
    const coverSize = sizeOf(cover.data);
    if (coverSize.width < 256 || coverSize.width > 1024 || coverSize.width !== coverSize.height) throw {
        message: "invalid image resolution! Please use only square image with a resolution between 256px and 1024px",
        status: "400"
    }
    /* -------------------------- CHECK SONG UNIQUENESS ------------------------- */
    const similarMusic = await musicModel.findOne({ title, artist, year, genre });
    if (similarMusic) throw {
        message: `this music from ${similarMusic.artist} named ${similarMusic.title} (id: ${similarMusic._id}) arleady exist`,
        status: 200
    }
    /* -------------------------------- SAVE SONG ------------------------------- */
    const newSong = await musicModel.create({ title, artist, year, genre });
    if (!newSong) throw new Error("Error while adding song to the database");

    await audio.mv(`${rootPath}/public/songs/${newSong._id}/audio.mp3`);
    await cover.mv(`${rootPath}/public/songs/${newSong._id}/cover.jpg`);
    res.status(200).json({
        status: `Song ${newSong.title} successfully added!`,
        id: newSong._id,
    })
})

exports.deleteMusic = asyncHandler(async (req, res) => {
    try {
        /* ------------------------- CHECK REQUEST VALIDITY ------------------------- */
        if (!req.user.right || req.user.right < 1) throw {
            message: `You are not authorized to do this!`,
            status: 403
        };
        const { id } = req.params
        if (!id) throw {
            message: "missing music id",
            status: 400
        }
        if (!await musicModel.findById(id)) throw {
            message: "music not found",
            status: 404
        }
        /* --------------------------------- DELETE --------------------------------- */
        const query = await musicModel.deleteOne({ _id: id });
        if (!query.acknowledged) throw new Error(query);
        fs.unlinkSync(path.join(rootPath, "public", "songs", id, "audio.mp3"));
        fs.unlinkSync(path.join(rootPath, "public", "songs", id, "cover.jpg"));
        fs.rmdirSync(path.join(rootPath, "public", "songs", id));
        res.status(200).json({
            deleted: id
        });
    } catch (err) {
        if (err.code == 'ENOENT') throw {
            message: "no such file or directory",
        }
        throw(err)
    }
})

exports.getInfos = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) throw {
        message: "missing music id",
        status: 400
    }
    try {
        const music = await musicModel.findOne({ _id: id });
        if (!music) throw {
            message: "music not found",
            code: 404
        }
        console.log(music)
        res.status(200).json({
            title: music.title,
            artist: music.artist,
            genre: music.genre,
            year: music.year,
        })
    } catch(err) {
        if (err.kind === "ObjectId") throw {
            message: "Invalid ID",
            code: 400
        }
        console.log(err)
        throw err
    }
})

exports.searchMusic = asyncHandler(async (req, res) => {
    res.end("Work in progress")
})
