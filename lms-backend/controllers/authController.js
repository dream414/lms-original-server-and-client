const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { createNotification } = require("./notificationController");

// =====================================
// Cookie Options
// =====================================

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// =====================================
// Register
// =====================================

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Check Existing User
    const exist = await User.findOne({
      email: email.toLowerCase(),
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }

    // Hash Password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create User
    // IMPORTANT:
    // Role is NOT taken from req.body.
    // User will always be created as student.
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashPassword,
      role: "student",
    });

    // Welcome Notification
    await createNotification(
      user._id,
      "Welcome to LMS",
      "Your account has been created successfully. Welcome to the Learning Management System.",
      "General"
    );

    // Generate JWT
    const token = generateToken(user._id, user.role);

    // Store JWT in HTTP-only Cookie
    res.cookie("token", token, cookieOptions);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: userResponse,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// Login
// =====================================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find User
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    // Check Account Status
    if (user.status === "inactive") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact administrator.",
      });
    }

    // Compare Password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Generate JWT using CURRENT role
    const token = generateToken(user._id, user.role);

    // Store JWT in HTTP-only Cookie
    res.cookie("token", token, cookieOptions);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: "Login Successful",
      user: userResponse,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// Logout
// =====================================

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({
      success: true,
      message: "Logout Successful",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// Get Current Logged In User
// =====================================

// =====================================
// Get Current Logged In User
// =====================================

exports.getMe = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};