"use client";

import { useState } from "react";
import FilterForm from "../components/filterForm";
import GraphModal from "../components/graphModal"; // Import the GraphModal component

export default function Home() {
  const [isLoading, setIsLoading] = useState(false); // Loading state for the form submission
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any>(null); // Results from the server
  const [error, setError] = useState<string | null>(null); // Error state for API responses

  /**
   * Handles form submission, sends data to the API, and manages loading and error states.
   * @param params - The parameters from the form submission
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = async (params: any) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Send a POST request to the API
      const res = await fetch("/api/process-csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      // Parse the response data
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError((err as Error).message); // Set the error message
    } finally {
      setIsLoading(false); // Stop the loading spinner
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Process CSV</h1>

        {/* Filter Form */}
        <FilterForm onSubmit={handleFormSubmit} isLoading={isLoading} />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Graph Modal */}
        {Array.isArray(results?.data) && results.data.length > 0 && (
          <div className="mt-4">
            <GraphModal results={results.data} />
          </div>
        )}
      </div>
    </div>
  );
}
