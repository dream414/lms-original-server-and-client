const User = require("../models/User");

// =====================================
// Allowed LMS Roles
// =====================================

const allowedRoles = [
  "student",
  "teacher",
  "admin",
  "librarian",
  "superadmin",
  "hod",
  "staff",
  "visitor",
  "accountant",
  "researcher",
  "digital",
  "library",
];

// =====================================
// Get All Users
// Admin + SuperAdmin
// =====================================

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Get Single User
// =====================================

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Change User Role
// Admin + SuperAdmin
// =====================================

exports.changeRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Check Role
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    // Check Valid Role
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Role",
      });
    }

    // Find User
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    // =====================================
    // Prevent Admin from changing own role
    // =====================================

    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    // =====================================
    // Admin cannot assign SuperAdmin
    // Only SuperAdmin can assign SuperAdmin
    // =====================================

    if (role === "superadmin" && req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Only SuperAdmin can assign SuperAdmin role",
      });
    }

    // Update Role
    user.role = role;

    await user.save();

    // Remove password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Role Updated Successfully",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Delete User
// Admin + SuperAdmin
// =====================================

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    // Admin cannot delete SuperAdmin
    if (
      user.role === "superadmin" &&
      req.user.role !== "superadmin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Admin cannot delete SuperAdmin",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};