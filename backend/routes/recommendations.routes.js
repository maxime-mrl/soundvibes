const router = require("express").Router();
const { getRecommendations } = require("../controllers/recommendations.controller");

router.get("/recommendations", getRecommendations);

module.exports = router;
