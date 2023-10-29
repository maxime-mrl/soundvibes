const router = require("express").Router();
const { registerUser, loginUser, getUser, deleteUser, updateUser, setRight } = require("../controllers/users.controller");
const { protect } = require("../middleware/auth.midleware");

router.post("/", registerUser);
router.put("/", protect, updateUser);
router.delete("/", protect, deleteUser);
router.get("/", protect, getUser);
router.put("/setright", protect, setRight);
router.post("/login", loginUser);

module.exports = router;
