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
// Normalize Role
// =====================================

const normalizeRole = (role) => {
  if (!role) return "";

  return role
    .toString()
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-");
};

// =====================================
// Get All Users
//
// SuperAdmin → All Users
// Admin      → All Users
// HOD        → Students + Teachers + Staff
// Teacher    → Students Only
// =====================================

exports.getAllUsers = async (req, res) => {
  try {
    const requesterRole = normalizeRole(req.user?.role);

    let roleFilter = {};

    // =====================================
    // SUPERADMIN + ADMIN
    // =====================================

    if (
      requesterRole === "superadmin" ||
      requesterRole === "admin"
    ) {
      roleFilter = {};
    }

    // =====================================
    // HOD
    // Students + Teachers + Staff
    // =====================================

    else if (requesterRole === "hod") {
      roleFilter = {
        role: {
          $in: [
            "student",
            "teacher",
            "staff",
          ],
        },
      };
    }

    // =====================================
    // TEACHER
    // Students ONLY
    // =====================================

    else if (requesterRole === "teacher") {
      roleFilter = {
        role: "student",
      };
    }

    // =====================================
    // OTHER ROLES
    // =====================================

    else {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to access users",
      });
    }

    // =====================================
    // FIND USERS
    // =====================================

    const users = await User.find(roleFilter)
      .select("-password")
      .sort({ createdAt: -1 });

    // =====================================
    // RESPONSE
    // =====================================

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "GET ALL USERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Get Users By Role
//
// SuperAdmin → Any Role
// Admin      → Any Role
// HOD        → Student / Teacher / Staff
// Teacher    → Student Only
//
// Examples:
//
// GET /api/users/role/teacher
// GET /api/users/role/student
// GET /api/users/role/staff
// GET /api/users/role/librarian
// GET /api/users/role/hod
// =====================================

exports.getUsersByRole = async (req, res) => {
  try {
    const requesterRole = normalizeRole(
      req.user?.role
    );

    const requestedRole = normalizeRole(
      req.params.role
    );

    // =====================================
    // ROLE REQUIRED
    // =====================================

    if (!requestedRole) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    // =====================================
    // VALID ROLE
    // =====================================

    if (!allowedRoles.includes(requestedRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Role",
      });
    }

    // =====================================
    // SUPERADMIN + ADMIN
    // Can access any role
    // =====================================

    if (
      requesterRole === "superadmin" ||
      requesterRole === "admin"
    ) {
      // Allowed
    }

    // =====================================
    // HOD
    // Can access students, teachers, staff
    // =====================================

    else if (requesterRole === "hod") {
      const hodAllowedRoles = [
        "student",
        "teacher",
        "staff",
      ];

      if (
        !hodAllowedRoles.includes(
          requestedRole
        )
      ) {
        return res.status(403).json({
          success: false,
          message:
            "HOD does not have permission to access this role",
        });
      }
    }

    // =====================================
    // TEACHER
    // Students ONLY
    // =====================================

    else if (requesterRole === "teacher") {
      if (requestedRole !== "student") {
        return res.status(403).json({
          success: false,
          message:
            "Teacher can only access students",
        });
      }
    }

    // =====================================
    // OTHER ROLES
    // =====================================

    else {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to access users",
      });
    }

    // =====================================
    // FIND USERS
    // =====================================

    const users = await User.find({
      role: requestedRole,
    })
      .select("-password")
      .sort({ createdAt: -1 });

    // =====================================
    // RESPONSE
    // =====================================

    res.status(200).json({
      success: true,
      role: requestedRole,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "GET USERS BY ROLE ERROR:",
      error
    );

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
    const user = await User.findById(
      req.params.id
    ).select("-password");

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
    console.error(
      "GET USER BY ID ERROR:",
      error
    );

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

    // =====================================
    // CHECK ROLE
    // =====================================

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    // =====================================
    // NORMALIZE ROLE
    // =====================================

    const normalizedRole =
      normalizeRole(role);

    // =====================================
    // CHECK VALID ROLE
    // =====================================

    if (
      !allowedRoles.includes(
        normalizedRole
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Role",
      });
    }

    // =====================================
    // FIND USER
    // =====================================

    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    // =====================================
    // PREVENT CHANGING OWN ROLE
    // =====================================

    if (
      user._id.toString() ===
      req.user.id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot change your own role",
      });
    }

    // =====================================
    // ONLY SUPERADMIN CAN ASSIGN SUPERADMIN
    // =====================================

    if (
      normalizedRole === "superadmin" &&
      req.user.role !== "superadmin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only SuperAdmin can assign SuperAdmin role",
      });
    }

    // =====================================
    // UPDATE ROLE
    // =====================================

    user.role = normalizedRole;

    await user.save();

    // =====================================
    // REMOVE PASSWORD
    // =====================================

    const userResponse =
      user.toObject();

    delete userResponse.password;

    // =====================================
    // RESPONSE
    // =====================================

    res.status(200).json({
      success: true,
      message:
        "Role Updated Successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error(
      "CHANGE ROLE ERROR:",
      error
    );

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
    const user = await User.findById(
      req.params.id
    );

    // =====================================
    // USER NOT FOUND
    // =====================================

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    // =====================================
    // PREVENT DELETING YOURSELF
    // =====================================

    if (
      user._id.toString() ===
      req.user.id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot delete your own account",
      });
    }

    // =====================================
    // ADMIN CANNOT DELETE SUPERADMIN
    // =====================================

    if (
      user.role === "superadmin" &&
      req.user.role !== "superadmin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Admin cannot delete SuperAdmin",
      });
    }

    // =====================================
    // DELETE USER
    // =====================================

    await user.deleteOne();

    // =====================================
    // RESPONSE
    // =====================================

    res.status(200).json({
      success: true,
      message:
        "User Deleted Successfully",
    });
  } catch (error) {
    console.error(
      "DELETE USER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};