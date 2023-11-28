const router = require("express").Router();
const { createPlaylist, getPlaylist, updatePlaylist, deletePlaylist, playlistFrom, test, userPlaylist } = require("../controllers/playlists.controller");

router.post("/create", createPlaylist);
router.delete("/delete/:id", deletePlaylist);
router.put("/update/:id", updatePlaylist);
router.get("/get/:id", getPlaylist);
router.get("/getown", userPlaylist);
router.post("/from", playlistFrom);
router.get("/test", test);

module.exports = router;
