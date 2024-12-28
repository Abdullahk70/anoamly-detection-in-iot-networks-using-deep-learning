import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExportData = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [includeColumns, setIncludeColumns] = useState({});
  
  // Fetch the dataset from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/ml/export');
        const result = await response.json();
        
        if (response.ok) {
          setHeaders(result.headers);
          setData(result.dataset);

          // Initialize includeColumns state to include all columns by default
          const initialColumns = result.headers.reduce((acc, header) => {
            acc[header] = true;
            return acc;
          }, {});
          setIncludeColumns(initialColumns);
        } else {
          toast.error('Failed to fetch dataset');
        }
      } catch (error) {
        console.error('Error fetching dataset:', error);
        toast.error('Error fetching dataset');
      }
    };

    fetchData();
  }, []);

  // Filter the data based on selected columns
  const filteredData = data.map((item) => {
    let filteredItem = {};
    headers.forEach(header => {
      if (includeColumns[header]) {
        filteredItem[header] = item[header];
      }
    });
    return filteredItem;
  });

  // Export Functions
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filteredData, null, 2)], {
      type: 'application/json'
    });
    saveAs(blob, 'exported_data.json');
    toast.success('Exported as JSON successfully!');
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'exported_data.xlsx');
    toast.success('Exported as Excel successfully!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-gray-50 p-6">
      <div className="max-w-3xl w-full bg-white shadow-2xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Export Your Data
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Choose the features you want to include and export your data in your preferred format.
        </p>

        {/* Feature Selection (dynamic columns) */}
        <div className="space-y-4 mb-8">
          {headers.map((header) => (
            <div key={header} className="flex items-center">
              <input
                type="checkbox"
                id={`include_${header}`}
                checked={includeColumns[header]}
                onChange={() =>
                  setIncludeColumns((prev) => ({
                    ...prev,
                    [header]: !prev[header],
                  }))
                }
                className="mr-3 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
              />
              <label htmlFor={`include_${header}`} className="text-lg text-gray-800">
                Include {header}
              </label>
            </div>
          ))}
        </div>

        {/* Export Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CSV Export */}
          <CSVLink
            data={filteredData}
            headers={headers.map((header) => ({ label: header, key: header }))}
            filename="exported_data.csv"
            className="text-center bg-green-500 text-white py-2 px-4 rounded-lg text-lg font-medium hover:bg-green-600 transition duration-300 ease-in-out"
            target="_blank"
          >
            Export as CSV
          </CSVLink>

          {/* JSON Export */}
          <button
            onClick={exportJSON}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg text-lg font-medium hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            Export as JSON
          </button>

          {/* Excel Export */}
          <button
            onClick={exportExcel}
            className="bg-yellow-500 text-white py-2 px-4 rounded-lg text-lg font-medium hover:bg-yellow-600 transition duration-300 ease-in-out"
          >
            Export as Excel
          </button>
        </div>

        {/* Notification for Export Success */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default ExportData;
