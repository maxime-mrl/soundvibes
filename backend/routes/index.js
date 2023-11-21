const express = require("express");
const { protect } = require("../middleware/auth.midleware");
const errorHandler = require("../middleware/errors.middleware");
const router = express.Router();

// different router categories
router.use("/api/users", require("./users.routes.js"));
router.use("/api/musics", protect, require("./musics.routes.js"));
router.use("/api/playlists", protect, require("./playlists.routes.js"));
router.use("/console", (req, res) => {
    console.log(req.body);
    res.end("ok")
})

// block direct access to audio, used to make harder the task of song downloading
// router.use(/^\/.+\.mp3$/, () => { throw { status: 404 } });
// create public access to songs folder for the covers
router.use("/public", express.static("songs"));
// call the error handler
router.use(errorHandler);

module.exports = router;
