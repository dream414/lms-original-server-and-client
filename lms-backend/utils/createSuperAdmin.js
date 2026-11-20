const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createSuperAdmin = async () => {
  try {
    const {
      SUPERADMIN_NAME,
      SUPERADMIN_EMAIL,
      SUPERADMIN_PASSWORD,
    } = process.env;

    // ==========================================
    // Check Environment Variables
    // ==========================================

    if (
      !SUPERADMIN_NAME ||
      !SUPERADMIN_EMAIL ||
      !SUPERADMIN_PASSWORD
    ) {
      console.log(
        "⚠️ Super Admin credentials are missing in .env"
      );

      return;
    }

    // ==========================================
    // Check Existing Super Admin
    // ==========================================

    const existingSuperAdmin = await User.findOne({
      email: SUPERADMIN_EMAIL.toLowerCase(),
    });

    if (existingSuperAdmin) {

      // Make sure the existing account remains Super Admin
      if (existingSuperAdmin.role !== "superadmin") {
        existingSuperAdmin.role = "superadmin";
        await existingSuperAdmin.save();

        console.log(
          "🔐 Existing user promoted to Super Admin"
        );
      } else {
        console.log(
          "✅ Super Admin already exists"
        );
      }

      return;
    }

    // ==========================================
    // Hash Password
    // ==========================================

    const hashedPassword = await bcrypt.hash(
      SUPERADMIN_PASSWORD,
      10
    );

    // ==========================================
    // Create Super Admin
    // ==========================================

    const superAdmin = await User.create({
      name: SUPERADMIN_NAME,
      email: SUPERADMIN_EMAIL.toLowerCase(),
      password: hashedPassword,
      role: "superadmin",
      status: "active",
    });

    console.log(
      `✅ Super Admin Created: ${superAdmin.email}`
    );

  } catch (error) {

    console.error(
      "❌ Super Admin Creation Failed:",
      error.message
    );

  }
};

module.exports = createSuperAdmin;