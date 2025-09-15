import React, { useState, useEffect, useCallback } from 'react';
import PlayerCard from './PlayerCard';
import ChartComponent from './ChartComponent';
import MetricsTable from './MetricsTable';
import PlayerComparison from './PlayerComparison';

const API_BASE_URL = 'http://localhost:5000/api';

function Dashboard({ players }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [peerGroupFilters, setPeerGroupFilters] = useState({ min_age: 15, max_age: 45, min_minutes: 0 });
  const [metricsAnalysis, setMetricsAnalysis] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeCharts, setActiveCharts] = useState([]);
  const [aiReport, setAiReport] = useState('');

  const handlePlayerSelect = useCallback(async (event) => {
    const playerName = event.target.value;
    const player = players.find(p => p.player_name === playerName);
    if (!player) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/analyze/${player.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters: peerGroupFilters }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setSelectedPlayer(data.player_profile);
      setMetricsAnalysis(data.metrics_analysis);

    } catch (error) {
      console.error("Failed to fetch player analysis:", error);
      // Display user-friendly error
    } finally {
      setLoading(false);
    }
  }, [players, peerGroupFilters]);

  const handleApplyFilters = () => {
    // This re-triggers the player analysis based on the new filters
    if (selectedPlayer) {
      const player = players.find(p => p.player_name === selectedPlayer.name);
      if (player) handlePlayerSelect({ target: { value: player.player_name } });
    }
  };

  const handleGenerateAiReport = async () => {
    if (!selectedPlayer) return;
    setLoading(true);
    setAiReport('Generating report...');
    try {
      const player = players.find(p => p.player_name === selectedPlayer.name);
      if (!player) throw new Error('Player not found in local state.');
      
      const response = await fetch(`${API_BASE_URL}/ai-report/${player.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setAiReport(data.report);
    } catch (error) {
      console.error("AI Report generation failed:", error);
      setAiReport(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addChart = (chartConfig) => {
    setActiveCharts(prev => [...prev, chartConfig]);
  };

  const removeChart = (chartId) => {
    setActiveCharts(prev => prev.filter(c => c.id !== chartId));
  };
  
  return (
    <div>
      {loading && <div className="loading-overlay">Loading...</div>}
      
      {/* Player Selection and Filters */}
      <section className="max-w-4xl mx-auto bg-mint-cream p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-bold text-oxford-blue mb-4">Data Input & Player Selection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label htmlFor="player-select" className="block text-sm font-medium text-oxford-blue-medium mb-2">2. Select a Player</label>
            <select
              id="player-select"
              onChange={handlePlayerSelect}
              className="block w-full p-2 border border-oxford-blue-light rounded-md shadow-sm focus:ring-hot-pink focus:border-hot-pink"
            >
              <option value="">Select a player</option>
              {players.map(p => (
                <option key={p.id} value={p.player_name}>
                  {p.player_name} ({p.team})
                </option>
              ))}
            </select>
          </div>
          {/* Peer Group Filters Section */}
          <div className="mt-6 p-4 bg-mint-cream-dark rounded-lg col-span-2">
            <h4 className="text-md font-semibold text-oxford-blue mb-3">Peer Group Filters</h4>
            {/* Input fields for filters, connected to state */}
            <button onClick={handleApplyFilters} className="mt-4 bg-hot-pink hover:bg-hot-pink-dark text-mint-cream font-bold py-2 px-4 rounded-full">
              Apply Filters
            </button>
          </div>
        </div>
      </section>

      {selectedPlayer && (
        <div id="dashboard-content">
          <PlayerCard player={selectedPlayer} />

          {/* Chart Customization Section */}
          <section className="max-w-4xl mx-auto bg-mint-cream p-6 rounded-xl shadow-md mb-8">
            <h3 className="text-xl font-bold text-oxford-blue mb-3">Customize Charts</h3>
            {/* Logic for chart selection and metric inputs */}
            <button onClick={() => addChart({ id: Date.now(), type: 'radar' /* etc. */ })} className="bg-hot-pink">Add Chart</button>
          </section>

          {/* Active Charts Display Area */}
          <section id="selected-visualizations-section">
            <h3 className="text-xl font-bold text-oxford-blue mb-3">Selected Visualizations</h3>
            {activeCharts.map(chart => (
              <ChartComponent key={chart.id} chartConfig={chart} onRemove={() => removeChart(chart.id)} />
            ))}
          </section>

          <MetricsTable analytics={metricsAnalysis} />
          <PlayerComparison players={players} />
          
          {/* AI Insight Section */}
          <section className="max-w-4xl mx-auto bg-mint-cream p-6 rounded-xl shadow-md mb-8">
            <h3 className="text-xl font-bold text-oxford-blue mb-3">AI-Powered Scouting Insight</h3>
            <button onClick={handleGenerateAiReport} className="bg-hot-pink">Generate Report</button>
            {aiReport && <p className="mt-4 p-4 bg-mint-cream-dark">{aiReport}</p>}
          </section>
        </div>
      )}
    </div>
  );
}

export default Dashboard;