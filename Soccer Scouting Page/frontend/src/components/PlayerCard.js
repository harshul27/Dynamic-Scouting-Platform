import React from 'react';

function PlayerCard({ player }) {
  if (!player) return null;

  return (
    <section id="player-profile-section" className="max-w-4xl mx-auto bg-mint-cream p-6 rounded-xl shadow-md mb-8">
      <h3 className="text-2xl font-bold text-oxford-blue mb-4">{player.name}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div><p className="text-sm text-oxford-blue-medium">Position</p><p className="text-xl font-semibold">{player.position || '-'}</p></div>
        <div><p className="text-sm text-oxford-blue-medium">Team</p><p className="text-xl font-semibold">{player.team || '-'}</p></div>
        <div><p className="text-sm text-oxford-blue-medium">Nationality</p><p className="text-xl font-semibold">{player.nationality || '-'}</p></div>
        <div><p className="text-sm text-oxford-blue-medium">Age</p><p className="text-xl font-semibold">{player.age || '-'}</p></div>
      </div>
    </section>
  );
}

export default PlayerCard;