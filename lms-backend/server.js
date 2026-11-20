
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");

// ==========================================
// ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes.js");
const bookRoutes = require("./routes/bookRoutes.js");
const courseRoutes = require("./routes/courseRoutes.js");
const requestRoutes = require("./routes/requestRoutes.js");
const issueRoutes = require("./routes/issueRoutes.js");
const returnRoutes = require("./routes/returnRoutes.js");
const fineRoutes = require("./routes/fineRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const departmentRoutes = require("./routes/departmentRoutes.js");
const feedbackRoutes = require("./routes/feedbackRoutes");
const reviewRoutes = require( "./routes/reviewRoutes");
const digitalBookRoutes = require("./routes/digitalBookRoutes.js");
const digitalBookActivityRoutes = require(  "./routes/digitalBookActivityRoutes.js");
const reportRoutes = require("./routes/reportRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
// ==========================================
// DATABASE
// ==========================================

const connectDB = require("./config/db.js");
const createSuperAdmin = require("./utils/createSuperAdmin.js");

// ==========================================
// ENVIRONMENT
// ==========================================

dotenv.config();

// ==========================================
// APP
// ==========================================

const app = express();

// ==========================================
// PORT
// ==========================================

const PORT = process.env.PORT || 5000;

// ==========================================
// UPLOAD FOLDER
// ==========================================

const uploadPath = path.resolve(__dirname, "uploads");

// ==========================================
// CHECK UPLOAD FOLDER
// ==========================================

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });

  console.log("📁 Upload folder created:", uploadPath);
} else {
  console.log("📁 Upload folder found:", uploadPath);
}

// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ==========================================
// COOKIE PARSER
// ==========================================

app.use(cookieParser());

// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==========================================
// STATIC UPLOAD FOLDER
// ==========================================
//
// Images will be accessible like:
//
// http://localhost:5000/uploads/image.jpg
//
// ==========================================

app.use(
  "/uploads",
  express.static(uploadPath, {
    fallthrough: false,
  })
);

// ==========================================
// IMAGE TEST ROUTE
// ==========================================
//
// This route helps confirm that the uploads
// folder is working.
//
// Example:
// http://localhost:5000/uploads-test
//
// ==========================================

app.get("/uploads-test", (req, res) => {
  try {
    const files = fs.readdirSync(uploadPath);

    res.json({
      success: true,
      message: "Uploads folder is working",
      uploadPath,
      totalFiles: files.length,
      files,
    });
  } catch (error) {
    console.error("UPLOAD TEST ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to read uploads folder",
      error: error.message,
    });
  }
});

// ==========================================
// DEFAULT ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Library Management System Backend Running",
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/books",
  bookRoutes
);

app.use(
  "/api/courses",
  courseRoutes
);

app.use(
  "/api/requests",
  requestRoutes
);

app.use(
  "/api/issues",
  issueRoutes
);

app.use(
  "/api/returns",
  returnRoutes
);

app.use(
  "/api/fines",
  fineRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/departments",
  departmentRoutes
);
app.use("/api/feedback", feedbackRoutes);

app.use(
  "/api/reviews",
  reviewRoutes
);
app.use(
 "/api/digital-books",
 digitalBookRoutes);
app.use(
  "/api/digital-book-activities",
  digitalBookActivityRoutes
);
app.use("/api/reports", reportRoutes);

app.use("/api/settings", settingsRoutes);
// ==========================================
// 404 API ROUTE
// ==========================================

app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({
      success: false,
      message: "API route not found",
      path: req.originalUrl,
    });
  }

  next();
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message ||
      "Internal Server Error",
  });
});

// ==========================================
// DATABASE CONNECTION + SERVER
// ==========================================

const startServer = async () => {
  try {
    // ----------------------------------------
    // Connect MongoDB
    // ----------------------------------------

    await connectDB();

    console.log("✅ MongoDB Connected");

    // ----------------------------------------
    // Create Super Admin
    // ----------------------------------------

    await createSuperAdmin();

    // ----------------------------------------
    // Start Server
    // ----------------------------------------

    app.listen(PORT, () => {
      console.log(
        `🚀 Server Running on Port ${PORT}`
      );

      console.log(
        `📁 Upload Folder: ${uploadPath}`
      );

      console.log(
        `🖼️ Images URL: http://localhost:${PORT}/uploads`
      );

      console.log(
        `🧪 Upload Test: http://localhost:${PORT}/uploads-test`
      );
    });
  } catch (error) {
    console.error(
      "❌ Server Startup Failed:",
      error.message
    );

    process.exit(1);
  }
};

// ==========================================
// START SERVER
// ==========================================

startServer();

