const router = require("express").Router();
const { createPlaylist, getPlaylist } = require("../controllers/playlists.controller");


router.get("/:id", getPlaylist);
router.post("/", createPlaylist);

module.exports = router;
