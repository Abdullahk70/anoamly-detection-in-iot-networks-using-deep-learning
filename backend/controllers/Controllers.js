import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import { exec } from "child_process";
import datasetModel from "../models/datasetModel.js"; // Assuming your dataset model is in this path
import { parse } from "json2csv"; // You'll need the json2csv package to convert JSON to CSV
import { Buffer } from "buffer";
import csv from "csv-parser"; 
import csvParser from "csv-parser";// Install using `npm install csv-parser`
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
    const lastDataset = await datasetModel
      .findOne()
      .sort({ createdAt: -1 })
      .limit(1);

    if (!lastDataset) {
      return res.status(404).json({ error: "No dataset found" });
    }

    const fileBuffer = lastDataset.file.toString("utf-8"); // Convert buffer to string (CSV format)

    // Spawn Python script for One-Hot Encoding
    const python = spawn("python", [
      path.join(__dirname, "../python_scripts/one_hot_encoding.py"),
    ]);

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
        return res
          .status(500)
          .json({ error: "One-Hot Encoding script failed" });
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
    const lastDataset = await datasetModel
      .findOne()
      .sort({ createdAt: -1 })
      .limit(1);

    if (!lastDataset) {
      return res.status(404).json({ error: "No dataset found" });
    }

    const fileBuffer = lastDataset.file.toString("utf-8"); // Convert buffer to string (CSV format)

    // Spawn Python script for Label Encoding
    const python = spawn("python", [
      path.join(__dirname, "../python_scripts/label_encoding.py"),
    ]);

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
        res.json(processedResult);
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

export const featureSelection = async (req, res) => {
  try {
    // Retrieve the last uploaded dataset
    const lastDataset = await datasetModel
      .findOne()
      .sort({ createdAt: -1 })
      .limit(1);
    if (!lastDataset) {
      return res.status(404).json({ error: "No dataset found" });
    }

    const fileBuffer = lastDataset.file.toString("utf-8"); // Convert buffer to string (CSV format)

    // Spawn Python script for feature selection
    const python = spawn("python", [
      path.join(__dirname, "../python_scripts/feature_selection.py"),
    ]);

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
        return res
          .status(500)
          .json({ error: "Feature Selection script failed" });
      }

      try {
        const result = JSON.parse(scriptOutput); // Parse JSON output from Python
        // Reformat the data for frontend compatibility
        const features = Object.keys(result);
        const importanceData = features.map((feature) => ({
          feature: feature,
          importance: result[feature],
        }));

        res.json({ features, importanceData }); // Return the result to the frontend
      } catch (err) {
        res.status(500).json({ error: "Error parsing Python script output" });
      }
    });
  } catch (err) {
    console.error("Error during Feature Selection:", err);
    res.status(500).json({ error: "Server error during Feature Selection" });
  }
};

// Min-Max Scaling Controller
export const minMaxScaling = async (req, res) => {
  try {
    // Retrieve the last uploaded dataset
    const lastDataset = await datasetModel
      .findOne()
      .sort({ createdAt: -1 })
      .limit(1);

    if (!lastDataset) {
      return res.status(404).json({ error: "No dataset found" });
    }

    const fileBuffer = lastDataset.file.toString("utf-8"); // Convert buffer to string (CSV format)

    // Spawn Python script for Min-Max Scaling
    const python = spawn("python", [
      path.join(__dirname, "../python_scripts/min_max_scaling.py"),
    ]);

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
        return res.status(500).json({ error: "Min-Max Scaling script failed" });
      }

      try {
        const result = JSON.parse(scriptOutput); // Parse JSON output from Python
        res.json(result); // Return the transformed data
      } catch (err) {
        res.status(500).json({ error: "Error parsing Python script output" });
      }
    });
  } catch (err) {
    console.error("Error during Min-Max Scaling:", err);
    res.status(500).json({ error: "Server error during Min-Max Scaling" });
  }
};

// Z-Score Scaling Controller
export const zScoreScaling = async (req, res) => {
  try {
    // Retrieve the last uploaded dataset
    const lastDataset = await datasetModel
      .findOne()
      .sort({ createdAt: -1 })
      .limit(1);

    if (!lastDataset) {
      return res.status(404).json({ error: "No dataset found" });
    }

    const fileBuffer = lastDataset.file.toString("utf-8"); // Convert buffer to string (CSV format)

    // Spawn Python script for Z-Score Scaling
    const python = spawn("python", [
      path.join(__dirname, "../python_scripts/z_score_scaling.py"),
    ]);

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
        return res.status(500).json({ error: "Z-Score Scaling script failed" });
      }

      try {
        const result = JSON.parse(scriptOutput); // Parse JSON output from Python
        res.json(result); // Return the transformed data
      } catch (err) {
        res.status(500).json({ error: "Error parsing Python script output" });
      }
    });
  } catch (err) {
    console.error("Error during Z-Score Scaling:", err);
    res.status(500).json({ error: "Server error during Z-Score Scaling" });
  }
};

