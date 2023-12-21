const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const rootPath = require("../rootPath");

/* ----------------------------------- API ---------------------------------- */
router.use("/api", require("./api"));

// block direct access to audio, used to limit unwanted access methods
router.use(/^\/.+\.mp3$/, () => { throw { status: 404 }; });
// create public access to songs folder for the covers
router.use("/public", express.static(path.join(rootPath, 'songs')));

/* -------------------------------- FRONTEND -------------------------------- */
if (fs.existsSync(path.join(rootPath, 'client'))) {
    // if client found actually serve it
    router.use(express.static(path.join(rootPath, 'client')));
    router.get('*', function (req, res) { res.sendFile(path.join(rootPath, 'client', 'index.html')); });
} else {
    console.error("No client folder detected, continuing with only backend. This is normal for a development environement");
    // replace client by 404
    router.use("*", () => { throw { status: 404 }; });
}
module.exports = router;
