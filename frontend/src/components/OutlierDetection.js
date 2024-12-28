import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import Plot from "react-plotly.js";

const OutlierDetection = () => {
  const [method, setMethod] = useState("");
  const [plotData, setPlotData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [normalData, setNormalData] = useState([]);
  const [outliers, setOutliers] = useState([]);
  const [outlierCount, setOutlierCount] = useState(0);
  const [outlierPercentage, setOutlierPercentage] = useState(0);
  const [loading, setLoading] = useState(false);

  const apiEndpoints = {
    "z-score": "http://localhost:5000/ml/zscoreOutlier",
    iqr: "http://localhost:5000/ml/iqrOutlier",
    "isolation-forest": "http://localhost:5000/ml/isolationOutlier",
  };

  const handleMethodChange = async (event) => {
    const selectedMethod = event.target.value;
    setMethod(selectedMethod);

    if (!apiEndpoints[selectedMethod]) return;

    setLoading(true);

    try {
      // Fetch data from API
      const response = await fetch(apiEndpoints[selectedMethod]);
      const result = await response.json();

      // Process data based on the JSON format
      processData(result);

      // Calculate outlier metrics
      const totalOutliers = outliers.reduce((sum, col) => sum + col.length, 0);
      const totalData = normalData.reduce((sum, col) => sum + col.length, 0);
      setOutlierCount(totalOutliers);
      setOutlierPercentage(((totalOutliers / (totalData + totalOutliers)) * 100).toFixed(2));

      // Update plot data
      setPlotData(
        columns.map((col, index) => [
          {
            x: Array.from({ length: normalData[index].length }, (_, i) => i + 1),
            y: normalData[index],
            mode: "markers",
            marker: { color: "#4caf50", size: 10 },
            type: "scatter",
            name: `Normal Data (${col})`,
          },
          {
            x: Array.from({ length: outliers[index].length }, (_, i) => i + 1),
            y: outliers[index],
            mode: "markers",
            marker: { color: "#f44336", size: 12 },
            type: "scatter",
            name: `Outliers (${col})`,
          },
        ]).flat()
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const processData = (result) => {
    const { normalData, outliers, columns: apiColumns } = result;

    if (!apiColumns) {
      // Handle Z-Score JSON format
      const dynamicColumns = Object.keys(result);
      const normal = [];
      const outlier = [];

      dynamicColumns.forEach((col) => {
        if (result[col].normalData && result[col].outliers) {
          normal.push(result[col].normalData);
          outlier.push(result[col].outliers);
        }
      });

      setColumns(dynamicColumns);
      setNormalData(normal);
      setOutliers(outlier);
    } else {
      // Handle IQR and Isolation Forest JSON formats
      setColumns(apiColumns);
      setNormalData(normalData);
      setOutliers(outliers);
    }
  };

  const plotLayout = {
    title: `Outlier Detection (${method})`,
    xaxis: { title: "Index" },
    yaxis: { title: columns.length > 1 ? "Values (Multi-dimensional)" : "Values" },
    showlegend: true,
    height: 400,
    width: 600,
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9", height: "100vh", display: "flex", alignItems: "center" }}>
      <Box sx={{ maxWidth: "1200px", margin: "auto", display: "flex", gap: 3 }}>
        {/* Controls on the Left */}
        <Box sx={{ flex: "1 1 50%" }}>
          {/* Dropdown */}
          <Card sx={{ boxShadow: 3, marginBottom: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ marginBottom: 2, textAlign: "center", fontWeight: "bold" }}>
                Choose Detection Method
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Select Detection Method</InputLabel>
                <Select
                  value={method}
                  onChange={handleMethodChange}
                  label="Select Detection Method"
                  fullWidth
                  sx={{
                    boxShadow: 1,
                    borderRadius: 2,
                    padding: "8px 12px",
                    backgroundColor: "#ffffff",
                    "& .MuiSelect-icon": { color: "#4A90E2" },
                  }}
                  disabled={loading}
                >
                  <MenuItem value="z-score">Z-Score</MenuItem>
                  <MenuItem value="iqr">IQR</MenuItem>
                  <MenuItem value="isolation-forest">Isolation Forest</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          {/* Summary */}
          {method && !loading && (
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold", textAlign: "center" }}>
                  Outlier Summary
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  Outlier Count: <strong>{outlierCount}</strong>
                </Typography>
                <Typography variant="body1">
                  Outlier Percentage: <strong>{outlierPercentage}%</strong>
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Graph on the Right */}
        <Box sx={{ flex: "1 1 50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {plotData.length > 0 ? (
            <Plot data={plotData} layout={plotLayout} />
          ) : (
            <Typography variant="h6" color="textSecondary">
              No data to display. Select a method to proceed.
            </Typography>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default OutlierDetection;
