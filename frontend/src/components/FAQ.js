import React, { useState } from "react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is feature engineering, and why is it essential?",
      answer:
        "Feature engineering is the process of transforming raw data into meaningful features to better represent the underlying problem to predictive models. It’s a critical step as it can significantly enhance model performance and accuracy.",
    },
    {
      question: "What normalization techniques does the app support?",
      answer:
        "The app currently supports Z-scaling, a method that standardizes data by subtracting the mean and dividing by the standard deviation. This normalization ensures consistent scaling, which is essential for algorithms sensitive to feature magnitudes.",
    },
    {
      question: "What methods are available for outlier detection?",
      answer:
        "Our app includes three outlier detection techniques:\n\n1. Z-Score Analysis\n\n2. Interquartile Range (IQR)\n\n3. Isolation Forest",
    },
    {
      question: "How does the app handle data visualization?",
      answer:
        "The app offers interactive line and scatter plots. These visualizations allow users to explore data trends, identify clusters, and detect anomalies in a visually intuitive way.",
    },
    {
      question: "What is label encoding, and how does it work?",
      answer:
        "Label encoding is a technique to convert categorical labels into numeric values. It assigns a unique integer to each category, enabling seamless integration into machine learning models.",
    },
    {
      question: "Can I export the processed data?",
      answer:
        "Yes, once your data has been processed, you can export it in CSV or Excel format. This ensures compatibility with various downstream applications and machine learning pipelines.",
    },
    {
      question: "Is the app optimized for large datasets?",
      answer:
        "Absolutely. The app uses efficient algorithms and asynchronous operations to handle large datasets, ensuring smooth performance even with millions of rows.",
    },
    {
      question: "Does the app support real-time data processing?",
      answer:
        "Currently, the app is designed for batch processing. However, near-real-time data handling can be achieved with periodic updates, and real-time capabilities are on our development roadmap.",
    },
  
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="py-16 px-6 sm:px-12 lg:px-20 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 text-center">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-lg text-gray-600 text-center">
          Get insights into the capabilities and features of our feature engineering app.
        </p>
        <div className="mt-12 space-y-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`transition-all duration-300 transform ${
                activeIndex === index
                  ? "border border-gray-300 bg-gray-50 shadow-lg scale-105"
                  : "border border-gray-200 bg-white shadow-sm"
              } rounded-lg`}
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none hover:bg-gray-50"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-medium text-gray-800">
                  {faq.question}
                </span>
                <svg
                  className={`h-6 w-6 text-gray-500 transition-transform transform ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {activeIndex === index && (
                <div className="px-6 pb-6 text-gray-700">
                  <p className="whitespace-pre-line">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
