import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

// This would contain your chart-specific creation logic
// import { createRadarChart, createBarChart, /* ... other chart functions ... */ } from '../utils/chartUtils';

function ChartComponent({ chartConfig, onRemove }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      // In a real app, you would fetch data and pass it to the chart creation function.
      // For this example, we'll just create a placeholder chart.
      const newChart = new Chart(ctx, {
        type: chartConfig.type,
        data: {
          labels: ['Metric 1', 'Metric 2', 'Metric 3'],
          datasets: [{
            label: 'Player Data',
            data: [10, 20, 30],
            backgroundColor: 'rgba(237, 37, 78, 0.8)',
          }],
        },
      });
      chartInstanceRef.current = newChart;
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartConfig]);

  return (
    <div className="bg-mint-cream p-6 rounded-xl shadow-md mb-8 border border-oxford-blue-light">
      <h3 className="text-xl font-bold text-oxford-blue mb-2">Placeholder Chart</h3>
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
      <button onClick={onRemove} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full text-sm">
        Remove Chart
      </button>
    </div>
  );
}

export default ChartComponent;