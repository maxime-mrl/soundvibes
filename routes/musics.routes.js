const { postMusic, deleteMusic, getInfos, searchMusic } = require("../controllers/musics.controller");

const router = require("express").Router();

router.post("/", postMusic);
router.delete("/delete/:id", deleteMusic);
router.get("/info/:id", getInfos);
router.get("/search/:query", searchMusic);

module.exports = router;
