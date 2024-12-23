import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import { exec } from "child_process";
import datasetModel from "../models/datasetModel.js"; // Assuming your dataset model is in this path
import { parse } from "json2csv"; // You'll need the json2csv package to convert JSON to CSV
import { Buffer } from "buffer";
import csvParser from "csv-parser"; // Install using `npm install csv-parser`
import { Readable } from "stream";

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
        res
          .status(500)
          .json({ error: "Error processing Python script output" });
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
    const lastDataset = await datasetModel
      .findOne()
      .sort({ createdAt: -1 })
      .limit(1);

    // If no dataset is found
    if (!lastDataset) {
      return res.status(404).json({ error: "No dataset found" });
    }

    const fileBuffer = lastDataset.file;
    const fileType = lastDataset.contentType;

    // Ensure the content type is "text/csv"
    if (fileType === "text/csv") {
      // Convert file buffer to JSON
      const stream = Readable.from(fileBuffer);
      const rows = [];

      stream
        .pipe(csvParser())
        .on("data", (data) => rows.push(data))
        .on("end", () => {
          res.status(200).json(rows); // Send parsed JSON data
        })
        .on("error", (err) => {
          console.error("Error parsing CSV:", err);
          res.status(500).json({ error: "Error processing dataset" });
        });
    } else {
      return res.status(415).json({ error: "Unsupported file format" });
    }
  } catch (error) {
    console.error("Error retrieving dataset:", error);
    res.status(500).json({ error: "Error retrieving dataset" });
  }
};



// One-Hot Encoding Controller
export const oneHotEncoding = async (req, res) => {
  try {
    // Retrieve the last uploaded file from MongoDB
    const lastDataset = await datasetModel.findOne().sort({ createdAt: -1 }).limit(1);

    if (!lastDataset) {
      return res.status(404).json({ error: "No dataset found" });
    }

    const fileBuffer = lastDataset.file.toString("utf-8"); // Convert buffer to string (CSV format)

    // Spawn Python script for One-Hot Encoding
    const python = spawn("python", [path.join(__dirname, "../python_scripts/one_hot_encoding.py")]);

    let scriptOutput = "";

    python.stdin.write(fileBuffer); // Send CSV data to the Python script
    python.stdin.end();

    // Capture Python script output
    python.stdout.on("data", (data) => {
      scriptOutput += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data}`);
    });

    python.on("close", (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: "One-Hot Encoding script failed" });
      }

      try {
        const result = JSON.parse(scriptOutput); // Parse JSON output from Python
        const processedResult = processEncodedData(result); // Process the data to reflect encoding results properly
        
        

        res.json(processedResult);
      } catch (err) {
        res.status(500).json({ error: "Error parsing Python script output" });
      }
    });
  } catch (err) {
    console.error("Error during One-Hot Encoding:", err);
    res.status(500).json({ error: "Server error during One-Hot Encoding" });
  }
};



// Label Encoding Controller
export const labelEncoding = async (req, res) => {
  try {
    // Retrieve the last uploaded file from MongoDB
    const lastDataset = await datasetModel.findOne().sort({ createdAt: -1 }).limit(1);

    if (!lastDataset) {
      return res.status(404).json({ error: "No dataset found" });
    }

    const fileBuffer = lastDataset.file.toString("utf-8"); // Convert buffer to string (CSV format)

    // Spawn Python script for Label Encoding
    const python = spawn("python", [path.join(__dirname, "../python_scripts/label_encoding.py")]);

    let scriptOutput = "";

    python.stdin.write(fileBuffer); // Send CSV data to the Python script
    python.stdin.end();

    // Capture Python script output
    python.stdout.on("data", (data) => {
      scriptOutput += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data}`);
    });

    python.on("close", (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: "Label Encoding script failed" });
      }

      try {
        const result = JSON.parse(scriptOutput); // Parse JSON output from Python
        const processedResult = processEncodedData(result); // Process the data to reflect encoding results properly
        res.json(processedResult );
      } catch (err) {
        res.status(500).json({ error: "Error parsing Python script output" });
      }
    });
  } catch (err) {
    console.error("Error during Label Encoding:", err);
    res.status(500).json({ error: "Server error during Label Encoding" });
  }
};

// Helper function to process the encoded data
const processEncodedData = (data) => {
  // Process the encoded data to display key-value pairs, including true/false, etc.
  const processedData = Object.entries(data).map(([key, value]) => {
    return { [key]: value };
  });
  return processedData;
};


