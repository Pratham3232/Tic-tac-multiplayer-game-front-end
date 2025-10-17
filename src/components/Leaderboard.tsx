import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import type { User } from '../types';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
    
    // Refresh leaderboard every 10 seconds
    const interval = setInterval(loadLeaderboard, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const loadLeaderboard = async () => {
    try {
      const topPlayers = await usersAPI.getLeaderboard(5);
      setLeaders(topPlayers);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold mb-4">🏆 Top Players</h3>
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        🏆 Top Players
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">LIVE</span>
      </h3>
      
      {leaders.length === 0 ? (
        <p className="text-gray-500 text-sm">No players yet</p>
      ) : (
        <div className="space-y-2">
          {leaders.map((player, index) => (
            <div
              key={player.id || player._id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                index === 0 ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400' :
                index === 1 ? 'bg-gray-100 dark:bg-gray-700' :
                index === 2 ? 'bg-orange-50 dark:bg-orange-900/20' :
                'bg-gray-50 dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`text-2xl font-bold ${
                  index === 0 ? 'text-yellow-600' :
                  index === 1 ? 'text-gray-500' :
                  index === 2 ? 'text-orange-600' :
                  'text-gray-400'
                }`}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div>
                  <div className="font-semibold">{player.username}</div>
                  <div className="text-xs text-gray-500">
                    {player.gamesWon || 0}W - {player.gamesLost || 0}L - {player.gamesDrawn || 0}D
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {player.rating || 1200}
                </div>
                <div className="text-xs text-gray-500">rating</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
