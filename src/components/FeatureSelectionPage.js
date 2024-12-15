import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Checkbox, FormControlLabel } from "@mui/material";

const FeatureSelection = () => {
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const columns = ["Feature1", "Feature2", "Feature3", "Feature4", "Feature5"];
  const importanceData = [
    { feature: "Feature1", importance: 80 },
    { feature: "Feature2", importance: 70 },
    { feature: "Feature3", importance: 60 },
    { feature: "Feature4", importance: 50 },
    { feature: "Feature5", importance: 90 },
  ];

  const handleCheckboxChange = (event, feature) => {
    if (event.target.checked) {
      setSelectedFeatures([...selectedFeatures, feature]);
    } else {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedFeatures(columns);
    } else {
      setSelectedFeatures([]);
    }
  };

  return (
    <div className="feature-selection-page bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-semibold text-gray-800">Feature Selection</h1>
          <p className="text-md text-gray-600">Choose relevant features from your dataset and visualize their importance.</p>
        </div>

        {/* Main Content Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel: Feature Selection Table */}
          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Select Features</h3>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={handleSelectAll}
                  checked={selectedFeatures.length === columns.length}
                  color="primary"
                />
              }
              label="Select All"
            />
            <Table responsive hover className="mt-4 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-gray-700">Feature</th>
                  <th className="text-center text-gray-700">Select</th>
                </tr>
              </thead>
              <tbody>
                {columns.map((feature, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="text-gray-700">{feature}</td>
                    <td className="text-center">
                      <Checkbox
                        onChange={(e) => handleCheckboxChange(e, feature)}
                        checked={selectedFeatures.includes(feature)}
                        color="primary"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Right Panel: Feature Importance Graph */}
          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Feature Importance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={importanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feature" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="importance" stroke="#34D399" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Preview Selected Features Section */}
        <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Preview Selected Features</h3>
          {selectedFeatures.length > 0 ? (
            <div className="space-y-2">
              {selectedFeatures.map((feature, index) => (
                <div key={index} className="text-lg text-gray-700">{feature}</div>
              ))}
            </div>
          ) : (
            <div className="text-lg text-gray-500">No features selected</div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-6 mt-8">
          <Link to="/upload" className="bg-gradient-to-r  bg-purple-600 text-white py-2 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200">
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

export default FeatureSelection;
