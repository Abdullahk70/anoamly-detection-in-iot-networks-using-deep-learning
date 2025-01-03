import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

const Visualization = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [graphType, setGraphType] = useState("Line Chart");
  const [plotData, setPlotData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/ml/visualization");
        const { rows, columns } = response.data;

        setData(rows);
        setColumns(columns);
        setSelectedColumns(columns.slice(0, 2));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0 && selectedColumns.length === 2) {
      setPlotData({
        x: data.map((row) => row[selectedColumns[0]]),
        y: data.map((row) => row[selectedColumns[1]]),
        type: graphType === "Histogram" ? "histogram" : "scatter",
        mode: graphType === "Scatter Plot" ? "markers" : "lines+markers",
        marker: { color: "blue" },
      });
    }
  }, [data, selectedColumns, graphType]);

  const handleGraphTypeChange = (event) => {
    setGraphType(event.target.value);
  };

  const handleColumnSelection = (event, axis) => {
    const selectedValue = event.target.value;
    setSelectedColumns((prev) =>
      axis === "x"
        ? [selectedValue, prev[1]]
        : [prev[0], selectedValue]
    );
  };

  return (
    <div className="visualization-page bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-semibold text-gray-800">Data Visualization</h1>
          <p className="text-sm text-gray-600">
            Select a visualization type and customize it with filters.
          </p>
        </div>

        {columns.length > 0 ? (
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
                {/* <option>Histogram</option> */}
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
        ) : (
          <p className="text-center text-gray-600">Loading data...</p>
        )}

        {data.length > 0 && selectedColumns.length === 2 && plotData ? (
          <div className="bg-white shadow-lg rounded-lg p-3">
            <Plot
              data={[plotData]}
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
        ) : null}
      </div>
    </div>
  );
};

export default Visualization;
