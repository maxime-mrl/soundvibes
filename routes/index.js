const router = require("express").Router();
const { protect } = require("../middleware/auth.midleware");

router.use("/user", require("./users.routes.js"));
router.use("/music", protect, require("./musics.routes.js"));

module.exports = router;
