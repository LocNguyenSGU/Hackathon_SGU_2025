// Collaborative Filtering Service
import type {
  Rating,
  Favorite,
  Visit,
  Feedback,
  CreateRatingRequest,
  CreateFavoriteRequest,
  CreateVisitRequest,
  CreateFeedbackRequest,
  FeedbackAction
} from '../types/cf.types';

class CollaborativeFilteringService {
  private baseURL = 'http://139.99.103.223:5556/api/v1';

  // ============ HEALTH CHECK ============

  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      if (response.ok) {
        return response.json();
      }
      return { status: 'error', message: `HTTP ${response.status}` };
    } catch (error) {
      return { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Connection failed' 
      };
    }
  }

  // ============ RATINGS ============

  async createRating(
    userId: number,
    destinationId: number,
    rating: number,
    reviewText?: string
  ): Promise<Rating> {
    const requestBody = {
      user_id: userId,
      destination_id: destinationId,
      rating,
      review_text: reviewText
    } as CreateRatingRequest;

    console.log('🔵 Creating rating:', requestBody);

    const response = await fetch(`${this.baseURL}/ratings/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Create rating failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Rating created:', result);
    return result;
  }

  async getUserRatings(userId: number): Promise<Rating[]> {
    const response = await fetch(`${this.baseURL}/ratings/user/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async getDestinationRatings(destinationId: number): Promise<Rating[]> {
    const response = await fetch(`${this.baseURL}/ratings/destination/${destinationId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async deleteRating(userId: number, destinationId: number): Promise<void> {
    const response = await fetch(
      `${this.baseURL}/ratings/${userId}/${destinationId}`,
      { method: 'DELETE' }
    );
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  // ============ FAVORITES ============

  async addFavorite(
    userId: number,
    destinationId: number,
    notes?: string
  ): Promise<Favorite> {
    const requestBody = {
      user_id: userId,
      destination_id: destinationId,
      notes
    } as CreateFavoriteRequest;

    console.log('🔵 Adding favorite:', requestBody);

    const response = await fetch(`${this.baseURL}/favorites/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Add favorite failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Favorite added:', result);
    return result;
  }

  async getUserFavorites(userId: number): Promise<Favorite[]> {
    const response = await fetch(`${this.baseURL}/favorites/user/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async removeFavorite(userId: number, destinationId: number): Promise<void> {
    console.log('🔵 Removing favorite:', { userId, destinationId });

    const response = await fetch(
      `${this.baseURL}/favorites/${userId}/${destinationId}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Remove favorite failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    console.log('✅ Favorite removed');
  }

  // ============ VISITS ============

  async logVisit(
    userId: number,
    destinationId: number,
    visitDate: Date,
    durationMinutes?: number,
    completed: boolean = true
  ): Promise<Visit> {
    const response = await fetch(`${this.baseURL}/visits/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        destination_id: destinationId,
        visit_date: visitDate.toISOString(),
        duration_minutes: durationMinutes,
        completed
      } as CreateVisitRequest)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async getUserVisits(userId: number): Promise<Visit[]> {
    const response = await fetch(`${this.baseURL}/visits/user/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  // ============ FEEDBACK ============

  async trackFeedback(
    userId: number,
    destinationId: number,
    action: FeedbackAction,
    context?: Record<string, any>
  ): Promise<Feedback | null> {
    // Silent tracking - don't throw errors
    try {
      const response = await fetch(`${this.baseURL}/feedback/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          destination_id: destinationId,
          action,
          context
        } as CreateFeedbackRequest)
      });

      if (response.ok) {
        return response.json();
      }
      return null;
    } catch (error) {
      // Silent fail for tracking
      console.warn('Tracking feedback failed:', error);
      return null;
    }
  }

  async getUserFeedback(userId: number): Promise<Feedback[]> {
    try {
      const response = await fetch(`${this.baseURL}/feedback/user/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.warn('Failed to get user feedback:', error);
      return [];
    }
  }
}

// Export singleton instance
export const cfService = new CollaborativeFilteringService();
