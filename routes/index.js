const router = require("express").Router();

router.get("/", (req, res) => {res.end("uwu")});
router.use("/user", require("./users.routes.js"));

module.exports = router;