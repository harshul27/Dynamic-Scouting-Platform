import React, { useState } from 'react';

function MetricsTable({ analytics }) {
  const [goodThreshold, setGoodThreshold] = useState(75);
  const [poorThreshold, setPoorThreshold] = useState(25);

  const getRowClass = (percentile) => {
    if (percentile >= goodThreshold) {
      return 'bg-green-50';
    } else if (percentile <= poorThreshold) {
      return 'bg-red-50';
    }
    return '';
  };

  const formattedAnalytics = Object.keys(analytics).map(metric => ({
    metric,
    ...analytics[metric],
  }));

  if (formattedAnalytics.length === 0) {
    return <p className="text-center text-oxford-blue-medium mt-4">No metrics to display.</p>;
  }

  return (
    <section id="detailed-metrics-section" className="bg-mint-cream p-6 rounded-xl shadow-md mb-8">
      <h3 className="text-xl font-bold text-oxford-blue mb-3">Detailed Metric Breakdown</h3>
      {/* Conditional Formatting Controls (You'd need to add these inputs and a button here) */}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-oxford-blue-light">
          <thead>
            <tr className="bg-mint-cream">
              <th className="px-6 py-3 text-left text-xs font-medium text-oxford-blue-medium uppercase tracking-wider">Metric</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-oxford-blue-medium uppercase tracking-wider">Player Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-oxford-blue-medium uppercase tracking-wider">Group Average</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-oxford-blue-medium uppercase tracking-wider">Percentile Rank</th>
            </tr>
          </thead>
          <tbody className="bg-mint-cream divide-y divide-oxford-blue-light">
            {formattedAnalytics.map((item) => (
              <tr key={item.metric} className={getRowClass(item.percentile)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-oxford-blue">{item.metric.replace(/_/g, ' ')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-oxford-blue-medium">{item.playerValue.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-oxford-blue-medium">{item.average.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-oxford-blue-medium">
                  <div className="flex items-center">
                    <div className="w-20 bg-oxford-blue-light rounded-full h-2.5">
                      <div className="bg-hot-pink h-2.5 rounded-full" style={{ width: `${item.percentile.toFixed(0)}%` }}></div>
                    </div>
                    <span className="ml-3 font-medium">{item.percentile.toFixed(0)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default MetricsTable;