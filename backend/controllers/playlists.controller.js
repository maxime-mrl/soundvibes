const asyncHandler = require("express-async-handler");
const playlistModel = require("../models/playlists.model");
const musicsModel = require("../models/musics.model");
const recommendationsModel = require("../models/recommendations.model");

exports.createPlaylist = asyncHandler(async (req, res) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { name, musics } = req.body;
    const { id:owner } = req.user;
    if (!musics || (typeof musics !== "object" && !JSON.parse(musics)) || !name  || !owner) throw { // check that everything is here
        message: "Missing data",
        status: 400
    }
    const content = typeof musics === "object" ? musics : JSON.parse(musics);
    /* ----------------------------- CREATE PLAYLIST ---------------------------- */
    let newPlaylist = await playlistModel.create({ name, content, owner })
    newPlaylist = await newPlaylist.populate({
        path: "content",
        select: "title artist genre year"
    });
    if (!newPlaylist) throw new Error("Error while adding playlist, please try again later");
    res.status(200).json({
        _id: newPlaylist._id,
        name: newPlaylist.name,
        owner: {
            _id: req.user.id,
            username: req.user.username
        },
        content: newPlaylist.content
    });
});

exports.getPlaylist = asyncHandler(async (req, res) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { id } = req.params;
    if (!id) throw {
        message: "Missing playlist id",
        status: 400
    };
    /* ------------------------------ FIND PLAYLIST ----------------------------- */
    const playlist = await playlistModel.findOne({ _id: id })
        .populate({
            path: "content",
            select: "title artist genre year"
        })
        .populate({
            path: "owner",
            select: "username"
        });
    if (!playlist) throw {
        message: "Playlist not found",
        status: 404
    };
    res.status(200).json({
        _id: playlist._id,
        name: playlist.name,
        owner: playlist.owner,
        content: playlist.content
    });
    /* -------------------- PLAYLIST HEALTH CHECK AND REPAIR -------------------- */
    if (playlist.contentLength !== playlist.content.length) repairPlaylist(playlist);
});

exports.userPlaylist = asyncHandler(async (req, res) => {
    const playlists = await playlistModel.find({ owner: req.user._id })
    .populate({
        path: "content",
        select: "title artist genre year"
    })
    .populate({
        path: "owner",
        select: "username"
    })
    .select("name content owner");
    res.status(200).json(playlists);
})

exports.updatePlaylist = asyncHandler(async (req, res) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { id } = req.params;
    const { name, musics } = req.body;
    const { _id:owner } = req.user;
    if (!musics || (typeof musics !== "object" && !JSON.parse(musics)) || !name  || !owner) throw { // check everything is here
        message: "Missing data",
        status: 400
    };
    const { owner:playlistOwner } = await playlistModel.findOne({ _id: id });
    if (!playlistOwner || !owner.equals(playlistOwner)) throw { // check user can edit the playlist
        message: "Your are not authorized to edit this!",
        status: 401
    };
    const content = typeof musics === "object" ? musics : JSON.parse(musics);
    /* ----------------------------- UPDATE PLAYLIST ---------------------------- */
    const updatedPlaylist = await playlistModel.findByIdAndUpdate(id, { name, content, owner }, {new: true})
    .populate({
        path: "content",
        select: "title artist genre year"
    });
    if (!updatedPlaylist) throw new Error("Error while adding playlist, please try again later");
    res.status(200).json({
        _id: updatedPlaylist._id,
        name: updatedPlaylist.name,
        owner: {
            _id: req.user.id,
            username: req.user.username
        },
        content: updatedPlaylist.content,
    });
});

exports.deletePlaylist = asyncHandler(async (req, res) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { id } = req.params;
    const { _id:userId } = req.user;
    if (!id) throw {
        message: "Missing playlist",
        status: 400
    };
    const { owner } = await playlistModel.findOne({ _id: id });
    if (!owner || !userId.equals(owner)) throw {
        message: "Your are not authorized to edit this!",
        status: 401
    };
    /* --------------------------------- DELETE --------------------------------- */
    const query = await playlistModel.deleteOne({ _id: id });
    if (query.deletedCount !== 1) throw new Error(query);
    res.status(200).json({
        status: "Successfully deleted playlist!",
        _id: id
    });
});

