import React, { useEffect, useState } from "react";
import axios from "axios";

const CsvDisplay = () => {
  const [csvData, setCsvData] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Number of rows per page

  // Function to fetch CSV data from the backend
  const fetchCsvData = async () => {
    try {
      // Make the request to the backend API
      const response = await axios.get("http://localhost:5000/ml/retrieve");

      // Set the data if the request is successful
      setCsvData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching CSV data:", err);
      setError("Failed to fetch CSV data.");
    }
  };

  // Paginate the rows to display only a subset per page
  const paginateData = () => {
    const offset = (currentPage - 1) * pageSize;
    return csvData.slice(offset, offset + pageSize);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchCsvData();
  }, []);

  const totalPages = Math.ceil(csvData?.length / pageSize);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-extrabold text-center text-green-700 mb-8">
        CSV Data Viewer
      </h1>
      {error && (
        <p className="text-red-500 text-center font-medium text-lg">{error}</p>
      )}

      {!error && csvData && (
        <>
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg mb-8">
            <table className="min-w-full table-auto border-separate border-spacing-2">
              <thead className="bg-purple-600 rounded-lg text-white">
                <tr>
                  {Object.keys(csvData[0] || {}).map((key) => (
                    <th
                      key={key}
                      className="px-6 py-4 text-lg rounded-lg font-semibold text-left"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {paginateData().map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-green-50 transition duration-300"
                  >
                    {Object.values(row).map((value, index) => (
                      <td
                        key={index}
                        className="px-6 py-4 text-sm font-medium text-left"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 transition duration-300"
            >
              Previous
            </button>
            <span className="font-medium text-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 transition duration-300"
            >
              Next
            </button>
          </div>

          {/* Download Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(csvData)], { type: "application/json" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "last_uploaded_data.json";
                link.click();
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-full text-lg font-semibold hover:bg-purple-700 transition duration-300"
            >
              Download Data as JSON
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CsvDisplay;
