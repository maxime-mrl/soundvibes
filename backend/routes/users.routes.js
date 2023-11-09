const router = require("express").Router();
const { registerUser, loginUser, getUser, deleteUser, updateUser, setRight } = require("../controllers/users.controller");
const { protect } = require("../middleware/auth.midleware");

router.get("/me", protect, getUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update", protect, updateUser);
router.put("/setright", protect, setRight);
router.delete("/delete", protect, deleteUser);

module.exports = router;
