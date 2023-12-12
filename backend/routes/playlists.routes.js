const router = require("express").Router();
const { createPlaylist, getPlaylist, updatePlaylist, deletePlaylist, playlistFrom, userPlaylist } = require("../controllers/playlists.controller");

router.post("/create", createPlaylist);
router.delete("/delete/:id", deletePlaylist);
router.put("/update/:id", updatePlaylist);
router.get("/get/:id", getPlaylist);
router.get("/getown", userPlaylist);
router.post("/from", playlistFrom);

module.exports = router;
