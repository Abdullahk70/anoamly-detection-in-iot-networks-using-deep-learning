import express from "express";
import multer from "multer";
import path from "path";
import { featureSelection, handleFileUpload, labelEncoding, oneHotEncoding, retrieveLastDataset } from "../controllers/Controllers.js";

const router = express.Router();

// Multer memory storage configuration
const storage = multer.memoryStorage();  // Store file as a buffer in memory

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
router.get("/retrieve",retrieveLastDataset);
router.get("/featureselection",featureSelection);
router.post("/onehotencoding",oneHotEncoding);
router.post("/labelencoding",labelEncoding);
export default router;
