const router = require("express").Router();
const { createPlaylist, getPlaylist, updatePlaylist, deletePlaylist, userPlaylist } = require("../controllers/playlists.controller");

router.get("/get/:id", getPlaylist);
router.get("/getown", userPlaylist);
router.post("/create", createPlaylist);
router.delete("/delete/:id", deletePlaylist);
router.put("/update/:id", updatePlaylist);

module.exports = router;
