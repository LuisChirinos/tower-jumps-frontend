"use client";

import { useState } from "react";

// Define the props for the FilterForm component
type FormularioProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (params: any) => void; // Callback for form submission
  isLoading: boolean; // Indicates if the form is currently processing
};

export default function FilterForm({ onSubmit, isLoading }: FormularioProps) {
  // State to store the uploaded file
  const [file, setFile] = useState<File | null>(null);

  // State to toggle custom weights
  const [enableWeights, setEnableWeights] = useState(false);

  // State to store the individual weights
  const [weights, setWeights] = useState({
    voice: 33.33,
    sms: 33.33,
    data: 33.33,
  });

  // Tracks which weight is currently locked to prevent changes to others
  const [lockedKey, setLockedKey] = useState<string | null>(null);

  // State for time gap (in hours by default)
  const [timeGap, setTimeGap] = useState(1);

  // State to toggle date filter
  const [enableDateFilter, setEnableDateFilter] = useState(false);

  // Start and end date values for the date filter
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Updates weights and distributes the remaining percentages among the other keys
  const handleWeightChange = (key: string, value: number) => {
    setLockedKey(key);
    const remaining = 100 - value;
    const otherKeys = Object.keys(weights).filter((k) => k !== key);
    const distributedWeight = remaining / otherKeys.length;

    setWeights((prevWeights) => ({
      ...prevWeights,
      [key]: value,
      ...Object.fromEntries(otherKeys.map((k) => [k, distributedWeight])),
    }));
  };

  // Unlocks all weights for editing
  const unlockWeights = () => {
    setLockedKey(null);
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If no file is uploaded, alert the user
    if (!file) {
      alert("Please upload a CSV file.");
      return;
    }

    // Convert the uploaded file into text
    const fileContent = await file.text();

    // Prepare the parameters to send to the backend
    const params = {
      file: fileContent,
      weights: enableWeights ? weights : { voice: 1, sms: 1, data: 1 },
      timeGap: timeGap * 60, // Convert hours to minutes
      dateFilter: enableDateFilter ? { startDate, endDate } : undefined,
    };

    // Invoke the parent callback
    onSubmit(params);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* CSV file uploader */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload CSV:
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {/* Checkbox to enable/disable custom weights */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="enableWeights"
          checked={enableWeights}
          onChange={(e) => {
            setEnableWeights(e.target.checked);
            unlockWeights();
          }}
          className="mr-2"
        />
        <label
          htmlFor="enableWeights"
          className="text-sm font-medium text-gray-700"
        >
          Enable custom weights
        </label>
      </div>

      {/* Weight inputs (voice, sms, data) */}
      {enableWeights && (
        <>
          {["voice", "sms", "data"].map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700">
                Weight for {key.charAt(0).toUpperCase() + key.slice(1)}:
              </label>
              <input
                type="number"
                value={weights[key as keyof typeof weights]}
                min={0}
                max={100}
                disabled={lockedKey !== null && lockedKey !== key}
                onChange={(e) =>
                  handleWeightChange(key, parseFloat(e.target.value))
                }
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                  lockedKey === null || lockedKey === key
                    ? "focus:ring-indigo-500 focus:border-indigo-500"
                    : "bg-gray-100 cursor-not-allowed"
                } sm:text-sm`}
              />
            </div>
          ))}
        </>
      )}

      {/* Checkbox to enable/disable date filtering */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="enableDateFilter"
          checked={enableDateFilter}
          onChange={(e) => setEnableDateFilter(e.target.checked)}
          className="mr-2"
        />
        <label
          htmlFor="enableDateFilter"
          className="text-sm font-medium text-gray-700"
        >
          Enable date filter
        </label>
      </div>

      {/* Date inputs for start and end date */}
      {enableDateFilter && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date:
            </label>
            <input
              type="date"
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date:
            </label>
            <input
              type="date"
              value={endDate || ""}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </>
      )}

      {/* Time gap selector (in hours) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Time Gap (hours):
        </label>
        <select
          value={timeGap}
          onChange={(e) => setTimeGap(parseInt(e.target.value))}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {Array.from({ length: 9 }, (_, i) => i + 1).map((hour) => (
            <option key={hour} value={hour}>
              {hour} hour{hour > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-md ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
        }`}
      >
        {isLoading ? "Processing..." : "Process"}
      </button>
    </form>
  );
}
