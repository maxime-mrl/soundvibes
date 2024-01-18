const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const sizeOf = require('buffer-image-size');
const rootPath = require("../rootPath");
const musicModel = require("../models/musics.model");
const usersModel = require("../models/users.model");

const musicFolder = path.join(rootPath, "songs");
const musicTextRegex = /^[()'-a-z0-9\s]+$/i;

/* -------------------------------------------------------------------------- */
/*                                 ADD A MUSIC                                */
/* -------------------------------------------------------------------------- */
exports.postMusic = asyncHandler(async (req, res) => {
    /* ---------------------------- USER RIGHT CHECK ---------------------------- */
    if (req.user.right < 1) throw {
        message: `You are not authorized to do this!`,
        status: 403
    };
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { title, artist, tags } = req.body;
    const year = parseInt(req.body.year);
    if (!title || !artist || !year || !tags || !req.files || !req.files.audio || !req.files.cover) throw { // check everything is here
        message: "At least one missing field", // no specific error since the frontend should arleady warn
        status: 400
    };
    // validity check
    if (!musicTextRegex.test(title) || !musicTextRegex.test(artist) || !/^[-a-z0-9\s]+$/i.test(tags)) throw {
        message: "At least one invalid entry",
        status: 400
    };
    const actualYear = new Date().getFullYear();
    if (!year || year > actualYear) throw {
        message: 'Invalid published date',
        status: 400
    };
    /* ------------------------------- FILE CHECK ------------------------------- */
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
    // db
    const newSong = await musicModel.create({ title, artist, year, tags });
    if (!newSong) throw new Error("Error while adding song to the database");
    // files
    await audio.mv(path.join(musicFolder, newSong.id, "audio.mp3"));
    await cover.mv(path.join(musicFolder, newSong.id, "cover.jpg"));
    // response
    res.status(200).json({
        status: `Song ${newSong.title} successfully added!`,
        id: newSong.id
    });
});

/* -------------------------------------------------------------------------- */
/*                                 PLAY MUSIC                                 */
/* -------------------------------------------------------------------------- */
exports.playMusic = asyncHandler(async (req, res) => {
    /* ------------------------------- SERVE MUSIC ------------------------------ */
    const music = await getMusicInfos(req.params); // retrieve music infos and check if exist
    // find file and file infos
    const musicPath = path.join(musicFolder, music.id, "audio.mp3");
    const { size:length } = fs.statSync(musicPath);
    const range = req.headers.range;
    /* ------------------------------ CREATE STREAM ----------------------------- */
    let readStream;
    res.setHeader('Content-type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    // if range present client only want a part of the audio
    if (range) { // adapted from https://gist.github.com/DingGGu/8144a2b96075deaf1bac
        // parse start and end point
        let [start, end] = range.replace(/bytes=/, "").split("-");
        if ((typeof start !== 'string' && start.length > 1) || (typeof end !== 'string' && end.length > 1)) throw {
            message: "Incomplete chunked encoding",
            status: 500,
        };
        start = parseInt(start);
        end = end ? parseInt(end) : length - 1;
        // add the length/range headers
        const contentLength = (end - start) + 1;
        res.status(206);
        res.setHeader('Content-length', contentLength);
        res.header('Content-Range', `bytes ${start}-${end}/${length}`);
        // create the stream
        readStream = fs.createReadStream(musicPath, {start: start, end: end});
    } else {
        // create the full stream
        res.status(200);
        res.setHeader('Content-length', length);
        res.header('Content-Range', `bytes 0-${length-1}/${length}`);
        readStream = fs.createReadStream(musicPath);
    }
    readStream.pipe(res); // send the stream

    /* --------------------------------- METRIC --------------------------------- */
    if (!req.user) return; // make sure user is here
    if (req.user.recentHistory[0] && req.user.recentHistory[0].equals(music.id)) return; // since readStream can make multiple request count listening only once every time (need to listen another song before listening again the same song or it won't be counted)
    /* ------------------------------- USER METRIC ------------------------------ */
    // full history (every song added only once then increment a counter)
    const HistoryExistingSong = req.user.fullHistory.findIndex(history => history.id.equals(music.id));
    if (HistoryExistingSong >= 0) req.user.fullHistory[HistoryExistingSong].count++;
    else req.user.fullHistory.push({ id: music._id, count: 1 });
    // update the user
    await usersModel.findByIdAndUpdate(req.user.id, {
        $push: {
            // recent history (20 songs one by one)
            recentHistory: {
                $each: [ music.id ],
                $position: 0,
                $slice: 20,
            }
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
    const existingIndex = music.similar.findIndex(similar => lastListend.equals(similar[0]));
    if (existingIndex >= 0) music.similar[existingIndex][1]++;
    else music.similar.push([ lastListend, 1 ]);
    // update the music in db
    await musicModel.findByIdAndUpdate(music.id, {
        $inc: { listenedCount: 1 },
        similar: music.similar
    });
});

/* -------------------------------------------------------------------------- */
/*                                DELETE MUSIC                                */
/* -------------------------------------------------------------------------- */
exports.deleteMusic = asyncHandler(async (req, res) => {
    try {
        /* ------------------------- CHECK REQUEST VALIDITY ------------------------- */
        if (!req.user.right || req.user.right < 1) throw {
            message: `You are not authorized to do this!`,
            status: 403
        };
        const { id } = req.params;
        if (!id || !await musicModel.findById(id)) throw {
            message: "Invalid music id",
            status: 400
        };
        /* --------------------------------- DELETE --------------------------------- */
        // db
        const query = await musicModel.deleteOne({ _id: id });
        if (query.deletedCount !== 1) throw new Error(query);
        // files
        fs.rmSync(path.join(musicFolder, id), { recursive: true, force: true });
        // response
        res.status(200).json({
            status: `Successfully deleted music ${id}`,
            _id: id
        });
    } catch (err) {
        if (err.code == 'ENOENT') throw { message: "No such file or directory" };
        else throw(err);
    }
});

/* -------------------------------------------------------------------------- */
/*                               GET MUSIC INFOS                              */
/* -------------------------------------------------------------------------- */
exports.getInfos = asyncHandler(async (req, res) => {
    /* ---------------------------- GET MUSICS INFOS ---------------------------- */
    const music = await getMusicInfos(req.params);
    res.status(200).json({
        title: music.title,
        artist: music.artist,
        year: music.year
    });
});

/* -------------------------------------------------------------------------- */
/*                                SEARCH MUSICS                               */
/* -------------------------------------------------------------------------- */
exports.searchMusic = asyncHandler(async (req, res) => {
    /* ------------------------------ REQUEST CHECK ----------------------------- */
    const searchQuery = req.params.query;
    if (!searchQuery || !musicTextRegex.test(searchQuery)) throw {
        message: "Invalid search query " + searchQuery,
        status: 400
    };
    /* --------------------------------- SEARCH --------------------------------- */
    let filteredMusics;
    if (searchQuery.split(" ").length === 1) { // if one word assume it's not finished so the mongoose search based on words is not the best
        filteredMusics = await musicFinder({ regexQuery: searchQuery }); // dumb (regex based) search
        // if "dumb" search didn't worked try the more advance one from mongoose
        if (filteredMusics.length < 1) filteredMusics = await musicFinder({ textQuery: searchQuery });
    } else { // if multiple word execute a combinaison of advance (the first entire words) and basic search (last word which may be incomplete)
        // split the query into two (firsts words and last word)
        const lastWord = searchQuery.split(" ")[searchQuery.split(" ").length -1];
        let textQuery = searchQuery.replace(/(\s+\S+)$/, "");
        filteredMusics = await musicFinder({ textQuery, regexQuery: lastWord }); // search with both regex and mongoose
    }
    /* ----------------------------- RESPONSE RESULT ---------------------------- */
    if (filteredMusics.length > 0) res.status(200).json(filteredMusics.slice(0, 30));
    else res.status(200).json([ "No musics found" ]);
});

// search musics query
function musicFinder({textQuery, regexQuery}) { 
    const query = {};
    if (regexQuery) {
        // https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
        regexQuery = regexQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        query["$or"] = [
            { title: { $regex: regexQuery, $options: 'i' } },
            { artist: { $regex: regexQuery, $options: 'i' } },
            { tags: { $regex: regexQuery, $options: 'i' } },
        ];
    }
    if (textQuery) query["$text"] = { $search: textQuery };
    return musicModel.find(query)
        .select("title artist year")
        .sort([["listenedCount", -1]]);
}
// verify id and get infos
async function getMusicInfos({ id }) {
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
