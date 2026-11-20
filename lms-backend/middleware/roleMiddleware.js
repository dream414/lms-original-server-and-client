const authorize = (...roles) => {
  return (req, res, next) => {
    // User authentication check
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please Login First.",
      });
    }

    // Role permission check
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access Denied. You do not have permission.",
      });
    }

    next();
  };
};

module.exports = authorize;