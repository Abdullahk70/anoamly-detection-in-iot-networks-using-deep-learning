import React, { useState } from "react";
import * as XLSX from "xlsx";

const DataUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [fileDetails, setFileDetails] = useState(null);
  const [datasetPreview, setDatasetPreview] = useState([]);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const allowedFormats = [".csv", ".xlsx", ".xls"];

  // Handle File Upload and Validation
  const handleFileUpload = (file) => {
    const fileExtension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();
    if (!allowedFormats.includes(fileExtension)) {
      setError("Unsupported file format. Please upload a CSV or Excel file.");
      return;
    }

    setError("");
    setUploadProgress(0);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    // Send File to Backend
    fetch("http://localhost:5000/ml/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to upload the file");
        }

        return response.json();
      })
      .then((data) => {
        setUploadProgress(100);
        setUploadSuccess(true);
        setFileDetails(data.fileDetails);
        setDatasetPreview(data.preview);
      })
      .catch((err) => {
        setError("File upload failed. Please try again.");
        console.error(err);
      });
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div
        className="w-full max-w-4xl p-8 bg-white shadow-xl rounded-lg transform transition-all duration-500"
        style={{ animation: "fadeIn 1.5s ease" }}
      >
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          🚀 Upload Your Dataset
        </h1>

        {/* Upload Section */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
            dragOver ? "border-green-400 bg-green-100" : "border-gray-300"
          }`}
        >
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            id="fileUpload"
            onChange={handleInputChange}
          />
          <label
            htmlFor="fileUpload"
            className="block cursor-pointer hover:scale-105 transform transition-all"
          >
            <div className="text-7xl mb-4">📂</div>
            <p className="text-lg text-gray-600">
              Drag & Drop your file here, or{" "}
              <span className="text-green-500 font-semibold hover:underline">
                click to browse
              </span>
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Supported formats: <strong>.csv, .xlsx, .xls</strong>
            </p>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-center text-red-500 font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* Progress Bar */}
        {uploadProgress > 0 && (
          <div className="mt-6">
            <p className="text-gray-600 mb-2">Uploading...</p>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {uploadSuccess && (
          <div className="mt-6 text-center">
            <div className="text-green-500 text-5xl mb-4">✅</div>
            <p className="text-xl font-semibold text-gray-700">
              Upload Successful!
            </p>
          </div>
        )}

        {/* File Details */}
        {fileDetails && (
          <div className="mt-8 text-gray-800">
            <h3 className="font-bold text-lg mb-2">📊 Dataset Overview</h3>
            <ul className="list-disc pl-6">
              <li>
                <strong>File Name:</strong> {fileDetails.name}
              </li>
              <li>
                <strong>File Size:</strong> {fileDetails.size} KB
              </li>
              <li>
                <strong>Rows:</strong> {fileDetails.rows}
              </li>
              <li>
                <strong>Columns:</strong> {fileDetails.columns}
              </li>
            </ul>
          </div>
        )}

        {datasetPreview && datasetPreview.length > 0 && (
          <div className="mt-8">
            <h3 className="font-bold text-lg mb-4">🔍 Dataset Preview</h3>
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full text-sm text-left text-gray-700">
                <thead>
                  <tr className="bg-gray-200">
                    {datasetPreview[0]?.map((_, idx) => (
                      <th key={idx} className="border p-2">
                        Column {idx + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {datasetPreview.slice(1)?.map((row, idx) => (
                    <tr
                      key={idx}
                      className="even:bg-gray-50 hover:bg-green-100 transition-all"
                    >
                      {row?.map((cell, idy) => (
                        <td key={idy} className="border p-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataUpload;
