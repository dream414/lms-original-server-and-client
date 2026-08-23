const express=require("express");

const router=express.Router();

const protect=require("../middleware/authMiddleware");

const authorize=require("../middleware/roleMiddleware");

const upload=require("../middleware/uploadMiddleware");

const{

addBook,
getBooks,
getBook,
updateBook,
deleteBook,
searchBook

}=require("../controllers/bookController");

// Student & Everyone
router.get("/",getBooks);

router.get("/search",searchBook);

router.get("/:id",getBook);

// Admin & Librarian
router.post(
  "/",
  protect,
  authorize("admin", "librarian", "superadmin"),
  upload.bookUpload.single("image"),
  addBook
);
router.put(
"/:id",
protect,
authorize("admin","librarian","superadmin"),
updateBook
);

router.delete(
"/:id",
protect,
authorize("admin","librarian","superadmin"),
deleteBook
);

module.exports=router;