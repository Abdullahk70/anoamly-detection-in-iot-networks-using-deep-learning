import express from "express";
import multer from "multer";
import path from "path";
import { handleFileUpload } from "../controllers/Controllers.js";

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/datasets/"); // Save files to uploads/datasets/
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Timestamp to ensure unique names
  },
});

const upload = multer({ 
  storage, 
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".csv" || ext === ".xlsx" || ext === ".xls") {
      cb(null, true);
    } else {
      cb(new Error("Only CSV, XLSX, or XLS files are allowed"));
    }
  },
});

// Define the POST route for file uploads
router.post("/upload", upload.single("file"), handleFileUpload);

export default router;
