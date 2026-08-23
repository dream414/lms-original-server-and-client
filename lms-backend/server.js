const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes=require("./routes/authRoutes.js");
const bookRoutes=require("./routes/bookRoutes.js");
const courseRoutes=require("./routes/courseRoutes.js");
const requestRoutes  =require("./routes/requestRoutes.js");
const issueRoutes =require("./routes/issueRoutes.js");
const returnRoutes=require("./routes/retrunRoutes.js");
const  fineRoutes =require( "./routes/fineRoutes.js");
const  notificationRoutes =require("./routes/notificationRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db.js");

dotenv.config();




// Database Connection
connectDB();


const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// Upload Folder
app.use("/uploads", express.static("uploads"));

// Default Route
app.get("/", (req, res) => {

    res.json({

        success: true,

        message: "Library Management System Backend Running"

    });

});

app.use("/api/auth",authRoutes);
app.use("/api/books",bookRoutes);
app.use("/api/courses",courseRoutes);
app.use("/api/requests",requestRoutes);
app.use("/api/issues",issueRoutes);
app.use("/api/returns",returnRoutes);
app.use("/api/fines",fineRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`🚀 Server Running on Port ${PORT}`);

});