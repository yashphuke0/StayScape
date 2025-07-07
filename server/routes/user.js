const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middlewares");
const userController = require("../controllers/user");

// Auth routes
router.post("/signup", wrapAsync(userController.registerUser));
router.post("/login", wrapAsync(userController.loginUser));
router.post("/logout", userController.logoutUser);

// Protected route to get current user
router.get("/me", isLoggedIn, userController.getCurrentUser);

module.exports = router;
