"use client";

import React, { useState } from "react";
import Graph from "./graph"; // Import the Graph component

type GraphModalProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  results: any[]; // The results to be displayed in the graph
};

export default function GraphModal({ results }: GraphModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  /**
   * Toggles the visibility of the modal.
   */
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      {/* Button to open the modal */}
      <button
        onClick={toggleModal}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        View Graph
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-3xl w-full">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Graph View</h2>
              <button
                onClick={toggleModal}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                &times; {/* Close Button */}
              </button>
            </div>

            {/* Graph Component */}
            <div className="max-h-[500px] overflow-auto">
              <Graph results={results} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
