import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Card } from "@mui/material";
import { FaRegFileAlt, FaRegCheckCircle } from "react-icons/fa";

const Encoding = () => {
  const [data, setData] = useState([]);
  const [encodedData, setEncodedData] = useState([]); // Default to an empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/ml/retrieve");
        console.log("Fetched Data:", response.data);  // Check if the data is fetched correctly
        setData(response.data); // Set the fetched dataset
      } catch (err) {
        console.error(err);
        setError("Failed to fetch the dataset. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDataset();
  }, []);

  // Handle Encoding Method Selection
  const handleMethodSelect = async (method) => {
    setLoading(true);
    setError(null);

    const endpoint =
      method === "One-Hot"
        ? "http://localhost:5000/ml/onehotencoding"
        : "http://localhost:5000/ml/labelencoding";

    console.log(`Calling ${method} encoding API...`);

    try {
      const response = await axios.post(endpoint, { data });
      console.log(`${method} Encoded Data:`, response.data);  // Check the response
      if (Array.isArray(response.data)) {
        // Flatten the response data before setting it
        const flattenedData = response.data.map((item) => Object.values(item)[0]);
        setEncodedData(flattenedData); // Store the flattened data
      } else {
        setEncodedData([]); // If the response isn't an array, reset the encoded data
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch encoded data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="encoding-page bg-gray-100 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-semibold text-gray-800">Feature Encoding</h1>
          <p className="text-md text-gray-600">
            Select an encoding method to transform categorical features.
          </p>
        </div>

        {/* Encoding Method Cards */}
        <div className="grid lg:grid-cols-3 gap-6">
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

        {/* Encoded Data Table */}
        <div className="bg-white rounded-xl shadow-lg p-5 mt-10 overflow-x-auto">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Encoded Data</h3>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : encodedData.length === 0 ? (
            <p className="text-gray-600">No encoded data available. Please select an encoding method.</p>
          ) : (
            <Table responsive hover className="text-sm table-fixed w-full transition-all duration-200">
              <thead className="bg-gray-100">
                <tr>
                  {encodedData[0] && Object.keys(encodedData[0]).map((key, index) => (
                    <th key={index} className="px-4 py-2 text-left text-gray-600">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {encodedData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((value, colIndex) => (
                      <td key={colIndex} className="px-4 py-2 text-gray-700">
                        {value !== null && value !== undefined ? value : "N/A"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>

        {/* Original Data Table */}
        <div className="bg-white rounded-xl shadow-lg p-5 mt-10 overflow-x-auto">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Original Data</h3>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : data.length === 0 ? (
            <p className="text-gray-600">No data available.</p>
          ) : (
            <Table responsive hover className="text-sm table-fixed w-full transition-all duration-200">
              <thead className="bg-gray-100">
                <tr>
                  {Object.keys(data[0]).map((key, index) => (
                    <th key={index} className="px-4 py-2 text-left text-gray-600">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((value, colIndex) => (
                      <td key={colIndex} className="px-4 py-2 text-gray-700">
                        {value !== null && value !== undefined ? value : "N/A"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-6 mt-8">
          <Link
            to="/upload"
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200"
          >
            Go to Data Upload
          </Link>
          <Link
            to="/normalization"
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200"
          >
            Go to Normalization/Scaling
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Encoding;
