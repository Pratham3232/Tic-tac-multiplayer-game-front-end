import { io, Socket } from 'socket.io-client';
import type { Game, Move } from '../types';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Game events
  joinGame(gameId: string): void {
    this.socket?.emit('joinGame', { gameId });
  }

  leaveGame(gameId: string): void {
    this.socket?.emit('leaveGame', { gameId });
  }

  makeMove(gameId: string, move: { from: string; to: string; piece: string; promotion?: string }): void {
    this.socket?.emit('makeMove', { gameId, move });
  }

  sendMessage(gameId: string, message: string): void {
    this.socket?.emit('sendMessage', { gameId, message });
  }

  // Event listeners
  onGameUpdate(callback: (game: Game) => void): void {
    this.socket?.off('gameUpdate');
    this.socket?.off('gameUpdated');
    
    const wrappedCallback = (game: Game) => {
      callback(game);
    };
    
    this.socket?.on('gameUpdate', wrappedCallback);
    this.socket?.on('gameUpdated', wrappedCallback);
    this.addListener('gameUpdate', wrappedCallback);
    this.addListener('gameUpdated', wrappedCallback);
  }

  onPlayerJoined(callback: (data: { playerId: string; username: string }) => void): void {
    this.socket?.on('playerJoined', callback);
    this.addListener('playerJoined', callback);
  }

  onMoveMade(callback: (move: Move) => void): void {
    this.socket?.on('moveMade', callback);
    this.addListener('moveMade', callback);
  }

  onChatMessage(callback: (data: { userId: string; username: string; message: string; timestamp: Date }) => void): void {
    this.socket?.on('chatMessage', callback);
    this.socket?.on('newMessage', callback);
    this.addListener('chatMessage', callback);
    this.addListener('newMessage', callback);
  }

  onGameEnded(callback: (data: { result: string; winner?: string }) => void): void {
    this.socket?.on('gameEnded', callback);
    this.addListener('gameEnded', callback);
  }

  // Remove listeners
  offGameUpdate(callback: (game: Game) => void): void {
    this.socket?.off('gameUpdate', callback);
    this.removeListener('gameUpdate', callback);
  }

  offPlayerJoined(callback: Function): void {
    this.socket?.off('playerJoined', callback as any);
    this.removeListener('playerJoined', callback);
  }

  offMoveMade(callback: Function): void {
    this.socket?.off('moveMade', callback as any);
    this.removeListener('moveMade', callback);
  }

  offChatMessage(callback: Function): void {
    this.socket?.off('chatMessage', callback as any);
    this.removeListener('chatMessage', callback);
  }

  offGameEnded(callback: Function): void {
    this.socket?.off('gameEnded', callback as any);
    this.removeListener('gameEnded', callback);
  }

  // Helper methods
  private addListener(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  private removeListener(event: string, callback: Function): void {
    this.listeners.get(event)?.delete(callback);
  }

  removeAllListeners(): void {
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket?.off(event, callback as any);
      });
    });
    this.listeners.clear();
  }
}

export default new SocketService();
