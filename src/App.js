import css from "./index.css"
import react from "react";
import Sidebar from "./components/sideBar";
import SearchBar from "./components/SearchBar";
import DataProcessingUpdates from "./components/DataProcessingUpdates";
import DataVisualization from "./components/DataVisualization";

function App() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
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
    </div>
  );
}

export default App;
