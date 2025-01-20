"use client";

import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

// Register Chart.js components
ChartJS.register(TimeScale, LinearScale, PointElement, Title, Tooltip, Legend);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Graph = ({ results }: { results: any[] }) => {
  // If no results are provided or the array is empty, show a message
  if (!results || results.length === 0) {
    return <p className="text-gray-500">No data available to display.</p>;
  }

  // Prepare the chart data
  const data = {
    datasets: results.map((entry) => {
      // Determine if the current entry is for New York
      const isNewYork = entry.state === "New York";
      // Choose color depending on the state
      const color = isNewYork ? "rgba(255, 0, 0" : "rgba(0, 0, 255";

      return {
        label: entry.state,
        data: [
          {
            x: new Date(entry.start_time), // Convert string to Date (start time)
            y: entry.confidence, // Confidence value on the Y-axis
            confidence: entry.confidence,
            count_rows: entry.count_rows,
            count_recovered: entry.count_recovered,
            count_interpolated: entry.count_interpolated,
          },
        ],
        backgroundColor: `${color}, ${entry.confidence / 100})`, // Transparency based on confidence
        borderColor: color,
        pointRadius: 1,
      };
    }),
  };

  // Configure the chart options
  const options: ChartOptions<"scatter"> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          generateLabels: () => [
            { text: "New York", fillStyle: "rgba(255, 0, 0, 0.8)" },
            { text: "Connecticut", fillStyle: "rgba(0, 0, 255, 0.8)" },
          ],
        },
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (context: any) => {
            const {
              confidence,
              count_rows,
              count_recovered,
              count_interpolated,
            } = context.raw;
            return [
              `Confidence: ${confidence}%`,
              `Rows: ${count_rows}`,
              `Recovered: ${count_recovered}`,
              `Interpolated: ${count_interpolated}`,
            ];
          },
        },
      },
      title: {
        display: true,
        text: "State Analysis Over Time",
      },
    },
    scales: {
      x: {
        type: "time",
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "Confidence (%)",
        },
      },
    },
  };
  // Render the scatter chart
  return <Scatter data={data} options={options} />;
};

export default Graph;
