const express = require("express");
const { protect } = require("../middleware/auth.midleware");
const errorHandler = require("../middleware/errors.middleware");
const router = express.Router();

// different router categories
router.use("/api/users", require("./users.routes.js"));
router.use("/api/musics", protect, require("./musics.routes.js"));
router.use("/api/playlists", protect, require("./playlists.routes.js"));
router.use("/api/recommendations", protect, require("./recommendations.routes.js"));

// block direct access to audio, used to limit unwanted access methods
router.use(/^\/.+\.mp3$/, () => { throw { status: 404 } });
// create public access to songs folder for the covers
router.use("/public", express.static("songs"));
// handle 404
router.use("*", () => { throw { status: 404 } });
// call the error handler/parser
router.use(errorHandler);

module.exports = router;
