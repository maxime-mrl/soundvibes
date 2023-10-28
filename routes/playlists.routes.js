const router = require("express").Router();
const { createPlaylist, getPlaylist, updatePlaylist, deletePlaylist } = require("../controllers/playlists.controller");


router.post("/", createPlaylist);
router.get("/:id", getPlaylist);
router.put("/:id", updatePlaylist);
router.delete("/:id", deletePlaylist);

module.exports = router;
