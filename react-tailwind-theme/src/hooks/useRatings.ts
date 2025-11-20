import { useState, useEffect, useCallback } from 'react';
import { cfService } from '../services/CFService';
import type { Rating } from '../types/cf.types';

interface UseRatingsReturn {
  ratings: Rating[];
  loading: boolean;
  error: string | null;
  createRating: (destinationId: number, rating: number, reviewText?: string) => Promise<void>;
  deleteRating: (destinationId: number) => Promise<void>;
  getUserRating: (destinationId: number) => Rating | undefined;
  reload: () => Promise<void>;
}

export function useRatings(userId: number): UseRatingsReturn {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRatings = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await cfService.getUserRatings(userId);
      setRatings(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load ratings';
      setError(errorMsg);
      console.error('Failed to load ratings:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load ratings on mount
  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  const createRating = async (destinationId: number, rating: number, reviewText?: string) => {
    try {
      const newRating = await cfService.createRating(userId, destinationId, rating, reviewText);
      setRatings(prev => {
        // Replace existing rating or add new one
        const filtered = prev.filter(r => r.destination_id !== destinationId);
        return [...filtered, newRating];
      });
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create rating';
      setError(errorMsg);
      console.error('Failed to create rating:', err);
      throw err;
    }
  };

  const deleteRating = async (destinationId: number) => {
    try {
      await cfService.deleteRating(userId, destinationId);
      setRatings(prev => prev.filter(r => r.destination_id !== destinationId));
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete rating';
      setError(errorMsg);
      console.error('Failed to delete rating:', err);
      throw err;
    }
  };

  const getUserRating = (destinationId: number): Rating | undefined => {
    return ratings.find(r => r.destination_id === destinationId);
  };

  return {
    ratings,
    loading,
    error,
    createRating,
    deleteRating,
    getUserRating,
    reload: loadRatings
  };
}
