import { useState, useEffect, useCallback } from 'react';
import { cfService } from '../services/CFService';
import type { Favorite } from '../types/cf.types';

interface UseFavoritesReturn {
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
  addFavorite: (destinationId: number, notes?: string) => Promise<void>;
  removeFavorite: (destinationId: number) => Promise<void>;
  isFavorited: (destinationId: number) => boolean;
  reload: () => Promise<void>;
}

export function useFavorites(userId: number): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await cfService.getUserFavorites(userId);
      setFavorites(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load favorites';
      setError(errorMsg);
      console.error('Failed to load favorites:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const addFavorite = async (destinationId: number, notes?: string) => {
    try {
      const newFavorite = await cfService.addFavorite(userId, destinationId, notes);
      setFavorites(prev => [...prev, newFavorite]);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add favorite';
      setError(errorMsg);
      console.error('Failed to add favorite:', err);
      throw err;
    }
  };

  const removeFavorite = async (destinationId: number) => {
    try {
      await cfService.removeFavorite(userId, destinationId);
      setFavorites(prev => prev.filter(f => f.destination_id !== destinationId));
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to remove favorite';
      setError(errorMsg);
      console.error('Failed to remove favorite:', err);
      throw err;
    }
  };

  const isFavorited = (destinationId: number): boolean => {
    return favorites.some(f => f.destination_id === destinationId);
  };

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorited,
    reload: loadFavorites
  };
}
