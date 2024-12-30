import React from 'react';
import { Link } from 'react-router-dom';
const SearchBar = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-lg shadow-lg p-4 space-y-4 md:space-y-0">
      {/* Search Input */}
      <div className="flex items-center rounded-full bg-white border border-gray-400 px-4 py-2 shadow-md max-w-md w-full">
        <input
          type="text"
          placeholder="Search for datasets"
          className="flex-grow bg-transparent outline-none text-gray-600"
        />
      </div>

      {/* Upload Button */}
      <Link to="/upload">
      <button className="px-6 py-2 bg-purple-600 text-white rounded-full flex items-center space-x-2 shadow-md hover:shadow-lg transition-shadow border border-gray-400">
        <span>Upload</span>
        <i className="fas fa-cloud-upload-alt"></i>
      </button>
      </Link>
    </div>
  );
};

export default SearchBar;

