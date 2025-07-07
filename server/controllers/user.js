const User = require("../models/user");
const ExpressError = require("../utils/expressError");

module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return next(new ExpressError(400, "User with this email or username already exists"));
    }

    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Generate JWT token
    const token = newUser.generateAuthToken();

    res.status(201).json({
      success: true,
      message: "Welcome to StayScape!",
      user: newUser,
      token
    });
  } catch (error) {
    next(error);
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return next(new ExpressError(401, "Invalid credentials"));
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ExpressError(401, "Invalid credentials"));
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    res.json({
      success: true,
      message: "Welcome back!",
      user,
      token
    });
  } catch (error) {
    next(error);
  }
};

module.exports.logoutUser = (req, res) => {
  // In JWT, logout is handled on frontend by removing token
  // Optionally, you could implement token blacklisting here
  res.json({
    success: true,
    message: "Logged out successfully"
  });
};

module.exports.getCurrentUser = async (req, res) => {
  // This endpoint returns current user info
  res.json({
    success: true,
    user: req.user
  });
};