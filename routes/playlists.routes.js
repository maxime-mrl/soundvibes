const router = require("express").Router();
const { createPlaylist, getPlaylist, updatePlaylist } = require("../controllers/playlists.controller");


router.post("/", createPlaylist);
router.get("/:id", getPlaylist);
router.put("/:id", updatePlaylist);

module.exports = router;
