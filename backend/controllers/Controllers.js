import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleFileUpload = async (req, res) => {
  try {
    console.log("Backend hit");
    // Get file details
    const filePath = path.join(__dirname, "../", req.file.path);
    console.log(`File uploaded at: ${filePath}`);

    // Spawn a child process to run the Python script
    const python = spawn("python", ["python_scripts/process_data.py", filePath]);

    // Capture Python script's standard output
    let scriptOutput = "";
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
