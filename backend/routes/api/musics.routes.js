const router = require("express").Router();
const { postMusic, deleteMusic, getInfos, searchMusic, playMusic } = require("../../controllers/musics.controller");

router.get("/get/:id", getInfos);
router.get("/play/:id", playMusic);
router.get("/search/:query", searchMusic);
router.post("/add", postMusic);
router.delete("/delete/:id", deleteMusic);

module.exports = router;
