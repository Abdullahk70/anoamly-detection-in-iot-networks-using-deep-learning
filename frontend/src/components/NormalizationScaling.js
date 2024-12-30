import React, { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Range, getTrackBackground } from "react-range";

const NormalizationScaling = () => {
  const [openSection, setOpenSection] = useState(null);
  const [minMaxRange, setMinMaxRange] = useState([0, 1]);
  const [updatedData, setUpdatedData] = useState([]); // Store only updated data

  useEffect(() => {
    const fetchDataset = async () => {
      const response = await fetch("http://localhost:5000/ml/retrieveLastDataset");
      const data = await response.json();

      // Transform the data into an array of objects based on columns and data
      const transformedData = data.data.map((row, index) => {
        let rowObject = {};
        data.columns.forEach((col, idx) => {
          rowObject[col] = row[idx];
        });
        return rowObject;
      });

      setUpdatedData(transformedData); // Initialize with original data
    };
    fetchDataset();
  }, []);

  const handleApplyNormalization = async (method) => {
    let url = "";
    if (method === "Min-Max Scaling") {
      url = "http://localhost:5000/ml/minmax";
    } else if (method === "Z-Score Scaling") {
      url = "http://localhost:5000/ml/zscaling";
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: updatedData }),
    });

    const result = await response.json();

    // Check if the response data contains columns and data keys
    if (result.columns && result.data) {
      // Transform the scaled data into the same format as the original data
      const transformedData = result.data.map((row, index) => {
        let rowObject = {};
        result.columns.forEach((col, idx) => {
          rowObject[col] = row[idx];
        });
        return rowObject;
      });

      // Update the state with the transformed "after" data
      setUpdatedData(transformedData);
    } else {
      console.error("Invalid response format", result);
    }
  };

  // Function to render table dynamically based on the data
  const renderTable = (data) => {
    if (data.length === 0) return <p>No data available.</p>;

    const columns = Object.keys(data[0]); // Assuming all rows have the same keys
    return (
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-2 border border-gray-300 text-left">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col} className="px-4 py-2 border border-gray-300">{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto px-4 py-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-800">
          Normalization/Scaling
        </h1>

        <div className="space-y-4">
          {/* Min-Max Scaling Section */}
          <div className="border border-gray-300 rounded-lg">
            {/* <button
              onClick={() => setOpenSection(openSection === "minmax" ? null : "minmax")}
              className="w-full px-4 py-3 flex justify-between items-center text-lg font-semibold bg-gray-100 hover:bg-green-100 transition-all"
            >
              Min-Max Scaling
              {openSection === "minmax" ? <FiChevronUp /> : <FiChevronDown />}
            </button> */}
            {openSection === "minmax" && (
              <div className="p-4 transition-all">
                <p className="text-gray-600 mb-4">Rescale data to a specific range (default: 0 to 1).</p>
                <div className="mb-4">
                  <p className="mb-2 text-sm text-gray-500">Select Range</p>
                  <Range
                    step={0.1}
                    min={0}
                    max={10}
                    values={minMaxRange}
                    onChange={(values) => setMinMaxRange(values)}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        className="h-2 bg-gray-200 rounded-lg"
                        style={{
                          ...props.style,
                          background: getTrackBackground({
                            values: minMaxRange,
                            colors: ["#10B981", "#E5E7EB"],
                            min: 0,
                            max: 10,
                          }),
                        }}
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        className="h-4 w-4 bg-green-500 rounded-full shadow-md hover:scale-110 transform transition-all"
                      />
                    )}
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Min: {minMaxRange[0]}</span>
                    <span>Max: {minMaxRange[1]}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleApplyNormalization("Min-Max Scaling")}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-green-600 transition-all"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Z-Score Scaling Section */}
          <div className="border border-gray-300 rounded-lg">
            <button
              onClick={() => setOpenSection(openSection === "zscore" ? null : "zscore")}
              className="w-full px-4 py-3 flex justify-between items-center text-lg font-semibold bg-gray-100 hover:bg-green-100 transition-all"
            >
              Z-Score Scaling
              {openSection === "zscore" ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openSection === "zscore" && (
              <div className="p-4 transition-all">
                <p className="text-gray-600 mb-4">Standardize data by centering around the mean and scaling by standard deviation.</p>
                <button
                  onClick={() => handleApplyNormalization("Z-Score Scaling")}
                  className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-purple-700 transition-all"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>

        {/* After Visualization - Only show the updated data */}
        {updatedData.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Updated Data</h2>
            <div className="p-4 bg-green-50 rounded-lg shadow">
              {renderTable(updatedData)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NormalizationScaling;
