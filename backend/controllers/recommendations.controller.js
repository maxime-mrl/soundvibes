const cron = require('node-cron');
const asyncHandler = require("express-async-handler");
const musicsModel = require("../models/musics.model");
const recommendationsModel = require("../models/recommendations.model");

exports.getTrending = asyncHandler(async (req, res) => {
    const trending = await recommendationsModel.find({public: true});
    await sendRecommendations(trending, res)
})

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

async function parseSimilar(similars, req) {
    for (let i = 0; i < similars.length; i++) {
        let similar = similars[i].similar
        let name = similars[i].title;
        let iteration = 0
        while (similar.length < 15 && iteration < 10) { // if too few, add some
            iteration++
            let minListened = 10;
            let filtredSimilar = similar.filter(music => music[1] > minListened)
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
                similar = similar.filter(music => music.count > minListened);
            }
        }
        // update to the well parsed similar
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
    return similars
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

async function createDailyTrending() {
    console.log(new Date())
    try {
        await recommendationsModel.deleteMany({ public: true });
        const musics = await musicsModel.find({}).sort([["listenedCount", -1]]).limit(20);
        while (musics.length > 6) musics.splice(Math.floor(Math.random() * musics.length), 1);
        const similars = await parseSimilar(musics, false);
        await recommendationsModel.insertMany(similars);
    } catch (err) {
        console.error(err)
    }
}

cron.schedule('0 0 * * *', createDailyTrending);
