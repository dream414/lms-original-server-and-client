const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    // Get JWT from HTTP-only cookie
    const token = req.cookies?.token;

    // No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please Login First.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store authenticated user information
    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });

  }
};

module.exports = protect;