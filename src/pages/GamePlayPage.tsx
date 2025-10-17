import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gamesAPI } from '../services/api';
import socketService from '../services/socket';
import { useAuthStore } from '../store/authStore';
import type { Game, User } from '../types';

export default function GamePlayPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameId) return;
    
    socketService.onGameUpdate((updatedGame) => {
      setGame(updatedGame);
      
      if (updatedGame.currentPosition) {
        try {
          const positions = JSON.parse(updatedGame.currentPosition);
          if (Array.isArray(positions) && positions.length === 9) {
            setBoard(positions);
          } else {
            setBoard(Array(9).fill(null));
          }
        } catch (error) {
          setBoard(Array(9).fill(null));
        }
      } else {
        setBoard(Array(9).fill(null));
      }
    });

    socketService.onChatMessage((msg) => {
      setMessages(prev => [...prev, msg]);
    });
    
    // Join the game room AFTER listeners are set up
    socketService.joinGame(gameId);
    
    // Load initial game data
    loadGame();

    const pollingInterval = setInterval(async () => {
      if (!gameId) return;
      
      try {
        const gameData = await gamesAPI.getGame(gameId);
        
        if (gameData && (gameData.status === 'in_progress' || gameData.status === 'completed')) {
          setGame(gameData);
          
          if (gameData.currentPosition) {
            try {
              const positions = JSON.parse(gameData.currentPosition);
              if (Array.isArray(positions) && positions.length === 9) {
                setBoard(positions);
              }
            } catch (error) {
              console.error('Failed to parse board:', error);
            }
          }
        }
        
        if (gameData.status === 'completed') {
          clearInterval(pollingInterval);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 500);

    return () => {
      if (gameId) {
        socketService.leaveGame(gameId);
      }
      socketService.removeAllListeners();
      clearInterval(pollingInterval);
    };
  }, [gameId]);

  const loadGame = async () => {
    if (!gameId) return;
    
    try {
      const gameData = await gamesAPI.getGame(gameId);
      setGame(gameData);
      
      if (gameData.currentPosition) {
        try {
          const positions = JSON.parse(gameData.currentPosition);
          if (Array.isArray(positions) && positions.length === 9) {
            setBoard(positions);
          } else {
            setBoard(Array(9).fill(null));
          }
        } catch (error) {
          setBoard(Array(9).fill(null));
        }
      } else {
        setBoard(Array(9).fill(null));
      }
    } catch (error) {
      console.error('Failed to load game:', error);
      alert('Failed to load game');
      navigate('/games');
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = async (index: number) => {
    if (!game || !gameId) return;
    
    if (board[index]) return;
    
    if (game.status !== 'in_progress') return;

    // Check if it's the player's turn
    const userId = user?.id || user?._id;
    const whitePlayerId = typeof game.whitePlayer === 'object' ? (game.whitePlayer.id || game.whitePlayer._id) : undefined;
    const blackPlayerId = typeof game.blackPlayer === 'object' ? (game.blackPlayer.id || game.blackPlayer._id) : undefined;
    
    const isPlayerX = whitePlayerId === userId;
    const isPlayerO = blackPlayerId === userId;
    
    if (game.currentTurn === 'white' && !isPlayerX) return;
    if (game.currentTurn === 'black' && !isPlayerO) return;

    const currentSymbol = game.currentTurn === 'white' ? 'X' : 'O';
    
    const newBoard = [...board];
    newBoard[index] = currentSymbol;
    setBoard(newBoard);
    
    socketService.makeMove(gameId, {
      from: index.toString(),
      to: index.toString(),
      piece: currentSymbol,
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && gameId) {
      socketService.sendMessage(gameId, newMessage);
      setNewMessage('');
    }
  };

  const handleAbandon = async () => {
    if (!gameId || !window.confirm('Are you sure you want to abandon this game?')) return;

    try {
      await gamesAPI.abandonGame(gameId);
      navigate('/games');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to abandon game');
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
        <div className="text-xl">Loading game...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-16">
        <div className="text-xl mb-4">Game not found</div>
        <button onClick={() => navigate('/games')} className="btn btn-primary">
          Back to Lobby
        </button>
      </div>
    );
  }

  const renderCell = (index: number) => {
    const value = board[index];
    return (
      <button
        key={index}
        onClick={() => handleCellClick(index)}
        disabled={!!value || game?.status !== 'in_progress'}
        className={`
          w-full h-full aspect-square flex items-center justify-center
          text-4xl md:text-6xl font-bold
          border-2 border-gray-400 dark:border-gray-600
          hover:bg-gray-100 dark:hover:bg-gray-700
          disabled:cursor-not-allowed
          transition-colors
          ${value === 'X' ? 'text-blue-600' : ''}
          ${value === 'O' ? 'text-red-600' : ''}
          ${!value && game?.status === 'in_progress' ? 'cursor-pointer' : ''}
        `}
      >
        {value}
      </button>
    );
  };

  const userId = user?.id || user?._id;
  const whitePlayerId = typeof game.whitePlayer === 'object' ? (game.whitePlayer.id || game.whitePlayer._id) : undefined;
  const blackPlayerId = typeof game.blackPlayer === 'object' ? (game.blackPlayer.id || game.blackPlayer._id) : undefined;
  
  const isPlayerX = whitePlayerId === userId;
  const isPlayerO = blackPlayerId === userId;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4">
        <button
          onClick={() => navigate('/games')}
          className="text-primary-600 hover:underline"
        >
          ← Back to Lobby
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Tic-Tac-Toe Board */}
        <div className="lg:col-span-2">
          <div className="card">
            {/* Game Info */}
            <div className="mb-6 flex justify-between items-center">
              <div>
                <div className="font-semibold text-lg flex items-center gap-2">
                  <span className="text-blue-600 text-2xl">✖</span>
                  {getUsername(game.whitePlayer)} ({getRating(game.whitePlayer)})
                  {isPlayerX && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>}
                </div>
                <div className="font-semibold text-lg flex items-center gap-2 mt-1">
                  <span className="text-red-600 text-2xl">⭕</span>
                  {getUsername(game.blackPlayer)} ({getRating(game.blackPlayer)})
                  {isPlayerO && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">You</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Status: <span className="font-semibold">{game.status.replace('_', ' ')}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Turn: <span className="font-semibold">
                    {game.currentTurn === 'white' ? 'X' : 'O'}
                    {((game.currentTurn === 'white' && isPlayerX) || (game.currentTurn === 'black' && isPlayerO)) && ' (Your turn!)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tic-Tac-Toe Board */}
            <div className="max-w-[500px] mx-auto">
              <div className="grid grid-cols-3 gap-2 bg-gray-200 dark:bg-gray-800 p-2 rounded-lg">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(index => renderCell(index))}
              </div>
            </div>

            {/* Game Actions */}
            {game.status === 'in_progress' && (
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={handleAbandon}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Forfeit Game
                </button>
              </div>
            )}

            {game.status === 'completed' && (
              <div className="mt-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  Game Over!
                </div>
                <div className="text-lg mt-2">
                  {game.result?.includes('white') && 'X Wins! 🎉'}
                  {game.result?.includes('black') && 'O Wins! 🎉'}
                  {game.result?.includes('draw') && "It's a Draw! 🤝"}
                </div>
                {game.winner && (
                  <div className="text-md mt-1 text-gray-600 dark:text-gray-400">
                    Winner: {getUsername(
                      game.winner === whitePlayerId ? game.whitePlayer : game.blackPlayer
                    )}
                  </div>
                )}
              </div>
            )}

            {game.status === 'waiting' && (
              <div className="mt-6 text-center">
                <div className="text-xl font-semibold text-yellow-600">
                  Waiting for opponent to join...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Move History */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Move History</h3>
            <div className="max-h-[300px] overflow-y-auto space-y-1 text-sm">
              {game.moves && game.moves.length > 0 ? (
                game.moves.map((move, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="text-gray-500">{index + 1}.</span>
                    <span className={move.piece === 'X' ? 'text-blue-600 font-bold' : 'text-red-600 font-bold'}>
                      {move.piece}
                    </span>
                    <span>→ Cell {parseInt(move.to) + 1}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No moves yet</div>
              )}
            </div>
          </div>

          {/* Game Rules */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">How to Play</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p>• Get 3 in a row to win</p>
              <p>• X always goes first</p>
              <p>• Click on an empty cell to place your symbol</p>
              <p>• Win by getting 3 in a row (horizontal, vertical, or diagonal)</p>
            </div>
          </div>

          {/* Chat */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Chat</h3>
            <div className="max-h-[200px] overflow-y-auto space-y-2 mb-3 text-sm">
              {messages.map((msg, index) => (
                <div key={index} className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-semibold">{msg.username}:</div>
                  <div>{msg.message}</div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-gray-500 text-center py-4">
                  No messages yet
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="input flex-1 dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
