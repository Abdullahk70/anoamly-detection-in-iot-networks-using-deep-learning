import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Range, getTrackBackground } from "react-range";

const NormalizationScaling = () => {
  const [openSection, setOpenSection] = useState(null);
  const [minMaxRange, setMinMaxRange] = useState([0, 1]);
  const [beforeAfterData, setBeforeAfterData] = useState({
    before: [10, 20, 30, 40, 50],
    after: [],
  });

  const handleApplyNormalization = (method) => {
    let newData = [];
    if (method === "Min-Max Scaling") {
      const [min, max] = minMaxRange;
      newData = beforeAfterData.before.map(
        (val) =>
          ((val - Math.min(...beforeAfterData.before)) /
            (Math.max(...beforeAfterData.before) - Math.min(...beforeAfterData.before))) *
            (max - min) +
          min
      );
    } else if (method === "Z-Score Scaling") {
      const mean =
        beforeAfterData.before.reduce((a, b) => a + b, 0) / beforeAfterData.before.length;
      const std = Math.sqrt(
        beforeAfterData.before.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
          beforeAfterData.before.length
      );
      newData = beforeAfterData.before.map((val) => ((val - mean) / std).toFixed(2));
    }
    setBeforeAfterData({ ...beforeAfterData, after: newData });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto px-4 py-8 bg-white rounded-lg shadow-md">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-800">
          Normalization/Scaling
        </h1>

        {/* Accordion Sections */}
        <div className="space-y-4">
          {/* Min-Max Scaling Section */}
          <div className="border border-gray-300 rounded-lg">
            <button
              onClick={() => setOpenSection(openSection === "minmax" ? null : "minmax")}
              className="w-full px-4 py-3 flex justify-between items-center text-lg font-semibold bg-gray-100 hover:bg-green-100 transition-all"
            >
              Min-Max Scaling
              {openSection === "minmax" ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openSection === "minmax" && (
              <div className="p-4 transition-all">
                <p className="text-gray-600 mb-4">
                  Rescale data to a specific range (default: 0 to 1).
                </p>

                {/* Slider */}
                <div className="mb-4">
                  <p className="mb-2 text-sm text-gray-500">Select Range</p>
                  <Range
                    step={0.1}
                    min={0}
                    max={10}
                    values={minMaxRange}
                    onChange={(values) => setMinMaxRange(values)}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        className="h-2 bg-gray-200 rounded-lg"
                        style={{
                          ...props.style,
                          background: getTrackBackground({
                            values: minMaxRange,
                            colors: ["#10B981", "#E5E7EB"],
                            min: 0,
                            max: 10,
                          }),
                        }}
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        className="h-4 w-4 bg-green-500 rounded-full shadow-md hover:scale-110 transform transition-all"
                      />
                    )}
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Min: {minMaxRange[0]}</span>
                    <span>Max: {minMaxRange[1]}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleApplyNormalization("Min-Max Scaling")}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-green-600 transition-all"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Z-Score Scaling Section */}
          <div className="border border-gray-300 rounded-lg">
            <button
              onClick={() => setOpenSection(openSection === "zscore" ? null : "zscore")}
              className="w-full px-4 py-3 flex justify-between items-center text-lg font-semibold bg-gray-100 hover:bg-green-100 transition-all"
            >
              Z-Score Scaling
              {openSection === "zscore" ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openSection === "zscore" && (
              <div className="p-4 transition-all">
                <p className="text-gray-600 mb-4">
                  Standardize data by centering around the mean and scaling by standard deviation.
                </p>
                <button
                  onClick={() => handleApplyNormalization("Z-Score Scaling")}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-600 transition-all"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Before/After Visualization */}
        {beforeAfterData.after.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
              Before and After Scaling
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-2 text-gray-800">Before</h3>
                <pre className="text-gray-600">{JSON.stringify(beforeAfterData.before, null, 2)}</pre>
              </div>
              <div className="p-4 bg-green-50 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-2 text-gray-800">After</h3>
                <pre className="text-green-700">{JSON.stringify(beforeAfterData.after, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NormalizationScaling;
