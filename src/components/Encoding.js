import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Card } from "@mui/material";
import { FaRegFileAlt, FaRegCheckCircle } from "react-icons/fa";

const Encoding = () => {
  // Example Data
  const data = [
    { feature: "Color", value: "Red" },
    { feature: "Size", value: "Large" },
    { feature: "Type", value: "Circle" },
  ];

  // State for selected method and encoded data
  const [selectedMethod, setSelectedMethod] = useState("One-Hot");
  const [encodedData, setEncodedData] = useState([]);

  // Handle Encoding Method Selection
  const handleMethodSelect = (method) => {
    setSelectedMethod(method);

    // Generate encoded data based on the method
    let updatedEncodedData = [];
    if (method === "One-Hot") {
      updatedEncodedData = data.map((item, index) => ({
        feature: item.feature,
        value: `OneHot_${index + 1}`, // Simulated One-Hot encoding
      }));
    } else if (method === "Label Encoding") {
      updatedEncodedData = data.map((item, index) => ({
        feature: item.feature,
        value: index + 1, // Simulated Label encoding
      }));
    }

    setEncodedData(updatedEncodedData);
  };

  return (
    <div className="encoding-page bg-gray-100 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-semibold text-gray-800">Feature Encoding</h1>
          <p className="text-md text-gray-600">Select an encoding method to transform categorical features.</p>
        </div>

        {/* Encoding Method Cards */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* One-Hot Encoding Card */}
          <Card
            className="encoding-card bg-white rounded-xl shadow-lg p-5 cursor-pointer transform hover:scale-105 transition-all duration-200"
            onClick={() => handleMethodSelect("One-Hot")}
          >
            <div className="text-center">
              <FaRegFileAlt className="text-4xl text-blue-500 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800">One-Hot Encoding</h3>
              <p className="text-sm text-gray-600">Transform categorical features into a binary vector.</p>
            </div>
          </Card>

          {/* Label Encoding Card */}
          <Card
            className="encoding-card bg-white rounded-xl shadow-lg p-5 cursor-pointer transform hover:scale-105 transition-all duration-200"
            onClick={() => handleMethodSelect("Label Encoding")}
          >
            <div className="text-center">
              <FaRegCheckCircle className="text-4xl text-green-500 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800">Label Encoding</h3>
              <p className="text-sm text-gray-600">Convert categorical values into integer labels.</p>
            </div>
          </Card>
        </div>

        {/* Preview Data Table */}
        <div className="bg-white rounded-xl shadow-lg p-5 mt-10 overflow-x-auto">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Preview Data Encoding</h3>
          <Table responsive hover className="text-sm table-fixed w-full transition-all duration-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">Feature</th>
                <th className="px-4 py-2 text-left text-gray-600">Original Value</th>
                <th className="px-4 py-2 text-left text-gray-600">Encoded Value</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-700">{row.feature}</td>
                  <td className="px-4 py-2 text-gray-700">{row.value}</td>
                  <td className="px-4 py-2 text-gray-700">{encodedData[index]?.value || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-6 mt-8">
          <Link to="/upload" className="bg-gradient-to-r bg-purple-600 text-white py-2 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200">
            Go to Data Upload
          </Link>
          <Link to="/normalization" className="bg-gradient-to-r bg-purple-600 text-white py-2 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200">
            Go to Normalization/Scaling
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Encoding;
