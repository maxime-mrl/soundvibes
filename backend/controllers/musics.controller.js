const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const sizeOf = require('buffer-image-size');
const rootPath = require("../rootPath");
const musicModel = require("../models/musics.model");
const usersModel = require("../models/users.model");

const musicFolder = path.join(rootPath, "songs");

exports.postMusic = asyncHandler(async (req, res) => {
    /* ---------------------------- USER RIGHT CHECK ---------------------------- */
    if (req.user.right < 1) throw {
        message: `You are not authorized to do this!`,
        status: 403
    }
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { title, artist, tags } = req.body;
    const year = parseInt(req.body.year)
    if (!title || !artist || !year || !tags) throw { // check everything is here
        message: `Fields missing: ${(!title ? "title " : "")}${(!artist ? "artist " : "")}${(!year ? "year " : "")}${(!tags ? "tags" : "")}`,
        status: 400
    };
    // specific check
    if (!/^[-a-z0-9\s]+$/i.test(title)) throw {
        message: "Invalid title",
        status: 400
    };
    if (!/^[-a-z0-9\s]+$/i.test(artist)) throw {
        message: "Invalid artist",
        status: 400
    };
    if (!/^[-a-z0-9\s]+$/i.test(tags)) throw {
        message: "Invalid tags",
        status: 400
    };
    const actualYear = new Date().getFullYear()
    if (!year || year > actualYear) throw {
        message: 'Invalid published date',
        status: 400
    };
    /* ------------------------------- FILE CHECK ------------------------------- */
    if (!req.files || !req.files.audio || !req.files.cover) throw {
        message: "Missing file and/or audio cover",
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
    };
    if (cover.mimetype !== "image/jpeg" || !/^jpg$|^jpeg$/.test(cover.extension)) throw {
        message: "Incorrect cover image type, please use only .jpg or .jpeg files",
        status: 400
    };
    const coverSize = sizeOf(cover.data);
    if (coverSize.width < 256 || coverSize.width > 1024 || coverSize.width !== coverSize.height) throw {
        message: "Invalid image resolution! Please use only square image with a resolution between 256px and 1024px",
        status: 400
    };
    /* -------------------------- CHECK SONG UNIQUENESS ------------------------- */
    const similarMusic = await musicModel.findOne({ title, artist, year });
    if (similarMusic) throw {
        message: `This music from ${similarMusic.artist} named ${similarMusic.title} (id: ${similarMusic.id}) arleady exist`,
        status: 200
    };
    /* -------------------------------- SAVE SONG ------------------------------- */
    const newSong = await musicModel.create({ title, artist, year, tags });
    if (!newSong) throw new Error("Error while adding song to the database");

    await audio.mv(path.join(musicFolder, newSong.id, "audio.mp3"));
    await cover.mv(path.join(musicFolder, newSong.id, "cover.jpg"));
    res.status(200).json({
        status: `Song ${newSong.title} successfully added!`,
        id: newSong.id
    });
});

exports.playMusic = asyncHandler(async (req, res) => {
    /* ------------------------------- SERVE MUSIC ------------------------------ */
    const music = await musicInfos(req.params); // retrieve music infos while checking if exist etc
    // find file and file infos
    const musicPath = path.join(musicFolder, music.id, "audio.mp3");
    const { size:length } = fs.statSync(musicPath);
    const range = req.headers.range;
    /* ------------------------------ CREATE STREAM ----------------------------- */
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
    if (req.user.recentHistory[0] && req.user.recentHistory[0].equals(music.id)) return; // since readStream can make multiple request count listening only once every time (need to listen another song before listening again the same song be counted)
    /* ------------------------------- USER METRIC ------------------------------ */
    const HistoryExistingSong = req.user.fullHistory.findIndex(history => history.id.equals(music.id));
    if (HistoryExistingSong >= 0) req.user.fullHistory[HistoryExistingSong].count++;
    else req.user.fullHistory.push({ id: music._id, count: 1 });
    // update both full history (w/ unique song + listened count) and recent history where song can repeat
    await usersModel.findByIdAndUpdate(req.user.id, {
        $push: {
            recentHistory: {
                $each: [ music.id ],
                $position: 0
            }
        },
        $slice: {
            recentHistory: 20 // Limit the full history to 20 songs
        },
        $set: {
            fullHistory: req.user.fullHistory
        }
    });
    /* ------------------------------ MUSIC METRIC ------------------------------ */
    // handle the "listened after" metric
    const lastListend = req.user.recentHistory[0]; // req.user didn't got updated -> most recent song from it is the song before this one
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
});

