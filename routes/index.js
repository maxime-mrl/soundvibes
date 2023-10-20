const router = require("express").Router();

router.use("/user", require("./users.routes.js"));

module.exports = router;