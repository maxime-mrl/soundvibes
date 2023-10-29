const router = require("express").Router();
const { createPlaylist, getPlaylist, updatePlaylist, deletePlaylist } = require("../controllers/playlists.controller");

router.post("/", createPlaylist);
router.delete("/:id", deletePlaylist);
router.put("/:id", updatePlaylist);
router.get("/:id", getPlaylist);

module.exports = router;
