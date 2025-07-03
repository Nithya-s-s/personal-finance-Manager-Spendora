const express = require("express");
const {
    getDashboardSummary,
    getMonthlyAnalytics,
    getYearlySummary
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Dashboard endpoints
router.get("/summary", getDashboardSummary);
router.get("/monthly", getMonthlyAnalytics);
router.get("/yearly", getYearlySummary);

module.exports = router;
