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
    set((state) => ({
      currentGame: state.currentGame?.id === game.id ? game : state.currentGame,
      activeGames: state.activeGames.map(g => g.id === game.id ? game : g),
      userGames: state.userGames.map(g => g.id === game.id ? game : g),
    }));
  },
}));