exports.playlistFrom = asyncHandler(async (req, res) => {
    /* -------------------------- CHECK INPUTS VALIDITY ------------------------- */
    if (!req.body || Object.keys(req.body).length !== 1 || !/^[-a-z0-9\s]+$/i.test(req.body[Object.keys(req.body)[0]])) throw {
        message: "Invalid data",
        status: 400
    };
    /* ------------------------------- FIND MUSICS ------------------------------ */
    const musics = await musicsModel.find(req.body)
        .sort([["listenedCount", -1]])
        .select("title artist year genre");
    if (!musics || musics.length < 1) throw {
        message: "musics not found",
        status: 200
    };
    res.status(200).json(musics);
});

exports.getRecommendations = asyncHandler(async (req, res) => {
    /* -------------------- GET THE EXISTING RECOMMENDATIONS -------------------- */
    const existingRecomendations = await recommendationsModel.find({ targetUser: req.user._id });
    /* -------------------- CHECK IF EXISTING AND NOT EXPIRED ------------------- */
    if (existingRecomendations && existingRecomendations.length > 1 && existingRecomendations[0].name) {
        // recomendations are here
        const limitDate = new Date().getTime() - 8.64 * 10**7;
        let expired = false;
        existingRecomendations.forEach(recomendation => {
            const lastUpdate = new Date(recomendation.updatedAt).getTime();
            if (lastUpdate - limitDate <= 0) expired = true;
        });
        if (!expired) return sendRecommendations(existingRecomendations, res)
        // remove the existing recommendations if expired
        // don't update to avoid all problems with incorrect count (ex less than 3 music etc)
        await recommendationsModel.deleteMany({ targetUser: req.user._id });
    }
    // At this point either if because deleted or not, no recomendations left -- create some new
    /* -------------------- GENERATE NEW USER RECOMENDATIONS -------------------- */
    let history = req.user.fullHistory;
    // get at least five of the mosts listened musics
    let minimumListened = 10;
    let filteredHistory = history.filter(music => music.count > minimumListened).map(music => music.id);
    while (filteredHistory.length < 5 && minimumListened > 0) {
        minimumListened--;
        filteredHistory = history.filter(music => music.count > minimumListened).map(music => music.id);
    }
    // trim the top listened randomly to three ids
    while (filteredHistory.length > 3) filteredHistory.splice(Math.floor(Math.random() * filteredHistory.length), 1)
    // get the similars from db
    const similars = await musicsModel.find({ '_id': { $in: filteredHistory } }).select("similar");
    // parse a bit
    for (let i = 0; i < similars.length; i++) {
        let similar = similars[i].similar
        let iteration = 0
        while (similar.length < 20 && iteration < 10) { // if too few, add some
            iteration++
            let minListened = 10;
            let filtredSimilar = similar.filter(music => music[1] > minimumListened)
            while (filtredSimilar.length < 5 && minListened >= 0) {
                minListened--;
                filtredSimilar = similar.filter(music => music[1] > minListened)
            }
            const more = await musicsModel.findById(filtredSimilar[Math.floor(Math.random() * filtredSimilar.length)][0]).select("similar");
            if (more && more.similar) {
                more.similar.forEach(toAdd => {
                    if (!similar.filter(music => music[0].equals(toAdd[0])).length > 0) similar.push(toAdd);
                })
            };
        }
        if (similar.length > 30) { // if too much remove some id based on listening count
            let minListened = 0;
            while (similar.length > 30) {
                minListened++;
                similar = similar.filter(music => music.count > minimumListened);
            }
        }
        // update to the well parsed similar
        similars[i] = {
            name: `Daily mix ${i + 1}`,
            targetUser: req.user._id,
            content: similar.map(music => music[0]),
        };
    }
    /* ------------------------- SAVE NEW RECOMMANDATION ------------------------ */
    const added = await recommendationsModel.insertMany(similars);
    sendRecommendations(added, res);
})

// called when one or more music id isn't existing, update the playlist -- non existing music id can mainly happen in the case of a deleted musics
async function repairPlaylist({id, content:playlist, name, owner}) { // no user return: the user arleady got his playlist w/ all valid musics, this is only used to help the database stay clean
    try {
        const validIds = [];
        playlist.forEach(music => validIds.push(music._id)); // push every id that we have got from the populate which are all the valid musics
        await playlistModel.findByIdAndUpdate(id, { name, content: validIds, owner });
    } catch (err) { console.error(err) }; // since there is no infos of this happening to the user simply log the error on the server
}

async function sendRecommendations(rawRecomendations, res) {
    const recomendations = (await recommendationsModel.populate(rawRecomendations, {
        path: "content",
        select: "title artist genre year"
    })).map(recomendation => ({
        _id: recomendation._id,
        name: recomendation.name,
        content: recomendation.content
    }));

    res.status(200).json(recomendations)
}
