import path from "path";
import { PythonShell } from "python-shell";
import { fileURLToPath } from "url";


// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const handleFileUpload = async (req, res) => {
  try {
    console.log("backend hit");
    // Get file details
    const filePath = path.join(__dirname, "../", req.file.path);
    console.log(`File uploaded at: ${filePath}`);

    // Options for PythonShell
    const options = {
      mode: "text",
      pythonOptions: ["-u"], // Unbuffered output
      args: [filePath], // Pass file path to Python script
    };

    // Call Python script
    PythonShell.run("python_scripts/process_data.py", options, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Python script error" });
      }

      console.log("Python script output:", results);
      res.json({ success: true, data: results }); // Return results to the frontend
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "File upload failed" });
  }
};
