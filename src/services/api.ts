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

// Helper functions to normalize MongoDB _id to id
const normalizeUser = (user: any): User => {
  if (!user) return user;
  return {
    ...user,
    id: user.id || user._id,
    _id: user._id || user.id,
  };
};

const normalizeGame = (game: any): Game => {
  if (!game) return game;
  return {
    ...game,
    id: game.id || game._id,
    _id: game._id || game.id,
    whitePlayer: typeof game.whitePlayer === 'object' ? normalizeUser(game.whitePlayer) : game.whitePlayer,
    blackPlayer: typeof game.blackPlayer === 'object' ? normalizeUser(game.blackPlayer) : game.blackPlayer,
  };
};

const unwrapResponse = (response: any) => {
  // Backend wraps responses in { data: {...} }
  return response.data || response;
};

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
    const unwrapped = unwrapResponse(data);
    return {
      accessToken: unwrapped.accessToken,
      user: normalizeUser(unwrapped.user),
    };
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    const unwrapped = unwrapResponse(data);
    return {
      accessToken: unwrapped.accessToken,
      user: normalizeUser(unwrapped.user),
    };
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/auth/profile');
    const unwrapped = unwrapResponse(data);
    return normalizeUser(unwrapped);
  },
};

export const gamesAPI = {
  createGame: async (gameData: CreateGameDto): Promise<Game> => {
    const { data } = await api.post('/games', gameData);
    const unwrapped = unwrapResponse(data);
    const normalized = normalizeGame(unwrapped);
    return normalized;
  },

  getActiveGames: async (): Promise<Game[]> => {
    const { data } = await api.get('/games');
    const unwrapped = unwrapResponse(data);
    const normalized = Array.isArray(unwrapped) ? unwrapped.map(normalizeGame) : [];
    return normalized;
  },

  searchGames: async (searchTerm: string): Promise<Game[]> => {
    const { data } = await api.get(`/games?search=${encodeURIComponent(searchTerm)}`);
    const unwrapped = unwrapResponse(data);
    return Array.isArray(unwrapped) ? unwrapped.map(normalizeGame) : [];
  },

  findRandomMatch: async (): Promise<Game> => {
    const { data } = await api.post('/games/random-match');
    const unwrapped = unwrapResponse(data);
    return normalizeGame(unwrapped);
  },

  getGame: async (id: string): Promise<Game> => {
    const { data } = await api.get(`/games/${id}`);
    const unwrapped = unwrapResponse(data);
    return normalizeGame(unwrapped);
  },

  getUserGames: async (userId: string): Promise<Game[]> => {
    const { data } = await api.get(`/users/${userId}/games`);
    const unwrapped = unwrapResponse(data);
    return Array.isArray(unwrapped) ? unwrapped.map(normalizeGame) : [];
  },

  joinGame: async (id: string): Promise<Game> => {
    const { data} = await api.post(`/games/${id}/join`);
    const unwrapped = unwrapResponse(data);
    const normalized = normalizeGame(unwrapped);
    return normalized;
  },

  makeMove: async (id: string, move: MakeMoveDto): Promise<Game> => {
    const { data } = await api.post(`/games/${id}/moves`, move);
    const unwrapped = unwrapResponse(data);
    return normalizeGame(unwrapped);
  },

  abandonGame: async (id: string): Promise<Game> => {
    const { data } = await api.post(`/games/${id}/abandon`);
    const unwrapped = unwrapResponse(data);
    return normalizeGame(unwrapped);
  },
};

export const usersAPI = {
  getUser: async (id: string): Promise<User> => {
    const { data } = await api.get(`/users/${id}`);
    const unwrapped = unwrapResponse(data);
    return normalizeUser(unwrapped);
  },

  getAllUsers: async (): Promise<User[]> => {
    const { data } = await api.get('/users');
    const unwrapped = unwrapResponse(data);
    return Array.isArray(unwrapped) ? unwrapped.map(normalizeUser) : [];
  },

  getLeaderboard: async (limit: number = 5): Promise<User[]> => {
    const { data } = await api.get(`/users/leaderboard?limit=${limit}`);
    const unwrapped = unwrapResponse(data);
    return Array.isArray(unwrapped) ? unwrapped.map(normalizeUser) : [];
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/users/profile');
    const unwrapped = unwrapResponse(data);
    return normalizeUser(unwrapped);
  },
};

export default api;
