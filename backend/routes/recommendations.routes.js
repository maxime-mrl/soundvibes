const router = require("express").Router();
const { getRecommendations, getTrending } = require("../controllers/recommendations.controller");

router.get("/own", getRecommendations);
router.get("/trending", getTrending);

module.exports = router;
