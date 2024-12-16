import React, { useState } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, Typography, Card, CardContent, Button } from "@mui/material";
import Plot from "react-plotly.js";

const OutlierDetection = () => {
  const [method, setMethod] = useState("");
  const [plotData, setPlotData] = useState([]);
  const [outlierCount, setOutlierCount] = useState(0);
  const [outlierPercentage, setOutlierPercentage] = useState(0);

  const normalData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleMethodChange = (event) => {
    const selectedMethod = event.target.value;
    setMethod(selectedMethod);

    let outliers = [];
    if (selectedMethod === "z-score") {
      outliers = [1, 10];
    } else if (selectedMethod === "iqr") {
      outliers = [1, 9, 10];
    } else if (selectedMethod === "isolation-forest") {
      outliers = [2, 8];
    }

    const count = outliers.length;
    setOutlierCount(count);
    setOutlierPercentage(((count / normalData.length) * 100).toFixed(2));

    setPlotData([
      {
        x: normalData,
        y: normalData,
        mode: "markers",
        marker: { color: "#4caf50", size: 10 },
        type: "scatter",
        name: "Normal Data",
      },
      {
        x: outliers,
        y: outliers,
        mode: "markers",
        marker: { color: "#f44336", size: 12 },
        type: "scatter",
        name: "Outliers",
      },
    ]);
  };

  const plotLayout = {
    title: "Outlier Detection",
    xaxis: { title: "Data Points" },
    yaxis: { title: "Values" },
    showlegend: true,
    height: 400, // Adjusted to slightly smaller
    width: 500,
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
                >
                  <MenuItem value="z-score">Z-Score</MenuItem>
                  <MenuItem value="iqr">IQR</MenuItem>
                  <MenuItem value="isolation-forest">Isolation Forest</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          {/* Apply Changes Button */}
          {method && (
            <Button
              variant="contained"
              fullWidth
              sx={{
                padding: "10px 20px",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "8px",
                backgroundColor: "purple",
                "&:hover": { backgroundColor: "purple", opacity: 0.9 },
                marginBottom: 3,
              }}
            >
              Apply Changes
            </Button>
          )}

          {/* Summary */}
          {method && (
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
          <Plot data={plotData} layout={plotLayout} />
        </Box>
      </Box>
    </div>
  );
};

export default OutlierDetection;
