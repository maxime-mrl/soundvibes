const musicsModel = require("../models/musics.model");

module.exports = async function test(req, res) {
    // const user = await usersModel.findById(uid);
    const history = req.user.fullHistory;
    console.log(history.length)
    // sort, only keep the top 3 listened, then only keeps the ids
    const ids = history.sort((a,b) => b.count - a.count).slice(0, 3).map(item => item.id);
    console.log(ids)
    const musics = await musicsModel.find({ '_id': { $in: ids } }).select("similar");
    musics.forEach((music, i) => musics[i] = music.similar);
    console.log(musics);
    res.end();
}
