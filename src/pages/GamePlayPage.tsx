import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { gamesAPI } from '../services/api';
import socketService from '../services/socket';
import { useAuthStore } from '../store/authStore';
import type { Game, User } from '../types';

export default function GamePlayPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [chess] = useState(new Chess());
  const [position, setPosition] = useState(chess.fen());
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameId) return;

    loadGame();
    
    // Connect socket
    const token = localStorage.getItem('token');
    if (token) {
      socketService.connect(token);
      socketService.joinGame(gameId);
    }

    // Setup listeners
    socketService.onGameUpdate((updatedGame) => {
      setGame(updatedGame);
      if (updatedGame.currentPosition) {
        chess.load(updatedGame.currentPosition);
        setPosition(updatedGame.currentPosition);
      }
    });

    socketService.onChatMessage((msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      if (gameId) {
        socketService.leaveGame(gameId);
      }
      socketService.removeAllListeners();
    };
  }, [gameId]);

  const loadGame = async () => {
    if (!gameId) return;
    
    try {
      const gameData = await gamesAPI.getGame(gameId);
      setGame(gameData);
      
      if (gameData.currentPosition) {
        chess.load(gameData.currentPosition);
        setPosition(gameData.currentPosition);
      }
    } catch (error) {
      console.error('Failed to load game:', error);
      alert('Failed to load game');
      navigate('/games');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (!game || !gameId) return false;

    // Check if it's the player's turn
    const isWhite = typeof game.whitePlayer === 'object' && game.whitePlayer.id === user?.id;
    const isBlack = typeof game.blackPlayer === 'object' && game.blackPlayer.id === user?.id;
    
    if ((game.currentTurn === 'white' && !isWhite) || (game.currentTurn === 'black' && !isBlack)) {
      return false;
    }

    try {
      const move = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // Always promote to queen for simplicity
      });

      if (move) {
        // Emit move via WebSocket
        socketService.makeMove(gameId, {
          from: sourceSquare,
          to: targetSquare,
          piece: move.piece,
          promotion: move.promotion,
        });

        setPosition(chess.fen());
        return true;
      }
    } catch (error) {
      console.error('Invalid move:', error);
      return false;
    }

    return false;
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

  const boardOrientation = 
    typeof game.whitePlayer === 'object' && game.whitePlayer.id === user?.id
      ? 'white'
      : 'black';

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
        {/* Chess Board */}
        <div className="lg:col-span-2">
          <div className="card">
            {/* Game Info */}
            <div className="mb-4 flex justify-between items-center">
              <div>
                <div className="font-semibold text-lg">
                  ⚪ {getUsername(game.whitePlayer)} ({getRating(game.whitePlayer)})
                </div>
                <div className="font-semibold text-lg">
                  ⚫ {getUsername(game.blackPlayer)} ({getRating(game.blackPlayer)})
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Status: <span className="font-semibold">{game.status}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Turn: <span className="font-semibold capitalize">{game.currentTurn}</span>
                </div>
              </div>
            </div>

            {/* Chessboard */}
            <div className="max-w-[600px] mx-auto">
              <Chessboard
                position={position}
                onPieceDrop={onDrop}
                boardOrientation={boardOrientation}
                arePiecesDraggable={game.status === 'in_progress'}
                customBoardStyle={{
                  borderRadius: '4px',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
                }}
              />
            </div>

            {/* Game Actions */}
            {game.status === 'in_progress' && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleAbandon}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Abandon Game
                </button>
              </div>
            )}

            {game.status === 'completed' && (
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  Game Over!
                </div>
                <div className="text-lg mt-2">
                  Result: {game.result?.replace('_', ' ')}
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
                  <div key={index} className="flex gap-2">
                    <span className="text-gray-500">{Math.floor(index / 2) + 1}.</span>
                    <span>{move.algebraicNotation}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No moves yet</div>
              )}
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
