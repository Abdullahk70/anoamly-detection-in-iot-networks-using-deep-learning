import React from 'react'
import SearchBar from './SearchBar'
import DataProcessingUpdates from "./DataProcessingUpdates"
import DataVisualization from "./DataVisualization"
import css from "../index.css"
const Home = () => {
  return (
    <div className="flex-1 px-6 py-3 bg-gray-100 min-h-screen">
    {/* Search Bar */}
    <SearchBar/>

    {/* Content Sections */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-6">
      {/* Left Section: Data Processing Updates */}
      <DataProcessingUpdates />

      {/* Right Section: Data Visualization */}
      <DataVisualization />
    </div>
  </div>
  )
}

export default Home
