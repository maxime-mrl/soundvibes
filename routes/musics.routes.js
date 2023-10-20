const { postMusic } = require("../controllers/musics.controller");
const { protect } = require("../middleware/auth.midleware");

const router = require("express").Router();


router.post("/", postMusic);

module.exports = router;
