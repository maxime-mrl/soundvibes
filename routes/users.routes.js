const router = require("express").Router();
const { registerUser, loginUser, getUser, deleteUser, updateUser, setRight } = require("../controllers/users.controller");
const { protect } = require("../middleware/auth.midleware");


router.post("/", registerUser);
router.get("/", protect, getUser);
router.post("/login", loginUser);
router.post("/update", protect, updateUser);
router.post("/setright", protect, setRight);
router.delete("/delete", protect, deleteUser);

module.exports = router;
