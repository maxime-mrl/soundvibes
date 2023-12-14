const cron = require('node-cron');
const asyncHandler = require("express-async-handler");
const musicsModel = require("../models/musics.model");
const recommendationsModel = require("../models/recommendations.model");

/* -------------------------------------------------------------------------- */
/*                        GET TRENDING RECOMMENDATIONS                        */
/* -------------------------------------------------------------------------- */
exports.getTrending = asyncHandler(async (req, res) => {
    const trending = await recommendationsModel.find({public: true});
    await sendRecommendations(trending, res)
})

/* -------------------------------------------------------------------------- */
/*                          GET USER RECOMMENDATIONS                          */
/* -------------------------------------------------------------------------- */
exports.getRecommendations = asyncHandler(async (req, res) => {
    /* -------------------- GET THE EXISTING RECOMMENDATIONS -------------------- */
    const existingRecomendations = await recommendationsModel.find({ targetUser: req.user._id });
    /* -------------------- CHECK IF EXISTING AND NOT EXPIRED ------------------- */
    if (existingRecomendations && existingRecomendations.length > 1 && existingRecomendations[0].name) { // recomendations are here
        const limitDate = new Date().getTime() - 8.64 * 10**7;
        let expired = false;
        existingRecomendations.forEach(recomendation => {
            const lastUpdate = new Date(recomendation.updatedAt).getTime();
            if (lastUpdate - limitDate <= 0) expired = true;
        });
        if (!expired) return sendRecommendations(existingRecomendations, res)
        // remove the existing recommendations if expired -- don't update to avoid all problems with incorrect count (ex less than 3 music etc)
        await recommendationsModel.deleteMany({ targetUser: req.user._id });
    }
    // At this point either there is no recommendations recomendations left -- create some new
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
    const rawSimilars = await musicsModel.find({ '_id': { $in: filteredHistory } }).select("similar");
    // parse a bit
    const similars = await parseSimilar(rawSimilars, req);
    /* ------------------------- SAVE NEW RECOMMANDATION ------------------------ */
    if ((await recommendationsModel.find({ targetUser: req.user._id }))) { // since it take some times to do the logic possible with double request to create duplicate -> limit that
        await recommendationsModel.deleteMany({ targetUser: req.user._id });
    }
    const added = await recommendationsModel.insertMany(similars);
    sendRecommendations(added, res);
})

/* -------------------------------------------------------------------------- */
/*                   GENERATE A PLAYLIST FROM A MUSIC INFOS                   */
/* -------------------------------------------------------------------------- */
exports.playlistFrom = asyncHandler(async (req, res) => {
    /* -------------------------- CHECK INPUTS VALIDITY ------------------------- */
    if (!req.body || Object.keys(req.body).length !== 1 || !/^[\(\)'-a-z0-9\s]+$/i.test(req.body[Object.keys(req.body)[0]])) throw {
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

/* -------------------------------------------------------------------------- */
/*                             PARSE SIMILAR MUSIC                            */
/* -------------------------------------------------------------------------- */
async function parseSimilar(similars, req) {
    for (let i = 0; i < similars.length; i++) {
        let similar = similars[i].similar;
        let name = similars[i].title;
        let iteration = 0;
        // if too few, add some
        while (similar.length < 15 && iteration < 10) {
            iteration++;
            let minListened = 10;
            let filtredSimilar = similar.filter(music => music[1] > minListened);
            while (filtredSimilar.length < 5 && minListened >= 0) { // select the top 5 listened
                minListened--;
                filtredSimilar = similar.filter(music => music[1] > minListened);
            }
            const more = await musicsModel.findById(filtredSimilar[Math.floor(Math.random() * filtredSimilar.length)][0]).select("similar"); // get one random from the top5
            if (more && more.similar) more.similar.forEach(toAdd => {
                if (!similar.filter(music => music[0].equals(toAdd[0])).length > 0) similar.push(toAdd);
            });
        }
        // if too much remove some id based on listening count
        if (similar.length > 30) {
            let minListened = 0;
            while (similar.length > 30) {
                minListened++;
                similar = similar.filter(music => music.count > minListened);
            }
        }
        // parse the result
        if (req) {
            similars[i] = {
                name: `Daily mix ${i + 1}`,
                targetUser: req.user._id,
                content: similar.map(music => music[0]),
            };
        } else {
            similars[i] = {
                name: `${name} mix`,
                public: true,
                content: similar.map(music => music[0]),
            };
        }
    }
    return similars;
}

/* -------------------------------------------------------------------------- */
/*                      POPULATE AND SEND RECOMMENDATIONS                     */
/* -------------------------------------------------------------------------- */
async function sendRecommendations(rawRecomendations, res) {
    /* ------------------------- POPULATE RECOMENDATIONS ------------------------ */
    const recomendations = (await recommendationsModel.populate(rawRecomendations, {
        path: "content",
        select: "title artist genre year"
    })).map(recomendation => ({
        _id: recomendation._id,
        name: recomendation.name,
        content: recomendation.content
    }));
    // send response
    res.status(200).json(recomendations);
}

/* -------------------------------------------------------------------------- */
/*                      DETERMINATE 6 TOP PLAYLIST DAILY                      */
/* -------------------------------------------------------------------------- */
async function createDailyTrending() {
    try {
        // delete the old one
        await recommendationsModel.deleteMany({ public: true });
        // find the 20 top listened
        const musics = await musicsModel.find({}).sort([["listenedCount", -1]]).limit(20);
        // randomly select 6
        while (musics.length > 6) musics.splice(Math.floor(Math.random() * musics.length), 1);
        // parse and add to db
        const similars = await parseSimilar(musics, false);
        await recommendationsModel.insertMany(similars);
    } catch (err) {
        console.error(err)
    }
}

// create schedule to create daily trending
cron.schedule('0 0 * * *', createDailyTrending);
