import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function HomePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="max-w-4xl mx-auto text-center py-16">
      <h1 className="text-6xl font-bold mb-6 text-gray-900 dark:text-white">
        ✖⭕ Welcome to Lila Game
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
        Play Tic-Tac-Toe online with players around the world. Real-time gameplay, rating system, and more!
      </p>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="card">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold mb-2">Real-time Play</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Instant move updates with WebSocket technology
          </p>
        </div>
        
        <div className="card">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold mb-2">Rating System</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and compete with others
          </p>
        </div>
        
        <div className="card">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-xl font-semibold mb-2">Multiplayer</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create games and challenge players worldwide
          </p>
        </div>
      </div>

      {isAuthenticated ? (
        <Link
          to="/games"
          className="inline-block px-8 py-4 text-lg bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          Go to Game Lobby
        </Link>
      ) : (
        <div className="flex gap-4 justify-center">
          <Link
            to="/register"
            className="inline-block px-8 py-4 text-lg bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="inline-block px-8 py-4 text-lg bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Login
          </Link>
        </div>
      )}

      <div className="mt-16 text-sm text-gray-500 dark:text-gray-600">
        <p>Powered by NestJS, MongoDB, Socket.IO, and React</p>
      </div>
    </div>
  );
}
