import React from "react";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import UploadIcon from "@mui/icons-material/CloudUpload";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import TuneIcon from "@mui/icons-material/Tune";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PlaceIcon from "@mui/icons-material/Place";
import SyncIcon from "@mui/icons-material/Sync";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const Sidebar = () => {
  const location = useLocation();  // Get the current location (route)

  const menuItems = [
    { icon: <HomeIcon fontSize="small" />, label: "Home", link: "/" },
    { icon: <UploadIcon fontSize="small" />, label: "Data Upload", link: "/upload" },
    { icon: <TuneIcon fontSize="small" />, label: "Normalization/Sc", link: "/normalization" },
    { icon: <PlaceIcon fontSize="small" />, label: "Feature Selection", link: "/feature-selection" },
    { icon: <SyncIcon fontSize="small" />, label: "Encoding", link: "/encoding" },
  ];

  const transformationItems = [
    { icon: <VisibilityIcon fontSize="small" />, label: "Outlier Detection", link: "/outlier-detection" },
    { icon: <VisibilityIcon fontSize="small" />, label: "Visualization", link: "/visualization" },
    { icon: <SyncIcon fontSize="small" />, label: "Data Splitting", link: "/data-splitting" },
    { icon: <FileDownloadIcon fontSize="small" />, label: "Export Data", link: "/export-data" },
    { icon: <FileDownloadIcon fontSize="small" />, label: "Display Csv", link: "/csv-display" },
  ];

  return (
    <div className="h-screen w-56 bg-gray-200 shadow-lg flex flex-col justify-between sticky top-0">
      {/* Top Section */}
      <div>
        <h1 className="text-xl font-extrabold px-3 py-2 text-center mt-3 mb-2 text-sm">FeatureENGR</h1>

        {/* Main Menu */}
        <div>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`flex items-center gap-2 px-2 py-1 w-full text-left text-xs ${
                location.pathname === item.link
                  ? "bg-white shadow-md rounded-full transition-all duration-300 ease-in-out"
                  : "hover:bg-gray-200"
              }`}
            >
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full ${
                  location.pathname === item.link ? "bg-gray-300" : "bg-white"
                }`}
              >
                <span className="text-gray-700">{item.icon}</span>
              </div>
              <span
                className={`${
                  location.pathname === item.link ? "font-bold" : "text-gray-600"
                } text-xs`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Divider Line before Transformation */}
        <div className="border-t border-gray-300 mx-3 my-2" />

        {/* Transformation Section */}
        <h2 className="px-3 mt-3 text-gray-600 text-xs uppercase tracking-wide">
          Transformation
        </h2>
        <div>
          {transformationItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`flex items-center gap-2 px-2 py-1 w-full text-left text-xs ${
                location.pathname === item.link
                  ? "bg-white shadow-md rounded-full transition-all duration-300 ease-in-out"
                  : "hover:bg-gray-200"
              }`}
            >
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full ${
                  location.pathname === item.link ? "bg-gray-300" : "bg-white"
                }`}
              >
                <span className="text-gray-700">{item.icon}</span>
              </div>
              <span
                className={`${
                  location.pathname === item.link ? "font-bold" : "text-gray-600"
                } text-xs`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Section - User Info */}
      <div className="px-3 py-2 mt-2">
        <div className="flex items-center gap-2 bg-white p-2 rounded-full shadow-md">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-gray-800 text-xs font-medium">M Abdullah</p>
            <p className="text-gray-600 text-xs">abdullah@gmail.com</p>
          </div>
        </div>

        <div className="border-t border-gray-300 mx-3 mt-3" />

        <div className="mt-2">
          <button
            onClick={() => alert("Settings Clicked")}
            className="flex items-center gap-2 px-2 py-1 w-full text-left text-xs hover:bg-gray-200"
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white">
              <SettingsIcon className="text-gray-700" />
            </div>
            <span className="text-gray-600 text-xs">Settings</span>
          </button>
          <button
            onClick={() => alert("Logout Clicked")}
            className="flex items-center gap-2 px-2 py-1 w-full text-left text-xs hover:bg-gray-200"
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white">
              <LogoutIcon className="text-gray-700" />
            </div>
            <span className="text-gray-600 text-xs">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
