import React, { useState } from "react";
import Plot from "react-plotly.js";

const DataSplitting = () => {
  // State for the split ratios
  const [trainRatio, setTrainRatio] = useState(70);
  const [testRatio, setTestRatio] = useState(20);
  const [valRatio, setValRatio] = useState(10);

  // Calculate the data for the pie chart based on the ratios
  const pieData = [
    { type: "slice", value: trainRatio, color: "#4CAF50", label: "Training" },
    { type: "slice", value: testRatio, color: "#FFC107", label: "Testing" },
    { type: "slice", value: valRatio, color: "#2196F3", label: "Validation" },
  ];

  // Handle changes in the sliders
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

  // Ensure the total sum of ratios is 100
  const handleBlur = () => {
    const total = trainRatio + testRatio + valRatio;
    if (total !== 100) {
      const diff = total - 100;
      if (trainRatio > 0) setTrainRatio(trainRatio - diff);
      else if (testRatio > 0) setTestRatio(testRatio - diff);
      else setValRatio(valRatio - diff);
    }
  };

  return (
    <div className="data-splitting-container p-8 bg-gray-100">
      <h1 className="text-3xl font-semibold text-center mb-6">Data Splitting</h1>
      <div className="flex justify-around mb-6">
        <div>
          <label className="block text-lg mb-2">Training Data:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={trainRatio}
            onChange={(e) => handleSliderChange(e, "train")}
            className="w-full"
          />
          <input
            type="number"
            value={trainRatio}
            onChange={(e) => handleSliderChange(e, "train")}
            onBlur={handleBlur}
            className="mt-2 w-16 text-center"
          />
        </div>
        <div>
          <label className="block text-lg mb-2">Testing Data:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={testRatio}
            onChange={(e) => handleSliderChange(e, "test")}
            className="w-full"
          />
          <input
            type="number"
            value={testRatio}
            onChange={(e) => handleSliderChange(e, "test")}
            onBlur={handleBlur}
            className="mt-2 w-16 text-center"
          />
        </div>
        <div>
          <label className="block text-lg mb-2">Validation Data:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={valRatio}
            onChange={(e) => handleSliderChange(e, "val")}
            className="w-full"
          />
          <input
            type="number"
            value={valRatio}
            onChange={(e) => handleSliderChange(e, "val")}
            onBlur={handleBlur}
            className="mt-2 w-16 text-center"
          />
        </div>
      </div>

      {/* Pie Chart to visualize the split */}
      <div className="flex justify-center">
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
            transition: { duration: 500, easing: "cubic-in-out" },
          }}
        />
      </div>
    </div>
  );
};

export default DataSplitting;
