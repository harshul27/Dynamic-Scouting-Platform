import React, { useState, useEffect } from 'react';
import Uploader from './components/Uploader';
import Dashboard from './components/Dashboard';

function App() {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlayers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/players');
      if (!response.ok) throw new Error('Failed to fetch players.');
      const data = await response.json();
      setPlayers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <div className="bg-mint-cream text-oxford-blue font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-oxford-blue">Soccer Scouting Dashboard</h1>
          <p className="mt-2 text-lg text-oxford-blue-medium">Analyze player performance with interactive charts and AI insights.</p>
        </header>
        <main>
          {isLoading && <p>Loading players...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}

          <Uploader onUploadSuccess={fetchPlayers} />

          {players.length > 0 && <Dashboard players={players} />}

        </main>
      </div>
    </div>
  );
}

export default App;