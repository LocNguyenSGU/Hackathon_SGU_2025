import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Trash2, Edit2, Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import { useFavorites, useRatings } from '../hooks';
import { useVisits } from '../hooks/useVisits';
import { RatingModal } from '../components';
import { getCurrentUserId } from '../utils/user';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import type { Rating } from '../types/cf.types';

type TabType = 'favorites' | 'ratings';

export default function UserProfile() {
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const { favorites, loading: favLoading, removeFavorite } = useFavorites(userId);
  const { ratings, loading: ratingLoading, deleteRating } = useRatings(userId);
  const { visits } = useVisits(userId);
  
  const [activeTab, setActiveTab] = useState<TabType>('favorites');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);

  const handleRemoveFavorite = async (destId: number, destName: string) => {
    if (confirm(`Xóa "${destName}" khỏi danh sách yêu thích?`)) {
      try {
        await removeFavorite(destId);
        showSuccessToast('Đã xóa khỏi yêu thích');
      } catch (error) {
        showErrorToast('Không thể xóa, vui lòng thử lại');
      }
    }
  };

  const handleDeleteRating = async (destId: number, destName: string) => {
    if (confirm(`Xóa đánh giá cho "${destName}"?`)) {
      try {
        await deleteRating(destId);
        showSuccessToast('Đã xóa đánh giá');
      } catch (error) {
        showErrorToast('Không thể xóa, vui lòng thử lại');
      }
    }
  };

  const handleEditRating = (rating: Rating) => {
    setSelectedRating(rating);
    setShowRatingModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trang cá nhân
          </h1>
          <p className="text-gray-600">
            User ID: {userId}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-6 h-6 text-red-500" />
              <span className="text-2xl font-bold text-gray-900">
                {favorites.length}
              </span>
            </div>
            <p className="text-gray-600">Địa điểm yêu thích</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-900">
                {ratings.length}
              </span>
            </div>
            <p className="text-gray-600">Đánh giá đã gửi</p>
          </div>

          <button
            onClick={() => navigate('/visits')}
            className="bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl p-6 border-2 border-transparent hover:border-emerald-600 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-6 h-6 text-white" />
              <span className="text-2xl font-bold text-white">
                {visits.length}
              </span>
              <ExternalLink className="w-4 h-4 text-white/80 ml-auto group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-white/90 text-left">Lịch sử ghé thăm</p>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'favorites'
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                Yêu thích ({favorites.length})
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('ratings')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'ratings'
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Star className="w-5 h-5" />
                Đánh giá ({ratings.length})
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <>
                {favLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Đang tải...</p>
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Chưa có địa điểm yêu thích
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Nhấn vào icon ❤️ để thêm địa điểm bạn thích
                    </p>
                    <button
                      onClick={() => navigate('/tour-recommendations')}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Khám phá địa điểm
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {favorites.map((fav) => (
                      <div
                        key={fav.favorite_id}
                        className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            Destination #{fav.destination_id}
                          </h4>
                          {fav.notes && (
                            <p className="text-sm text-gray-600 mb-2">
                              "{fav.notes}"
                            </p>
                          )}
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Đã lưu: {formatDate(fav.created_date)}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveFavorite(fav.destination_id, `Destination #${fav.destination_id}`)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa khỏi yêu thích"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Ratings Tab */}
            {activeTab === 'ratings' && (
              <>
                {ratingLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Đang tải...</p>
                  </div>
                ) : ratings.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Chưa có đánh giá
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Hãy đánh giá các địa điểm bạn đã ghé thăm
                    </p>
                    <button
                      onClick={() => navigate('/tour-recommendations')}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Khám phá địa điểm
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ratings.map((rating) => (
                      <div
                        key={rating.rating_id}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Destination #{rating.destination_id}
                            </h4>
                            <div className="flex items-center gap-2 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < rating.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-sm font-medium text-gray-700">
                                {rating.rating.toFixed(1)}/5
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditRating(rating)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRating(rating.destination_id, `Destination #${rating.destination_id}`)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa đánh giá"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {rating.review_text && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-700 italic">
                              "{rating.review_text}"
                            </p>
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(rating.created_date)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {selectedRating && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedRating(null);
          }}
          destinationName={`Destination #${selectedRating.destination_id}`}
          destinationId={selectedRating.destination_id}
          userId={userId}
          initialRating={selectedRating.rating}
          initialReview={selectedRating.review_text || ''}
          onSubmit={async () => {
            // Rating will be updated via the hook
            showSuccessToast('Đã cập nhật đánh giá');
          }}
        />
      )}
    </div>
  );
}
