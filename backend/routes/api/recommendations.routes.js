const router = require("express").Router();
const { getRecommendations, getTrending, playlistFrom } = require("../../controllers/recommendations.controller");

router.get("/own", getRecommendations);
router.get("/trending", getTrending);
router.post("/from", playlistFrom);

module.exports = router;
