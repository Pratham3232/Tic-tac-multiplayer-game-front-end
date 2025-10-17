import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gamesAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import type { Game, User } from '../types';

export default function GameLobbyPage() {
  const [activeGames, setActiveGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [timeControl, setTimeControl] = useState({ minutes: 10, increment: 0 });
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    loadActiveGames();
  }, []);

  const loadActiveGames = async () => {
    try {
      const games = await gamesAPI.getActiveGames();
      setActiveGames(games);
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGame = async () => {
    setCreating(true);
    try {
      const game = await gamesAPI.createGame({
        timeControlMinutes: timeControl.minutes,
        timeIncrementSeconds: timeControl.increment,
      });
      const gameId = game.id || game._id;
      if (!gameId) {
        throw new Error('Game ID not found in response');
      }
      console.log('Created game with ID:', gameId);
      navigate(`/games/${gameId}`);
    } catch (error: any) {
      console.error('Failed to create game:', error);
      alert(error.response?.data?.message || error.message || 'Failed to create game');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinGame = async (gameId: string) => {
    try {
      console.log('Joining game with ID:', gameId);
      await gamesAPI.joinGame(gameId);
      navigate(`/games/${gameId}`);
    } catch (error: any) {
      console.error('Failed to join game:', error);
      alert(error.response?.data?.message || error.message || 'Failed to join game');
    }
  };

  const getUsername = (player: User | string | undefined): string => {
    if (!player) return 'Waiting...';
    return typeof player === 'string' ? 'Player' : player.username;
  };

  const getRating = (player: User | string | undefined): number => {
    if (!player) return 0;
    return typeof player === 'string' ? 1200 : (player.rating || 1200);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl">Loading games...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Game Lobby</h1>

      {/* Create Game Section */}
      <div className="card mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create New Game</h2>
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">
              Time Control (minutes)
            </label>
            <select
              className="input dark:bg-gray-700 dark:border-gray-600"
              value={timeControl.minutes}
              onChange={(e) =>
                setTimeControl({ ...timeControl, minutes: parseInt(e.target.value) })
              }
            >
              <option value={1}>1 min (Bullet)</option>
              <option value={3}>3 min (Blitz)</option>
              <option value={5}>5 min (Blitz)</option>
              <option value={10}>10 min (Rapid)</option>
              <option value={15}>15 min (Rapid)</option>
              <option value={30}>30 min (Classical)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Increment (seconds)
            </label>
            <select
              className="input dark:bg-gray-700 dark:border-gray-600"
              value={timeControl.increment}
              onChange={(e) =>
                setTimeControl({ ...timeControl, increment: parseInt(e.target.value) })
              }
            >
              <option value={0}>0 sec</option>
              <option value={2}>2 sec</option>
              <option value={5}>5 sec</option>
              <option value={10}>10 sec</option>
            </select>
          </div>

          <button
            onClick={handleCreateGame}
            className="btn btn-primary disabled:opacity-50"
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create Game'}
          </button>
        </div>
      </div>

      {/* Active Games List */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">
          Active Games ({activeGames.length})
        </h2>

        {activeGames.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No active games. Create one to get started!
          </p>
        ) : (
          <div className="space-y-3">
            {activeGames.map((game) => {
              const gameId = game.id || game._id;
              const whitePlayerId = typeof game.whitePlayer === 'object' ? (game.whitePlayer.id || game.whitePlayer._id) : undefined;
              const blackPlayerId = typeof game.blackPlayer === 'object' ? (game.blackPlayer.id || game.blackPlayer._id) : undefined;
              const userId = user?.id || user?._id;

              return (
                <div
                  key={gameId}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-semibold">
                          {getUsername(game.whitePlayer)} ({getRating(game.whitePlayer)})
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          vs {getUsername(game.blackPlayer)}
                          {game.blackPlayer && ` (${getRating(game.blackPlayer)})`}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {Math.floor(game.timeControlInitial / 60000)}+
                      {game.timeControlIncrement / 1000} • {game.status}
                    </div>
                  </div>

                  {game.status === 'waiting' && gameId && (
                    <button
                      onClick={() => handleJoinGame(gameId)}
                      className="btn btn-primary"
                      disabled={whitePlayerId === userId}
                    >
                      Join Game
                    </button>
                  )}

                  {game.status === 'in_progress' &&
                    gameId &&
                    (whitePlayerId === userId || blackPlayerId === userId) && (
                      <button
                        onClick={() => navigate(`/games/${gameId}`)}
                        className="btn btn-primary"
                      >
                        Resume Game
                      </button>
                    )}
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={loadActiveGames}
          className="mt-4 text-sm text-primary-600 hover:underline"
        >
          Refresh Games
        </button>
      </div>
    </div>
  );
}
