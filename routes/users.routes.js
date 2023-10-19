const router = require("express").Router();
const { registerUser, loginUser, getUser, deleteUser, updateUser } = require("../controllers/users.controller");
const { protect } = require("../middleware/auth.midleware");


router.post("/", registerUser);
router.get("/", protect, getUser);
router.post("/login", loginUser);
router.post("/update", protect, updateUser);
router.delete("/delete", protect, deleteUser);

module.exports = router;
