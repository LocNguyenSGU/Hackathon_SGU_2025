import { useEffect, useRef } from 'react';
import { cfService } from '../services/CFService';
import type { FeedbackAction } from '../types/cf.types';

/**
 * Hook to track user interactions with destinations
 */
export function useTracking(userId: number) {
  const track = (
    destinationId: number,
    action: FeedbackAction,
    context?: Record<string, any>
  ) => {
    cfService.trackFeedback(userId, destinationId, action, context);
  };

  return { track };
}

/**
 * Hook to track view duration on a page
 */
export function useViewTracking(userId: number, destinationId: number | null) {
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!destinationId) return;

    // Reset start time when destination changes
    startTimeRef.current = Date.now();

    // Track view start
    cfService.trackFeedback(userId, destinationId, 'view_details', {
      event: 'view_start'
    });

    // Track view end on unmount
    return () => {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      cfService.trackFeedback(userId, destinationId, 'view_details', {
        event: 'view_end',
        duration_seconds: duration
      });
    };
  }, [userId, destinationId]);
}

/**
 * Utility functions for common tracking scenarios
 */
export const trackClick = (userId: number, destinationId: number, source: string) => {
  cfService.trackFeedback(userId, destinationId, 'click', { source });
};

export const trackSkip = (userId: number, destinationId: number, reason?: string) => {
  cfService.trackFeedback(userId, destinationId, 'skip', { reason });
};

export const trackShare = (userId: number, destinationId: number, platform: string) => {
  cfService.trackFeedback(userId, destinationId, 'share', { platform });
};

export const trackSave = (userId: number, destinationId: number, listName?: string) => {
  cfService.trackFeedback(userId, destinationId, 'save', { list_name: listName });
};