export const iqrOutlierDetection = async (req, res) => {
  try {
    const lastDataset = await datasetModel
      .findOne()
      .sort({ createdAt: -1 })
      .limit(1);

    if (!lastDataset) {
      return res.status(404).json({ error: "No dataset found" });
    }

    const fileBuffer = lastDataset.file.toString("utf-8");

    const python = spawn("python", [
      path.join(__dirname, "../python_scripts/iqr_outlier_detection.py"),
    ]);

    let scriptOutput = "";

    python.stdin.write(fileBuffer);
    python.stdin.end();

    python.stdout.on("data", (data) => {
      scriptOutput += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data}`);
    });

    python.on("close", (code) => {
      if (code !== 0) {
        return res
          .status(500)
          .json({ error: "IQR Outlier Detection script failed" });
      }

      try {
        const result = JSON.parse(scriptOutput);
        res.json(result);
      } catch (err) {
        res
          .status(500)
          .json({ error: `Error parsing Python script output ${err}` });
      }
    });
  } catch (err) {
    console.error("Error during IQR Outlier Detection:", err);
    res
      .status(500)
      .json({ error: `Server error during IQR Outlier Detection ${err}` });
  }
};

export const isolationForestOutlierDetection = async (req, res) => {
  try {
    const lastDataset = await datasetModel
      .findOne()
      .sort({ createdAt: -1 })
      .limit(1);

    if (!lastDataset) {
      return res.status(404).json({ error: "No dataset found" });
    }

    const fileBuffer = lastDataset.file.toString("utf-8");

    const python = spawn("python", [
      path.join(
        __dirname,
        "../python_scripts/isolation_forest_outlier_detection.py"
      ),
    ]);

    let scriptOutput = "";

    python.stdin.write(fileBuffer);
    python.stdin.end();

    python.stdout.on("data", (data) => {
      scriptOutput += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data}`);
    });

    python.on("close", (code) => {
      if (code !== 0) {
        return res
          .status(500)
          .json({ error: "Isolation Forest script failed" });
      }

      try {
        const result = JSON.parse(scriptOutput);
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: "Error parsing Python script output" });
      }
    });
  } catch (err) {
    console.error("Error during Isolation Forest Outlier Detection:", err);
    res
      .status(500)
      .json({
        error: "Server error during Isolation Forest Outlier Detection",
      });
  }
};

export const zScoreOutlierDetection = async (req, res) => {
  try {
    const lastDataset = await datasetModel
      .findOne()
      .sort({ createdAt: -1 })
      .limit(1);

    if (!lastDataset) {
      return res.status(404).json({ error: "No dataset found" });
    }

    const fileBuffer = lastDataset.file.toString("utf-8");

    const python = spawn("python", [
      path.join(__dirname, "../python_scripts/z_score_outlier_detection.py"),
    ]);

    let scriptOutput = "";

    python.stdin.write(fileBuffer);
    python.stdin.end();

    python.stdout.on("data", (data) => {
      scriptOutput += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data}`);
    });

    python.on("close", (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: "Z-Score script failed" });
      }

      try {
        const result = JSON.parse(scriptOutput);
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: "Error parsing Python script output" });
      }
    });
  } catch (err) {
    console.error("Error during Z-Score Outlier Detection:", err);
    res
      .status(500)
      .json({ error: "Server error during Z-Score Outlier Detection" });
  }
};

export const getVisualizationData = async (req, res) => {
  try {
    // Retrieve the last uploaded dataset
    const lastDataset = await datasetModel.findOne().sort({ createdAt: -1 });

    if (!lastDataset) {
      return res.status(404).json({ error: "No dataset found" });
    }

    const fileBuffer = lastDataset.file.toString("utf-8"); // Convert buffer to CSV string

    // Spawn the Python script for processing
    const python = spawn("python", [
      path.join(__dirname, "../python_scripts/visualization_data.py"),
    ]);

    let scriptOutput = "";

    python.stdin.write(fileBuffer); // Send CSV data to Python script
    python.stdin.end();

    // Capture script output
    python.stdout.on("data", (data) => {
      scriptOutput += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data}`);
    });

    python.on("close", (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: "Visualization script failed" });
      }

      try {
        const result = JSON.parse(scriptOutput); // Parse the JSON output
        res.json(result); // Send processed data to the frontend
      } catch (err) {
        res.status(500).json({ error: "Error parsing Python script output" });
      }
    });
  } catch (err) {
    console.error("Error during dataset processing:", err);
    res.status(500).json({ error: "Server error during dataset processing" });
  }
};



