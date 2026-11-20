const multer = require("multer");

// =================================
// Book Image Upload
// =================================

const bookStorage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(
      null,
      "uploads/books"
    );

  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() +
        "-" +
        file.originalname
    );

  },

});

// =================================
// Course Files Upload
// =================================

const courseStorage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(
      null,
      "uploads/courses"
    );

  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() +
        "-" +
        file.originalname
    );

  },

});

// =================================
// Profile Image Upload
// =================================

const profileStorage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(
      null,
      "uploads/profiles"
    );

  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() +
        "-" +
        file.originalname
    );

  },

});

// =================================
// Digital Book Upload
// =================================

const digitalBookStorage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {

      if (
        file.fieldname ===
        "coverImage"
      ) {

        cb(
          null,
          "uploads/digital-books/covers"
        );

      } else if (
        file.fieldname ===
        "digitalFile"
      ) {

        cb(
          null,
          "uploads/digital-books/files"
        );

      } else {

        cb(
          new Error(
            "Invalid digital book file field"
          )
        );

      }

    },

    filename: (
      req,
      file,
      cb
    ) => {

      cb(
        null,
        Date.now() +
          "-" +
          file.originalname
      );

    },

  });

// =================================
// Upload Middlewares
// =================================

exports.bookUpload =
  multer({
    storage: bookStorage,
  });

exports.courseUpload =
  multer({
    storage: courseStorage,
  });

exports.profileUpload =
  multer({
    storage: profileStorage,
  });

exports.digitalBookUpload =
  multer({
    storage:
      digitalBookStorage,
  });