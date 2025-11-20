// Collaborative Filtering Types

export interface Rating {
  rating_id: number;
  user_id: number;
  destination_id: number;
  rating: number;
  review_text?: string;
  visit_date?: string;
  created_date: string;
}

export interface Favorite {
  favorite_id: number;
  user_id: number;
  destination_id: number;
  notes?: string;
  created_date: string;
}

export interface Visit {
  visit_id: number;
  user_id: number;
  destination_id: number;
  visit_date: string;
  duration_minutes?: number;
  completed: boolean;
  created_date: string;
}

export interface Feedback {
  feedback_id: number;
  user_id: number;
  destination_id: number;
  action: FeedbackAction;
  context?: Record<string, any>;
  created_date: string;
}

export type FeedbackAction = 'click' | 'skip' | 'save' | 'share' | 'view_details';

export interface CreateRatingRequest {
  user_id: number;
  destination_id: number;
  rating: number;
  review_text?: string;
  visit_date?: string;
}

export interface CreateFavoriteRequest {
  user_id: number;
  destination_id: number;
  notes?: string;
}

export interface CreateVisitRequest {
  user_id: number;
  destination_id: number;
  visit_date: string;
  duration_minutes?: number;
  completed?: boolean;
}

export interface CreateFeedbackRequest {
  user_id: number;
  destination_id: number;
  action: FeedbackAction;
  context?: Record<string, any>;
}
