import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { usersAPI } from '../../services/api';
import socketService from '../../services/socket';

export default function Header() {
  const { isAuthenticated, user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Refresh user profile every 5 seconds to get updated rating
    const refreshProfile = async () => {
      try {
        const updatedUser = await usersAPI.getProfile();
        updateUser(updatedUser);
      } catch (error) {
        console.error('Failed to refresh user profile:', error);
      }
    };

    const interval = setInterval(refreshProfile, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user?.id, updateUser]);

  const handleLogout = () => {
    socketService.disconnect();
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            ♔ Lila Game
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/games" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">
                  Games
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {user?.username} ({user?.rating || 1200})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