exports.deleteMusic = asyncHandler(async (req, res) => {
    try {
        /* ------------------------- CHECK REQUEST VALIDITY ------------------------- */
        if (!req.user.right || req.user.right < 1) throw {
            message: `You are not authorized to do this!`,
            status: 403
        };
        const { id } = req.params
        if (!id) throw {
            message: "Missing music id",
            status: 400
        }
        if (!await musicModel.findById(id)) throw {
            message: "Music not found",
            status: 404
        }
        /* --------------------------------- DELETE --------------------------------- */
        const query = await musicModel.deleteOne({ _id: id });
        if (query.deletedCount !== 1) throw new Error(query);
        fs.rmSync(path.join(musicFolder, id), { recursive: true, force: true });
        res.status(200).json({ status: `Successfully deleted music ${id}` });
    } catch (err) {
        if (err.code == 'ENOENT') throw { message: "No such file or directory" };
        else throw(err);
    }
});

exports.getInfos = asyncHandler(async (req, res) => {
    /* ---------------------------- GET MUSICS INFOS ---------------------------- */
    const music = await musicInfos(req.params);
    res.status(200).json({
        title: music.title,
        artist: music.artist,
        year: music.year
    })
});

exports.searchMusic = asyncHandler(async (req, res) => {
    /* ------------------------------ REQUEST CHECK ----------------------------- */
    const searchQuery = req.params.query;
    if (!searchQuery || !/^[-a-z0-9\s]+$/i.test(searchQuery)) throw {
        message: "Missing search query" + searchQuery,
        status: 400
    };
    /* --------------------------------- SEARCH --------------------------------- */
    let filteredMusics;
    if (searchQuery.split(" ").length === 1) { // if word assume it's not finished so the mongoose search based on words is not the best
        // basic search, not aware of word or anythings like that
        filteredMusics = await musicFinder({ regexQuery: searchQuery });
        // if "dumb" search didn't worked try the more advance one
        if (filteredMusics.length < 1) filteredMusics = await musicFinder({ textQuery: searchQuery });
    } else { // if multiple word execute a combinaison of advance (the first entire words) and basic search (last word which may be incomplete)
        // isolate last word from query and create another query without last word
        const lastWord = searchQuery.split(" ")[searchQuery.split(" ").length -1];
        const textQuery = searchQuery.replace(/(\s+\S+)$/, "");
        filteredMusics = await musicFinder({ textQuery, regexQuery: lastWord });
    }
    /* ----------------------------- RESPONSE RESULT ---------------------------- */
    if (filteredMusics.length > 0) res.status(200).json(filteredMusics);
    else res.status(200).json([ "No musics found" ]);
});



function musicFinder({textQuery, regexQuery}) { // search musics query
    const query = {};
    if (regexQuery) query["$or"] = [
        { title: { $regex: regexQuery, $options: 'i' } },
        { artist: { $regex: regexQuery, $options: 'i' } },
        { tags: { $regex: regexQuery, $options: 'i' } },
    ];
    if (textQuery) query["$text"] = { $search: textQuery };
    return musicModel.find(query)
        .select("title artist year")
        .sort([["listenedCount", -1]]);
}

async function musicInfos({ id }) {
    /* ------------------------ CHECK EVERYTHING IS HERE ------------------------ */
    if (!id) throw { // music id
        message: "Missing music id",
        status: 400
    };
    try {
        // search in db
        const music = await musicModel.findOne({ _id: id });
        if (!music) throw {
            message: "Music not found",
            code: 404
        };
        return music;
    } catch(err) {
        if (err.kind === "ObjectId") throw {
            message: "Invalid ID",
            code: 400
        };
        throw err;
    }
}
