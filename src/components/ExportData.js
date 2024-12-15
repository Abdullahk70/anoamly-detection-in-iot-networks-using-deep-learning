import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExportData = () => {
  // Mock IoT anomaly detection-related data in useState
  const [data] = useState([
    { name: "John", age: 25, temperature: 22.5, humidity: 45, deviceStatus: "Normal" },
    { name: "Jane", age: 28, temperature: 24.1, humidity: 50, deviceStatus: "Normal" },
    { name: "Mike", age: 32, temperature: 30.2, humidity: 40, deviceStatus: "Warning" },
    { name: "Sara", age: 24, temperature: 18.9, humidity: 60, deviceStatus: "Normal" }
  ]);

  const [includeTemperature, setIncludeTemperature] = useState(true);
  const [includeHumidity, setIncludeHumidity] = useState(true);
  const [includeDeviceStatus, setIncludeDeviceStatus] = useState(true);

  // Filtered data
  const filteredData = data.map((item) => {
    let filteredItem = { name: item.name, age: item.age };
    if (includeTemperature) filteredItem.temperature = item.temperature;
    if (includeHumidity) filteredItem.humidity = item.humidity;
    if (includeDeviceStatus) filteredItem.deviceStatus = item.deviceStatus;
    return filteredItem;
  });

  const headers = [
    { label: "Name", key: "name" },
    { label: "Age", key: "age" },
    ...(includeTemperature ? [{ label: "Temperature", key: "temperature" }] : []),
    ...(includeHumidity ? [{ label: "Humidity", key: "humidity" }] : []),
    ...(includeDeviceStatus ? [{ label: "Device Status", key: "deviceStatus" }] : [])
  ];

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

        {/* Feature Selection */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeTemperature"
              checked={includeTemperature}
              onChange={() => setIncludeTemperature(!includeTemperature)}
              className="mr-3 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
            />
            <label htmlFor="includeTemperature" className="text-lg text-gray-800">
              Include Temperature
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeHumidity"
              checked={includeHumidity}
              onChange={() => setIncludeHumidity(!includeHumidity)}
              className="mr-3 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
            />
            <label htmlFor="includeHumidity" className="text-lg text-gray-800">
              Include Humidity
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeDeviceStatus"
              checked={includeDeviceStatus}
              onChange={() => setIncludeDeviceStatus(!includeDeviceStatus)}
              className="mr-3 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
            />
            <label htmlFor="includeDeviceStatus" className="text-lg text-gray-800">
              Include Device Status
            </label>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CSV Export */}
          <CSVLink
            data={filteredData}
            headers={headers}
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

