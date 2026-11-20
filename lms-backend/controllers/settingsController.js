const Settings = require("../models/Settings");

// ========================================
// Get Settings
// ========================================

const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    // Create default settings if not found
    if (!settings) {
      settings = await Settings.create({});
    }

    return res.status(200).json({
      success: true,
      message: "Settings fetched successfully.",
      data: settings,
    });
  } catch (error) {
    console.error("Get Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch settings.",
      error: error.message,
    });
  }
};

// ========================================
// Update Settings
// ========================================

const updateSettings = async (req, res) => {
  try {
    const {
      lmsName,
      institutionName,
      logo,
      email,
      phone,
      address,
      website,

      maxBooksPerStudent,
      issueDurationDays,
      finePerDay,
      allowBookRenewal,
      maxRenewals,

      emailNotifications,
      issueNotifications,
      returnNotifications,
      fineNotifications,
      announcementNotifications,

      allowStudentRegistration,
      allowTeacherRegistration,

      requireStrongPassword,
      sessionTimeoutMinutes,

      maintenanceMode,
      maintenanceMessage,
    } = req.body;

    let settings = await Settings.findOne();

    // Create settings document if it does not exist
    if (!settings) {
      settings = new Settings();
    }

    // ==============================
    // General Settings
    // ==============================

    if (lmsName !== undefined) {
      settings.lmsName = lmsName;
    }

    if (institutionName !== undefined) {
      settings.institutionName = institutionName;
    }

    if (logo !== undefined) {
      settings.logo = logo;
    }

    if (email !== undefined) {
      settings.email = email;
    }

    if (phone !== undefined) {
      settings.phone = phone;
    }

    if (address !== undefined) {
      settings.address = address;
    }

    if (website !== undefined) {
      settings.website = website;
    }

    // ==============================
    // Library Settings
    // ==============================

    if (maxBooksPerStudent !== undefined) {
      settings.maxBooksPerStudent = maxBooksPerStudent;
    }

    if (issueDurationDays !== undefined) {
      settings.issueDurationDays = issueDurationDays;
    }

    if (finePerDay !== undefined) {
      settings.finePerDay = finePerDay;
    }

    if (allowBookRenewal !== undefined) {
      settings.allowBookRenewal = allowBookRenewal;
    }

    if (maxRenewals !== undefined) {
      settings.maxRenewals = maxRenewals;
    }

    // ==============================
    // Notification Settings
    // ==============================

    if (emailNotifications !== undefined) {
      settings.emailNotifications = emailNotifications;
    }

    if (issueNotifications !== undefined) {
      settings.issueNotifications = issueNotifications;
    }

    if (returnNotifications !== undefined) {
      settings.returnNotifications = returnNotifications;
    }

    if (fineNotifications !== undefined) {
      settings.fineNotifications = fineNotifications;
    }

    if (announcementNotifications !== undefined) {
      settings.announcementNotifications =
        announcementNotifications;
    }

    // ==============================
    // Registration Settings
    // ==============================

    if (allowStudentRegistration !== undefined) {
      settings.allowStudentRegistration =
        allowStudentRegistration;
    }

    if (allowTeacherRegistration !== undefined) {
      settings.allowTeacherRegistration =
        allowTeacherRegistration;
    }

    // ==============================
    // Security Settings
    // ==============================

    if (requireStrongPassword !== undefined) {
      settings.requireStrongPassword =
        requireStrongPassword;
    }

    if (sessionTimeoutMinutes !== undefined) {
      settings.sessionTimeoutMinutes =
        sessionTimeoutMinutes;
    }

    // ==============================
    // Maintenance Settings
    // ==============================

    if (maintenanceMode !== undefined) {
      settings.maintenanceMode = maintenanceMode;
    }

    if (maintenanceMessage !== undefined) {
      settings.maintenanceMessage = maintenanceMessage;
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully.",
      data: settings,
    });
  } catch (error) {
    console.error("Update Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update settings.",
      error: error.message,
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};