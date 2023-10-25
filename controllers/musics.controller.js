const asyncHandler = require("express-async-handler");
const sizeOf = require('buffer-image-size');
const fs = require("fs");
const path = require("path");
const musicModel = require("../models/musics.model");
const rootPath = require("../rootPath");
const usersModel = require("../models/users.model");

const musicFolder = path.join(rootPath, "public", "songs");

exports.postMusic = asyncHandler(async (req, res) => {
    if (req.user.right < 1) throw {
        message: `You are not authorized to do this!`,
        status: 403
    }
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
        message: `this music from ${similarMusic.artist} named ${similarMusic.title} (id: ${similarMusic.id}) arleady exist`,
        status: 200
    }
    /* -------------------------------- SAVE SONG ------------------------------- */
    const newSong = await musicModel.create({ title, artist, year, genre });
    if (!newSong) throw new Error("Error while adding song to the database");

    await audio.mv(path.join(musicFolder, newSong.id, "audio.mp3"));
    await cover.mv(path.join(musicFolder, newSong.id, "cover.jpg"));
    res.status(200).json({
        status: `Song ${newSong.title} successfully added!`,
        id: newSong.id,
    })
})

exports.playMusic = asyncHandler(async (req, res) => {
    /* ------------------------------- SERVE MUSIC ------------------------------ */
    const music = await musicInfos(req.params); // retrieve music infos w/ checking if exist etc
    // find file and file infos
    const musicPath = path.join(musicFolder, music.id, "audio.mp3");
    const { size:length } = fs.statSync(musicPath);
    const range = req.headers.range;
    let readStream;
    res.setHeader('Content-type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    if (range) { // adapted from https://gist.github.com/DingGGu/8144a2b96075deaf1bac
        let [start, end] = range.replace(/bytes=/, "").split("-");
        if ((typeof start !== 'string' && start.length > 1) || (typeof end !== 'string' && end.length > 1)) throw {
            message: "Incomplete chunked encoding",
            status: 500,
        }
        start = parseInt(start);
        end = end ? parseInt(end) : length - 1;
        const contentLength = (end - start) + 1;
        res.status(206);
        res.setHeader('Content-length', contentLength);
        res.header('Content-Range', `bytes ${start}-${end}/${length}`);
        readStream = fs.createReadStream(musicPath, {start: start, end: end});
    } else {
        res.status(200);
        res.setHeader('Content-length', length);
        res.header('Content-Range', `bytes 0-${length-1}/${length}`);
        readStream = fs.createReadStream(musicPath);
    }
    readStream.pipe(res);
    /* --------------------------------- METRIC --------------------------------- */
    if (!req.user) return; // make sure user is here
    if (req.user.listeningHistory[0] === music.id) return; // since readStream can make multiple request count listening only once every time (need to listen another song before listening again the same song be counted)
    // --- log to user history ---
    await usersModel.findByIdAndUpdate(req.user.id, {
        $push: {
            listeningHistory: {
                $each: [ music.id ],
                $position: 0
            }
        }
    });
    // --- log for music ---
    // handle the "listened after" metric (used as similar music because if most of users listen two music in a row they must be related)
    const lastListend = req.user.listeningHistory[0]; // since we didn't updated req.user the most recent music is the one before the actual (this one)
    if (!lastListend) return; // if user hasn't ever listened something
    // either create a new line for "similar" or increment the music
    const existingIndex = music.similar.findIndex(similar => similar[0] === lastListend);
    if (existingIndex >= 0) music.similar[existingIndex][1]++;
    else music.similar.push([ lastListend, 1 ]);
    // update the music in db
    await musicModel.findByIdAndUpdate(music.id, {
        $inc: { listenedCount: 1 },
        similar: music.similar
    });
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
        if (query.deletedCount !== 1) throw new Error(query);
        fs.rmSync(path.join(musicFolder, id), { recursive: true, force: true });
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
    const music = await musicInfos(req.params);
    // const cover = fs.readFileSync(path.join(musicFolder, music.id, "cover.jpg")).toString('base64');
    res.status(200).json({
        title: music.title,
        artist: music.artist,
        genre: music.genre,
        year: music.year,
    })
})

exports.searchMusic = asyncHandler(async (req, res) => {
    const searchQuery = req.params.query
    if (!searchQuery || !/[a-z]/i.test(searchQuery)) throw {
        message: "Missing search query",
        status: 400,
    }
    // search
    let filteredMusics;
    if (searchQuery.split(" ").length === 1) {
        // basic search, not aware of word or anythings like that
        filteredMusics = await musicFinder({ $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { artist: { $regex: searchQuery, $options: 'i' } }
        ] });
        // if "dumb" search didn't worked try the more advance one
        if (filteredMusics.length < 1) filteredMusics = await musicFinder({ $text: { $search: searchQuery } });
    } else { // if multiple word execute a combinaison of advance (the first entire words) and basic search (last word which may be incomplete)

        // isolate last word from query and create another query without last word
        const lastWord = new RegExp(searchQuery.split(" ")[searchQuery.split(" ").length -1], "i");
        const textQuery = searchQuery.replace(/(\s+\S+)$/, "");
        filteredMusics = await musicFinder({
            $text: { $search: textQuery },
            $or: [
                { title: { $regex: lastWord } },
                { artist: { $regex: lastWord } }
            ]
        });
    }
    res.status(200).json(filteredMusics)
});



function musicFinder(query) {
    return musicModel.find(query)
        .select("title artist year genre")
        .sort([["listenedCount", -1]]);
}

async function musicInfos({ id }) {
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
        return music;
    } catch(err) {
        if (err.kind === "ObjectId") throw {
            message: "Invalid ID",
            code: 400
        }
        throw err
    }
}
