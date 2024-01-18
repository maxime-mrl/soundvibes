const express = require("express");
const { protect } = require("../../middleware/auth.midleware");
const errorHandler = require("../../middleware/errors.middleware");
const router = express.Router();


// different router categories
router.use("/users", require("./users.routes.js"));
router.use("/musics", protect, require("./musics.routes.js"));
router.use("/playlists", protect, require("./playlists.routes.js"));
router.use("/recommendations", protect, require("./recommendations.routes.js"));

// handle 404
router.use("*", () => { throw { status: 404 }; });
// call the error handler/parser
router.use(errorHandler);

module.exports = router;
