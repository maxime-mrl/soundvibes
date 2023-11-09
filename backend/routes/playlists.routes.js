const router = require("express").Router();
const { createPlaylist, getPlaylist, updatePlaylist, deletePlaylist, playlistFrom, test } = require("../controllers/playlists.controller");

router.post("/create", createPlaylist);
router.delete("/delete/:id", deletePlaylist);
router.put("/update/:id", updatePlaylist);
router.get("/get/:id", getPlaylist);
router.post("/from", playlistFrom);
router.get("/test", test);

module.exports = router;
