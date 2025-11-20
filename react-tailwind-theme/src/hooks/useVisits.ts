import { useState, useEffect, useCallback } from 'react';
import { cfService } from '../services/CFService';
import type { Visit } from '../types/cf.types';

interface UseVisitsReturn {
  visits: Visit[];
  loading: boolean;
  error: string | null;
  logVisit: (destinationId: number, visitDate?: Date, durationMinutes?: number, completed?: boolean) => Promise<void>;
  getVisitCount: (destinationId: number) => number;
  hasVisited: (destinationId: number) => boolean;
  getLastVisit: (destinationId: number) => Visit | undefined;
  reload: () => Promise<void>;
}

export function useVisits(userId: number): UseVisitsReturn {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVisits = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await cfService.getUserVisits(userId);
      setVisits(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load visits';
      setError(errorMsg);
      console.error('Failed to load visits:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load visits on mount
  useEffect(() => {
    loadVisits();
  }, [loadVisits]);

  const logVisit = async (
    destinationId: number,
    visitDate?: Date,
    durationMinutes?: number,
    completed: boolean = true
  ) => {
    try {
      const newVisit = await cfService.logVisit(
        userId,
        destinationId,
        visitDate || new Date(),
        durationMinutes,
        completed
      );
      setVisits(prev => [newVisit, ...prev]);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to log visit';
      setError(errorMsg);
      console.error('Failed to log visit:', err);
      throw err;
    }
  };

  const getVisitCount = (destinationId: number): number => {
    return visits.filter(v => v.destination_id === destinationId).length;
  };

  const hasVisited = (destinationId: number): boolean => {
    return visits.some(v => v.destination_id === destinationId);
  };

  const getLastVisit = (destinationId: number): Visit | undefined => {
    const destinationVisits = visits
      .filter(v => v.destination_id === destinationId)
      .sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime());
    return destinationVisits[0];
  };

  return {
    visits,
    loading,
    error,
    logVisit,
    getVisitCount,
    hasVisited,
    getLastVisit,
    reload: loadVisits
  };
}
