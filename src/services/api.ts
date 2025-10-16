import axios from 'axios';
import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials,
  Game,
  CreateGameDto,
  MakeMoveDto,
  User 
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', credentials);
    // Unwrap the response - backend wraps in { data: { accessToken, user } }
    return data.data || data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    // Unwrap the response - backend wraps in { data: { accessToken, user } }
    return data.data || data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/auth/profile');
    // Unwrap the response - backend wraps in { data: { user } }
    return data.data || data;
  },
};

export const gamesAPI = {
  createGame: async (gameData: CreateGameDto): Promise<Game> => {
    const { data } = await api.post('/games', gameData);
    // Unwrap the response - backend wraps in { data: { game } }
    return data.data || data;
  },

  getActiveGames: async (): Promise<Game[]> => {
    const { data } = await api.get('/games');
    // Unwrap the response - backend wraps in { data: [ games ] }
    return data.data || data;
  },

  getGame: async (id: string): Promise<Game> => {
    const { data } = await api.get(`/games/${id}`);
    // Unwrap the response - backend wraps in { data: { game } }
    return data.data || data;
  },

  getUserGames: async (userId: string): Promise<Game[]> => {
    const { data } = await api.get(`/users/${userId}/games`);
    // Unwrap the response - backend wraps in { data: [ games ] }
    return data.data || data;
  },

  joinGame: async (id: string): Promise<Game> => {
    const { data} = await api.post(`/games/${id}/join`);
    // Unwrap the response - backend wraps in { data: { game } }
    return data.data || data;
  },

  makeMove: async (id: string, move: MakeMoveDto): Promise<Game> => {
    const { data } = await api.post(`/games/${id}/moves`, move);
    // Unwrap the response - backend wraps in { data: { game } }
    return data.data || data;
  },

  abandonGame: async (id: string): Promise<Game> => {
    const { data } = await api.post(`/games/${id}/abandon`);
    // Unwrap the response - backend wraps in { data: { game } }
    return data.data || data;
  },
};

export const usersAPI = {
  getUser: async (id: string): Promise<User> => {
    const { data } = await api.get(`/users/${id}`);
    // Unwrap the response - backend wraps in { data: { user } }
    return data.data || data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const { data } = await api.get('/users');
    // Unwrap the response - backend wraps in { data: [ users ] }
    return data.data || data;
  },
};

export default api;
