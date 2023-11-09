const musicsModel = require("../models/musics.model");
const usersModel = require("../models/users.model");

const uid = "6538fbfb2f56239723d84106";

module.exports = async function test(req, res) {
    const user = await usersModel.findById(uid);
    const history = user.listeningHistory;
    // map works better to parse
    let parsedHistory = new Map();
    history.forEach(id => parsedHistory.set(id, (parsedHistory.get(id) || 0) + 1));
    // convert map to array to easly work with it
    parsedHistory = Array.from(parsedHistory);
    // sort, only keep the top 3 listened, then only keeps the ids
    const ids = parsedHistory.sort((a,b) => b[1] - a[1]).slice(0, 3).map(item => item[0]);
    const musics = await musicsModel.find({ '_id': { $in: ids } }).select("similar");
    musics.forEach((music, i) => musics[i] = music.similar);
    console.log(musics);
    res.end();
}
