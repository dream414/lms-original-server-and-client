const multer = require("multer");

// =================================
// Book Image Upload
// =================================

const bookStorage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "uploads/books");

  },

  filename: (req, file, cb) => {

    cb(null, Date.now() + "-" + file.originalname);

  }

});

// =================================
// Course Files Upload
// =================================

const courseStorage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "uploads/courses");

  },

  filename: (req, file, cb) => {

    cb(null, Date.now() + "-" + file.originalname);

  }

});

// =================================
// Profile Image Upload
// =================================

const profileStorage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "uploads/profiles");

  },

  filename: (req, file, cb) => {

    cb(null, Date.now() + "-" + file.originalname);

  }

});

// =================================
// Upload Middlewares
// =================================

exports.bookUpload = multer({

  storage: bookStorage

});

exports.courseUpload = multer({

  storage: courseStorage

});

exports.profileUpload = multer({

  storage: profileStorage

});