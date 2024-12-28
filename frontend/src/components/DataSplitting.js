import React, { useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

const DataSplitting = () => {
  const [trainRatio, setTrainRatio] = useState(70);
  const [testRatio, setTestRatio] = useState(20);
  const [valRatio, setValRatio] = useState(10);
  const [splitData, setSplitData] = useState(null); // To store the split data
  const [loading, setLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(null); // To handle errors
  const [errorMessage, setErrorMessage] = useState(""); // To handle error messages for sum of ratios

  // Calculate the data for the pie chart based on the ratios
  const pieData = [
    { type: "slice", value: trainRatio, color: "#4CAF50", label: "Training" },
    { type: "slice", value: testRatio, color: "#FFC107", label: "Testing" },
    { type: "slice", value: valRatio, color: "#2196F3", label: "Validation" },
  ];

  const handleSliderChange = (e, type) => {
    const value = parseInt(e.target.value, 10);
    if (type === "train") {
      setTrainRatio(value);
    } else if (type === "test") {
      setTestRatio(value);
    } else if (type === "val") {
      setValRatio(value);
    }
  };

  const handleBlur = () => {
    const total = trainRatio + testRatio + valRatio;
    if (total !== 100) {
      const diff = total - 100;
      if (trainRatio > 0) setTrainRatio(trainRatio - diff);
      else if (testRatio > 0) setTestRatio(testRatio - diff);
      else setValRatio(valRatio - diff);
    }
  };

  const handleSubmit = async () => {
    // Check if the ratios sum to 100 before submitting
    const total = trainRatio + testRatio + valRatio;
    if (total !== 100) {
      setErrorMessage("The sum of the ratios must be 100.");
      return;
    }

    setLoading(true);
    setError(null);
    setSplitData(null);
    setErrorMessage(""); // Clear any previous error message

    try {
      const response = await axios.post("http://localhost:5000/ml/split", {
        trainRatio,
        testRatio,
        valRatio,
      });

      setSplitData(response.data); // Save split data from backend
    } catch (err) {
      setError("Failed to split the dataset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-splitting-container p-8 bg-gray-100">
      <h1 className="text-3xl font-semibold text-center mb-6">Data Splitting</h1>

      {/* Ratio Controls */}
      <div className="flex justify-around mb-6">
        {["Training", "Testing", "Validation"].map((label, idx) => {
          const ratio = idx === 0 ? trainRatio : idx === 1 ? testRatio : valRatio;
          const type = idx === 0 ? "train" : idx === 1 ? "test" : "val";

          return (
            <div key={label}>
              <label className="block text-lg mb-2">{label} Data:</label>
              <input
                type="range"
                min="0"
                max="100"
                value={ratio}
                onChange={(e) => handleSliderChange(e, type)}
                className="w-full"
              />
              <input
                type="number"
                value={ratio}
                onChange={(e) => handleSliderChange(e, type)}
                onBlur={handleBlur}
                className="mt-2 w-16 text-center"
              />
            </div>
          );
        })}
      </div>

      {/* Error Message for Invalid Ratio Sum */}
      {errorMessage && (
        <div className="text-red-500 text-center mb-4">{errorMessage}</div>
      )}

      {/* Pie Chart */}
      <div className="flex justify-center mb-6">
        <Plot
          data={[
            {
              values: pieData.map((slice) => slice.value),
              labels: pieData.map((slice) => slice.label),
              hoverinfo: "label+percent",
              type: "pie",
              marker: {
                colors: pieData.map((slice) => slice.color),
              },
            },
          ]}
          layout={{
            title: "Data Split Visualization",
            showlegend: true,
            height: 400,
            width: 400,
            autosize: true,
          }}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Processing..." : "Split Dataset"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-center mb-6">{error}</div>
      )}

      {/* Split Data Table */}
      {splitData && (
        <div className="overflow-x-auto">
          <h2 className="text-xl font-semibold text-center mb-4">Split Data</h2>
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr>
                {Object.keys(splitData.training[0]).map((col) => (
                  <th
                    key={col}
                    className="border border-gray-200 px-4 py-2 bg-gray-300"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["training", "testing", "validation"].map((key, idx) => (
                <React.Fragment key={key}>
                  <tr>
                    <td
                      colSpan={Object.keys(splitData.training[0]).length}
                      className="bg-gray-100 text-center font-bold py-2"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)} Data
                    </td>
                  </tr>
                  {splitData[key].map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((cell, i) => (
                        <td
                          key={i}
                          className="border border-gray-200 px-4 py-2 text-sm"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DataSplitting;
