import React, { useEffect, useRef } from "react";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { chartOptions } from "../../styles";

// Register Chart.js components
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: ChartData<"bar">;
  options?: ChartOptions<"bar">;
}

export const BarChart: React.FC<BarChartProps> = ({ data, options }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Create a new Chart instance with centralized styling options
    const chartInstance = new Chart(ctx, {
      type: "bar",
      data,
      options: {
        ...chartOptions,  // Use the predefined options from styles.ts
        ...options,       // Allow custom options to override defaults
      },
    });

    // Cleanup to prevent duplicate charts
    return () => {
      chartInstance.destroy();
    };
  }, [data, options]);

  return <canvas ref={canvasRef} />;
};
