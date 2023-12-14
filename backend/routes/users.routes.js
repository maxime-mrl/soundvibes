const router = require("express").Router();
const { registerUser, loginUser, getUser, deleteUser, updateUser, setRight, getHistory } = require("../controllers/users.controller");
const { protect } = require("../middleware/auth.midleware");

router.get("/me", protect, getUser);
router.get("/history", protect, getHistory);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/delete", protect, deleteUser);
router.put("/update", protect, updateUser);
router.put("/setright", protect, setRight);

module.exports = router;
