import React, { useState } from "react";
import Plot from "react-plotly.js";

const Visualization = () => {
  // Mock dataset
  const [mockData] = useState([
    { x: 1, y: 10 },
    { x: 2, y: 20 },
    { x: 3, y: 15 },
    { x: 4, y: 30 },
    { x: 5, y: 25 },
  ]);

  // Extract unique keys from the mock dataset for dynamic column selection
  const columns = Object.keys(mockData[0]);

  // State for data configuration
  const [data, setData] = useState({
    x: mockData.map((row) => row[columns[0]]),
    y: mockData.map((row) => row[columns[1]]),
    type: "scatter",
    mode: "lines+markers",
    marker: { color: "blue" },
  });

  const [graphType, setGraphType] = useState("Line Chart");
  const [selectedColumns, setSelectedColumns] = useState(columns); // Default to first two columns

  // Update graph type
  const handleGraphTypeChange = (event) => {
    const selectedType = event.target.value;
    setGraphType(selectedType);

    // Adjust graph type in data
    let updatedType = "scatter";
    let mode = "lines+markers";
    if (selectedType === "Histogram") {
      updatedType = "histogram";
      mode = undefined;
    } else if (selectedType === "Scatter Plot") {
      updatedType = "scatter";
      mode = "markers";
    }

    setData((prevData) => ({
      ...prevData,
      type: updatedType,
      mode,
    }));
  };

  // Handle column selection for X and Y
  const handleColumnSelection = (event, axis) => {
    const selectedValue = event.target.value;

    // Update data for selected column
    setSelectedColumns((prev) =>
      axis === "x"
        ? [selectedValue, prev[1]]
        : [prev[0], selectedValue]
    );

    setData((prevData) => ({
      ...prevData,
      [axis]: mockData.map((row) => row[selectedValue]),
    }));
  };

  return (
    <div className="visualization-page bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-semibold text-gray-800">Data Visualization</h1>
          <p className="text-sm text-gray-600">
            Select a visualization type and customize it with filters.
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-between items-center bg-white shadow-lg rounded-lg p-3 mb-6">
          <div>
            <label htmlFor="graphType" className="text-gray-800 font-medium mr-2">
              Visualization Type:
            </label>
            <select
              id="graphType"
              value={graphType}
              onChange={handleGraphTypeChange}
              className="border border-gray-300 rounded-md p-1 text-sm"
            >
              <option>Line Chart</option>
              <option>Histogram</option>
              <option>Scatter Plot</option>
            </select>
          </div>

          <div>
            <label htmlFor="xColumn" className="text-gray-800 font-medium mr-2">
              X-Axis:
            </label>
            <select
              id="xColumn"
              value={selectedColumns[0]}
              onChange={(e) => handleColumnSelection(e, "x")}
              className="border border-gray-300 rounded-md p-1 text-sm"
            >
              {columns.map((col, index) => (
                <option key={index} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="yColumn" className="text-gray-800 font-medium mr-2">
              Y-Axis:
            </label>
            <select
              id="yColumn"
              value={selectedColumns[1]}
              onChange={(e) => handleColumnSelection(e, "y")}
              className="border border-gray-300 rounded-md p-1 text-sm"
            >
              {columns.map((col, index) => (
                <option key={index} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Graph */}
        <div className="bg-white shadow-lg rounded-lg p-3">
          <Plot
            data={[
              {
                x: data.x,
                y: data.y,
                type: data.type,
                mode: data.mode,
                marker: data.marker,
              },
            ]}
            layout={{
              title: `${graphType}`,
              autosize: true,
              margin: { t: 30, r: 20, l: 40, b: 30 },
              xaxis: { title: selectedColumns[0] },
              yaxis: { title: selectedColumns[1] },
              plot_bgcolor: "#f9fafb",
              paper_bgcolor: "#ffffff",
            }}
            useResizeHandler
            style={{ width: "100%", height: "400px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Visualization;


