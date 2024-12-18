import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import datasetModel from "../models/datasetModel.js"; // Assuming your dataset model is in this path
import { parse } from "json2csv"; // You'll need the json2csv package to convert JSON to CSV
import { Buffer } from "buffer"; 

// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle file upload
export const handleFileUpload = async (req, res) => {
  try {
    console.log("Backend hit");

    // Get the uploaded file and its buffer
    const file = req.file;
    const buffer = file.buffer; // Buffer of the uploaded file
    const fileType = file.mimetype.startsWith("image")
      ? "Image"
      : file.originalname.split(".").pop().toUpperCase(); // Get the file type based on the mime type or extension

    console.log(`File uploaded with name: ${file.originalname}`);

    // Save the file to MongoDB as a buffer
    const newDataset = new datasetModel({
      filename: file.originalname,
      contentType: file.mimetype,
      file: buffer,
    });

    // Save the dataset document to MongoDB
    await newDataset.save();
    console.log("File saved to database successfully");

    // Encode the buffer to base64 to safely send binary data
    const encodedBuffer = buffer.toString("base64");

    // Spawn a child process to run the Python script
    const python = spawn("python", [
      "python_scripts/process_data.py",
      fileType,
    ]);

    // Send the base64 encoded buffer to the Python script
    python.stdin.write(encodedBuffer);
    python.stdin.end();

    let scriptOutput = "";

    // Capture Python script's standard output
    python.stdout.on("data", (data) => {
      scriptOutput += data.toString();
    });

    // Capture Python script's error output
    python.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data.toString()}`);
    });

    // Handle script completion
    python.on("close", (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        return res.status(500).json({ error: "Python script failed" });
      }

      try {
        // Parse the output (assuming Python script returns JSON)
        const parsedOutput = JSON.parse(scriptOutput);
        console.log("Python script output:", parsedOutput);

        // Respond with success
        res.json({ success: true, data: parsedOutput });
      } catch (parseError) {
        console.error("Error parsing Python script output:", parseError);
        res.status(500).json({ error: "Error processing Python script output" });
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
};

// Retrieve the last uploaded dataset (assumes CSV format)
export const retrieveLastDataset = async (req, res) => {
  try {
    // Retrieve the most recent dataset (last uploaded file)
    const lastDataset = await datasetModel.findOne().sort({ createdAt: -1 }).limit(1);

    // If no dataset is found
    if (!lastDataset) {
      return res.status(404).json({ error: "No dataset found" });
    }

    // The file buffer is already in CSV format (as per your data storage method)
    const fileBuffer = lastDataset.file;
    const fileType = lastDataset.contentType;

    // Ensure the content type is "text/csv"
    if (fileType === "text/csv") {
      // Send the buffer back as a file download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=last_uploaded_data.csv"
      );
      res.send(fileBuffer); // Send the buffer as the file content
    } else {
      // Return an error if the file type is not CSV
      return res.status(415).json({ error: "Unsupported file format" });
    }
  } catch (error) {
    console.error("Error retrieving dataset:", error);
    res.status(500).json({ error: "Error retrieving dataset" });
  }
};
