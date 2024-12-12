import React from 'react';

const DataVisualization = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-xl mx-auto">
      <h2 className="font-bold text-xl text-gray-800 mb-3">Data Visualization</h2>
      <div className="space-y-3">
        {/* Other rows */}
        <div className="flex justify-between text-sm">
          <span className="w-1/2">Data engineer</span>
          <button className="bg-purple-600 text-white px-3 py-1 rounded-lg text-xs w-1/2">Me</button>
        </div>
        <div className="flex justify-between text-sm">
          <span className="w-1/2">Data splitting</span>
          <button className="bg-purple-600 text-white px-3 py-1 rounded-lg text-xs w-1/2">Today</button>
        </div>
        <div className="flex justify-between text-sm">
          <span className="w-1/2">Data projects</span>
          <button className="bg-purple-600 text-white px-3 py-1 rounded-lg text-xs w-1/2">New project</button>
        </div>
        <div className="flex justify-between text-sm">
          <span className="w-1/2">Data priority</span>
          <button className="bg-purple-600 text-white px-3 py-1 rounded-lg text-xs w-1/2">High</button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {/* Heading for Data Attachments */}
        <h3 className="font-bold text-md text-gray-700 mb-2">Data Attachments</h3>

        {/* Data attachments section with a purple icon and capsule */}
        <div className="flex items-center justify-between bg-white p-3 rounded-full border border-gray-300">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-7 h-7 bg-purple-600 text-white rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" className="text-white">
                <path d="M13 5h-2v10h2V5zm-7 7h2v3H6v-3zm6 0h2v3h-2v-3z" />
              </svg>
            </div>
            <span className="text-sm text-gray-700">No data attachments</span>
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-full text-xs">Attach</button>
        </div>

        {/* Heading for Data Links */}
        <h3 className="font-bold text-md text-gray-700 mb-2">Data Links</h3>

        {/* Data links section with a purple icon and capsule */}
        <div className="flex items-center justify-between bg-white p-3 rounded-full border border-gray-300">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-7 h-7 bg-purple-600 text-white rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" className="text-white">
                <path d="M16 4h-3V2h5v5h-2V4zm-4 12h2v3h-5v-5h3v2h-2zm-7-3V9h5v5h-3v-2h2z" />
              </svg>
            </div>
            <span className="text-sm text-gray-700">No data links</span>
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-full text-xs">Add</button>
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-4">
        {/* Buttons for Export and Delete Data */}
        <button className="bg-purple-600 text-white px-4 py-2 rounded-full text-xs">Export data</button>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-full text-xs">Delete data</button>
      </div>
    </div>
  );
};

export default DataVisualization;
