import { create } from 'zustand';
import type { Game } from '../types';

interface GameState {
  currentGame: Game | null;
  activeGames: Game[];
  userGames: Game[];
  setCurrentGame: (game: Game | null) => void;
  setActiveGames: (games: Game[]) => void;
  setUserGames: (games: Game[]) => void;
  updateGame: (game: Game) => void;
}

// Helper to get game ID (supports both _id and id)
const getGameId = (game: Game | null): string | undefined => {
  return game?.id || game?._id;
};

export const useGameStore = create<GameState>((set) => ({
  currentGame: null,
  activeGames: [],
  userGames: [],
  
  setCurrentGame: (game: Game | null) => {
    set({ currentGame: game });
  },
  
  setActiveGames: (games: Game[]) => {
    set({ activeGames: games });
  },
  
  setUserGames: (games: Game[]) => {
    set({ userGames: games });
  },
  
  updateGame: (game: Game) => {
    const gameId = getGameId(game);
    set((state) => ({
      currentGame: getGameId(state.currentGame) === gameId ? game : state.currentGame,
      activeGames: state.activeGames.map(g => getGameId(g) === gameId ? game : g),
      userGames: state.userGames.map(g => getGameId(g) === gameId ? game : g),
    }));
  },
}));
