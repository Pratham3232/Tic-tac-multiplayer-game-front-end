import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../services/api';
import socketService from '../services/socket';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authAPI.login(credentials);
      login(data.accessToken, data.user);
      
      // Connect to WebSocket
      socketService.connect(data.accessToken);
      
      navigate('/games');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="card">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Username or Email
            </label>
            <input
              type="text"
              className="input dark:bg-gray-700 dark:border-gray-600"
              value={credentials.usernameOrEmail}
              onChange={(e) =>
                setCredentials({ ...credentials, usernameOrEmail: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              className="input dark:bg-gray-700 dark:border-gray-600"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
