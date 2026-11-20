const DigitalBookActivity = require("../models/DigitalBookActivity");

// =================================
// Get My Digital Book Activities
// =================================
const getMyActivities = async (req, res) => {
  try {
    const activities = await DigitalBookActivity.find({
      user: req.user.id,
    })
      .populate(
        "digitalBook",
        "title author category coverImage fileType"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    console.error("Get my digital activities error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your digital book activities.",
      error: error.message,
    });
  }
};

// =================================
// Get All Digital Book Activities
// =================================
const getAllActivities = async (req, res) => {
  try {
    const activities = await DigitalBookActivity.find()
      .populate(
        "digitalBook",
        "title author category coverImage fileType"
      )
      .populate(
        "user",
        "name email role"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    console.error("Get all digital activities error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch digital book activities.",
      error: error.message,
    });
  }
};

// =================================
// Get Activities By Digital Book
// =================================
const getBookActivities = async (req, res) => {
  try {
    const { id } = req.params;

    const activities = await DigitalBookActivity.find({
      digitalBook: id,
    })
      .populate(
        "user",
        "name email role"
      )
      .populate(
        "digitalBook",
        "title author category"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    console.error("Get book activities error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch book activities.",
      error: error.message,
    });
  }
};

// =================================
// Get Activity Statistics
// =================================
const getActivityStats = async (req, res) => {
  try {
    const totalActivities =
      await DigitalBookActivity.countDocuments();

    const totalViews =
      await DigitalBookActivity.countDocuments({
        activityType: "view",
      });

    const totalReads =
      await DigitalBookActivity.countDocuments({
        activityType: "read",
      });

    const totalDownloads =
      await DigitalBookActivity.countDocuments({
        activityType: "download",
      });

    return res.status(200).json({
      success: true,
      stats: {
        totalActivities,
        totalViews,
        totalReads,
        totalDownloads,
      },
    });
  } catch (error) {
    console.error(
      "Get digital activity stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch digital book activity statistics.",
      error: error.message,
    });
  }
};

module.exports = {
  getMyActivities,
  getAllActivities,
  getBookActivities,
  getActivityStats,
};