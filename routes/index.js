const router = require("express").Router();

router.use("/user", require("./users.routes.js"));
router.use("/music", require("./musics.routes.js"));

module.exports = router;