const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { isLoggedIn, savedRedirect } = require("../middlewares");
const userController = require("../controllers/user");

router
  .route("/signup")
  .get(userController.renderSignup)
  .post(wrapAsync(userController.registerUser));

router
  .route("/login")
  .get(userController.renderLogin)
  .post(
    savedRedirect,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.loginUser)
  );

router.get("/logout", userController.logoutUser);

module.exports = router;
