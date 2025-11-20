import { useCallback, useRef } from 'react';
import { cfService } from '../services/CFService';

/**
 * Hook for automatic visit logging with throttling
 * Prevents excessive API calls by debouncing visit logs
 */
export function useAutoVisit(userId: number) {
  const visitTimeoutsRef = useRef<Map<number, number>>(new Map());
  const visitStartTimesRef = useRef<Map<number, number>>(new Map());

  /**
   * Log a visit immediately with optional duration
   */
  const logVisit = useCallback(async (
    destinationId: number,
    completed = true
  ) => {
    if (!userId || !destinationId) return;

    try {
      // Calculate duration if we have a start time
      const startTime = visitStartTimesRef.current.get(destinationId);
      const durationMinutes = startTime 
        ? Math.round((Date.now() - startTime) / 60000)
        : undefined;

      await cfService.logVisit(
        userId,
        destinationId,
        new Date(),
        durationMinutes,
        completed
      );

      console.log(`✅ Visit logged for destination ${destinationId}`);

      // Clean up
      visitStartTimesRef.current.delete(destinationId);
      const timeout = visitTimeoutsRef.current.get(destinationId);
      if (timeout) {
        clearTimeout(timeout);
        visitTimeoutsRef.current.delete(destinationId);
      }
    } catch (error) {
      console.warn('Failed to log visit:', error);
    }
  }, [userId]);

  /**
   * Start tracking a visit to a destination
   * Will log the visit after a delay (default 3 seconds)
   */
  const startVisit = useCallback((destinationId: number, delayMs = 3000) => {
    if (!userId || !destinationId) return;

    // Clear any existing timeout for this destination
    const existingTimeout = visitTimeoutsRef.current.get(destinationId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Record start time
    visitStartTimesRef.current.set(destinationId, Date.now());

    // Set new timeout to log visit
    const timeout = setTimeout(() => {
      logVisit(destinationId);
    }, delayMs) as unknown as number;

    visitTimeoutsRef.current.set(destinationId, timeout);
  }, [userId, logVisit]);

  /**
   * Cancel a pending visit log
   */
  const cancelVisit = useCallback((destinationId: number) => {
    const timeout = visitTimeoutsRef.current.get(destinationId);
    if (timeout) {
      clearTimeout(timeout);
      visitTimeoutsRef.current.delete(destinationId);
    }
    visitStartTimesRef.current.delete(destinationId);
  }, []);

  /**
   * Log a quick visit (for clicks/views)
   * Uses a shorter duration assumption
   */
  const logQuickVisit = useCallback((destinationId: number) => {
    if (!userId || !destinationId) return;
    
    cfService.logVisit(
      userId,
      destinationId,
      new Date(),
      5, // Assume 5 minutes for quick views
      true
    ).catch(err => console.warn('Failed to log quick visit:', err));
  }, [userId]);

  return {
    startVisit,
    logVisit,
    cancelVisit,
    logQuickVisit
  };
}
