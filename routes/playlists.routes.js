const router = require("express").Router();
const { createPlaylist } = require("../controllers/playlists.controller");


router.post("/", createPlaylist);

module.exports = router;
