const express = require("express");

const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware"); // ✅ Import middleware

const router = express.Router();

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo); // ✅ Now it's protected

module.exports = router;
