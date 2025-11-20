import { useState } from 'react';
import { Star, MapPin, Clock, DollarSign, Heart } from 'lucide-react';
import { useFavorites, useRatings } from '../hooks';
import { RatingStars, FavoriteButton, RatingModal } from '../components';
import { getCurrentUserId } from '../utils/user';
import { trackClick } from '../hooks/useTracking';
import { showSuccessToast, showErrorToast } from '../utils/toast';

// Mock destination data
const mockDestinations = [
  {
    id: 1,
    name: 'Hồ Hoàn Kiếm',
    type: 'Danh lam thắng cảnh',
    location_address: 'Quận Hoàn Kiếm, Hà Nội',
    price: 0,
    visit_time: 60,
    score: 4.5
  },
  {
    id: 2,
    name: 'Chùa Một Cột',
    type: 'Di tích lịch sử',
    location_address: 'Ba Đình, Hà Nội',
    price: 30000,
    visit_time: 45,
    score: 4.2
  },
  {
    id: 3,
    name: 'Văn Miếu Quốc Tử Giám',
    type: 'Di tích văn hóa',
    location_address: 'Đống Đa, Hà Nội',
    price: 40000,
    visit_time: 90,
    score: 4.8
  }
];

export default function CFDemo() {
  const userId = getCurrentUserId();
  const { isFavorited, addFavorite, removeFavorite } = useFavorites(userId);
  const { createRating, getUserRating } = useRatings(userId);
  
  const [selectedDestination, setSelectedDestination] = useState<typeof mockDestinations[0] | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const handleToggleFavorite = async (destId: number, currentFavorited: boolean) => {
    try {
      if (currentFavorited) {
        await removeFavorite(destId);
        showSuccessToast('Đã xóa khỏi danh sách yêu thích');
      } else {
        await addFavorite(destId);
        showSuccessToast('Đã thêm vào danh sách yêu thích');
      }
    } catch (error) {
      showErrorToast('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const handleRateClick = (destination: typeof mockDestinations[0]) => {
    setSelectedDestination(destination);
    setShowRatingModal(true);
  };

  const handleSubmitRating = async (rating: number, reviewText?: string) => {
    if (selectedDestination) {
      try {
        await createRating(selectedDestination.id, rating, reviewText);
        showSuccessToast('Cảm ơn bạn đã đánh giá!');
      } catch (error) {
        showErrorToast('Không thể gửi đánh giá, vui lòng thử lại');
      }
    }
  };

  const handleDestinationClick = (destination: typeof mockDestinations[0]) => {
    trackClick(userId, destination.id, 'demo_page');
    console.log('Tracked click for destination:', destination.name);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Collaborative Filtering Demo
          </h1>
          <p className="text-gray-600">
            Demo tích hợp Rating, Favorite và Tracking
          </p>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>User ID:</strong> {userId}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Mở Developer Console để xem tracking logs
            </p>
          </div>
        </div>

        {/* Destination Cards */}
        <div className="space-y-4">
          {mockDestinations.map((destination) => {
            const favorited = isFavorited(destination.id);
            const userRating = getUserRating(destination.id);

            return (
              <div
                key={destination.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div 
                      className="cursor-pointer"
                      onClick={() => handleDestinationClick(destination)}
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {destination.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">{destination.type}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {destination.location_address}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {destination.visit_time} phút
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        {destination.price === 0 ? 'Miễn phí' : formatCurrency(destination.price)}
                      </div>
                    </div>

                    {/* Rating Section */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Đánh giá của bạn:
                        </span>
                        <RatingStars
                          initialRating={userRating?.rating || 0}
                          onRate={(rating) => createRating(destination.id, rating)}
                          size="md"
                        />
                        {userRating && (
                          <span className="text-sm text-emerald-600 font-medium">
                            {userRating.rating.toFixed(1)} ⭐
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRateClick(destination)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {userRating ? 'Sửa đánh giá' : 'Viết đánh giá'}
                      </button>
                    </div>

                    {/* User's Review */}
                    {userRating?.review_text && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700 italic">
                          "{userRating.review_text}"
                        </p>
                      </div>
                    )}

                    {/* Average Score */}
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">
                        Điểm trung bình: <strong>{destination.score.toFixed(1)}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Favorite Button */}
                  <FavoriteButton
                    isFavorited={favorited}
                    onToggle={() => handleToggleFavorite(destination.id, favorited)}
                    size="lg"
                    variant="icon"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <h3 className="font-bold text-emerald-900 mb-2">✅ Các tính năng đã tích hợp:</h3>
          <ul className="space-y-2 text-sm text-emerald-800">
            <li className="flex items-start gap-2">
              <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span><strong>Favorite:</strong> Click icon trái tim để thêm/xóa yêu thích</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span><strong>Rating:</strong> Click vào ngôi sao để đánh giá nhanh hoặc "Viết đánh giá" để thêm review</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span><strong>Tracking:</strong> Click vào tên địa điểm sẽ track interaction (xem console)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Rating Modal */}
      {selectedDestination && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedDestination(null);
          }}
          destinationName={selectedDestination.name}
          destinationId={selectedDestination.id}
          userId={userId}
          initialRating={getUserRating(selectedDestination.id)?.rating || 0}
          initialReview={getUserRating(selectedDestination.id)?.review_text || ''}
          onSubmit={handleSubmitRating}
        />
      )}
    </div>
  );
}
