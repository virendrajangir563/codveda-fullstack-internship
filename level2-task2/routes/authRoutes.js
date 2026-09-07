const express = require("express");

const {
    registerUser,
    loginUser,
    getProfile
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, getProfile);

router.get("/admin", protect, adminOnly, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome Admin",
        user: req.user
    });
});

module.exports = router;