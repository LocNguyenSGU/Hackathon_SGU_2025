import React, { useState } from 'react';
import { X } from 'lucide-react';
import { RatingStars } from './RatingStars';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationName: string;
  destinationId?: number; // Optional - kept for backward compatibility
  userId?: number; // Optional - kept for backward compatibility
  initialRating?: number;
  initialReview?: string;
  onSubmit: (rating: number, reviewText?: string) => Promise<void>;
}

export function RatingModal({
  isOpen,
  onClose,
  destinationName,
  initialRating = 0,
  initialReview = '',
  onSubmit
}: RatingModalProps) {
  const [rating, setRating] = useState(initialRating);
  const [reviewText, setReviewText] = useState(initialReview);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setLoading(true);
    try {
      await onSubmit(rating, reviewText || undefined);
      onClose();
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Đánh giá địa điểm</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 font-medium">{destinationName}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đánh giá của bạn
            </label>
            <RatingStars
              initialRating={rating}
              onRate={setRating}
              size="lg"
              showValue
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhận xét (tùy chọn)
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              placeholder="Chia sẻ trải nghiệm của bạn..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={rating === 0 || loading}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