export const getLastDataset = async (req, res) => {
  try {
    // Fetch the latest dataset
    const lastDataset = await datasetModel
      .findOne()
      .sort({ createdAt: -1 })
      .limit(1);

    if (!lastDataset) {
      return res.status(404).json({ error: "No dataset found" });
    }

    const fileBuffer = lastDataset.file.toString("utf-8");

    // Check if fileBuffer is not empty
    if (!fileBuffer) {
      return res.status(400).json({ error: "Dataset file is empty" });
    }

    // Split the file into rows (assuming CSV format)
    const rows = fileBuffer.split("\n").filter(row => row.trim() !== ''); // Filter out empty rows
    const headers = rows[0].split(",").map(header => header.trim()); // Get headers and trim them

    // Validate if headers are valid
    if (headers.length === 0) {
      return res.status(400).json({ error: "Invalid dataset headers" });
    }

    // Process the rows into data objects, skipping any rows with missing columns
    const dataset = rows.slice(1).map((row) => {
      const columns = row.split(",");
      
      // Make sure the row has enough columns to match the headers
      if (columns.length !== headers.length) {
        console.warn(`Skipping row due to mismatched column count: ${row}`);
        return null;
      }

      let item = {};
      headers.forEach((header, index) => {
        // Only assign if the column exists and isn't undefined
        item[header] = columns[index] ? columns[index].trim() : '';
      });
      
      return item;
    }).filter(item => item !== null); // Remove null items (mismatched rows)

    res.json({
      headers,
      dataset, // Return the valid dataset
    });
  } catch (err) {
    console.error("Error fetching last dataset:", err);
    res.status(500).json({ error: "Server error while fetching last dataset" });
  }
};


export const splitDataset = async (req, res) => {
  try {
    // Retrieve the last uploaded dataset from MongoDB
    const lastDataset = await datasetModel
      .findOne()
      .sort({ createdAt: -1 })
      .limit(1);

    if (!lastDataset) {
      return res.status(404).json({ error: "No dataset found" });
    }

    const fileBuffer = lastDataset.file; // Get the file buffer directly from the database
    const { trainRatio, testRatio, valRatio, fileType } = req.body; // Retrieve ratios and file type from the frontend request

    // Convert ratios from percentage (0-100) to decimal (0-1)
    const trainRatioDecimal = trainRatio / 100;
    const testRatioDecimal = testRatio / 100;
    const valRatioDecimal = valRatio / 100;

    // Validate that the ratios sum to 1
    if (trainRatioDecimal + testRatioDecimal + valRatioDecimal !== 1) {
      return res.status(400).json({
        error: "Ratios must sum to 1 (e.g., trainRatio + testRatio + valRatio = 1).",
      });
    }

    // Spawn Python script for dataset splitting
    const python = spawn("python", [
      path.join(__dirname, "../python_scripts/split_dataset.py"),
      fileType, // Pass file type (e.g., CSV or Excel) to Python
    ]);

    let scriptOutput = "";

    // Send the file data (binary) and ratios to Python script
    python.stdin.write(fileBuffer); // Send file as binary data
    python.stdin.write(JSON.stringify({ trainRatio: trainRatioDecimal, testRatio: testRatioDecimal, valRatio: valRatioDecimal }));
    python.stdin.end();

    // Capture Python script output
    python.stdout.on("data", (data) => {
      scriptOutput += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data.toString()}`);
    });

    python.on("close", (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code: ${code}`);
        return res.status(500).json({ error: "Dataset splitting script failed" });
      }

      try {
        const result = JSON.parse(scriptOutput); // Parse JSON output from Python
        res.json(result); // Send JSON response to the frontend
      } catch (err) {
        console.error("Error parsing Python script output:", err);
        return res.status(500).json({ error: "Error parsing Python script output" });
      }
    });
  } catch (err) {
    console.error("Error during dataset splitting:", err);
    res.status(500).json({ error: "Server error during dataset splitting" });
  }
};



export const exporter = async (req, res) => {
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
      let headers = [];

      stream
        .pipe(csv())
        .on("data", (data) => {
          // On first row, extract headers
          if (headers.length === 0) {
            headers = Object.keys(data);
          }
          rows.push(data);
        })
        .on("end", () => {
          // Return data in the expected format
          res.status(200).json({ headers, dataset: rows });
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