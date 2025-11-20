import { useState, useEffect } from 'react';
import { MapPin, Star, Clock, DollarSign } from 'lucide-react';
import { RatingStars } from '../components/RatingStars';
import { FavoriteButton } from '../components/FavoriteButton';
import { RatingModal } from '../components/RatingModal';
import { useRatings } from '../hooks/useRatings';
import { useFavorites } from '../hooks/useFavorites';
import { useTracking } from '../hooks/useTracking';
import { getCurrentUserId } from '../utils/user';
import { showSuccessToast, showErrorToast } from '../utils/toast';

interface Location {
	id: number;
	name: string;
	description: string;
	category: string;
	rating: number;
	reviews: number;
	price: string;
	duration: string;
	image: string;
	region: string;
}

// Mock data - thay thế bằng API call thực tế
const mockLocations: Location[] = [
	{
		id: 1,
		name: 'Vịnh Hạ Long',
		description: 'Di sản thiên nhiên thế giới với hàng nghìn đảo đá vôi kỳ vĩ',
		category: 'Thiên nhiên',
		rating: 4.8,
		reviews: 1250,
		price: '2.500.000đ',
		duration: '2-3 ngày',
		image: '/gallery/halong.jpg',
		region: 'Miền Bắc'
	},
	{
		id: 2,
		name: 'Phố Cổ Hội An',
		description: 'Thành phố cổ đầy màu sắc với đèn lồng lung linh',
		category: 'Văn hóa',
		rating: 4.7,
		reviews: 980,
		price: '1.800.000đ',
		duration: '2 ngày',
		image: '/gallery/hoian.jpg',
		region: 'Miền Trung'
	},
	{
		id: 3,
		name: 'Đảo Phú Quốc',
		description: 'Thiên đường biển đảo với bãi cát trắng và nước biển trong xanh',
		category: 'Biển đảo',
		rating: 4.6,
		reviews: 856,
		price: '3.200.000đ',
		duration: '3-4 ngày',
		image: '/gallery/phuquoc.jpg',
		region: 'Miền Nam'
	},
	{
		id: 4,
		name: 'Sapa',
		description: 'Vùng núi non hùng vĩ với ruộng bậc thang tuyệt đẹp',
		category: 'Thiên nhiên',
		rating: 4.5,
		reviews: 742,
		price: '2.000.000đ',
		duration: '2-3 ngày',
		image: '/gallery/sapa.jpg',
		region: 'Miền Bắc'
	},
	{
		id: 5,
		name: 'Động Phong Nha',
		description: 'Hệ thống hang động kỳ vĩ nhất thế giới',
		category: 'Thiên nhiên',
		rating: 4.9,
		reviews: 1100,
		price: '2.800.000đ',
		duration: '2 ngày',
		image: '/gallery/phongnha.jpg',
		region: 'Miền Trung'
	},
	{
		id: 6,
		name: 'Đà Lạt',
		description: 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm',
		category: 'Thiên nhiên',
		rating: 4.4,
		reviews: 920,
		price: '1.500.000đ',
		duration: '2-3 ngày',
		image: '/gallery/dalat.jpg',
		region: 'Miền Nam'
	}
];

export default function TourRecommendations() {
	const userId = getCurrentUserId();
	const [locations] = useState<Location[]>(mockLocations);
	const [selectedCategory, setSelectedCategory] = useState<string>('all');
	const [selectedRegion, setSelectedRegion] = useState<string>('all');
	const [showRatingModal, setShowRatingModal] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

	const { ratings, createRating } = useRatings(userId);
	const { addFavorite, removeFavorite, isFavorited } = useFavorites(userId);
	const { track } = useTracking(userId);

	// Track page view
	useEffect(() => {
		track(0, 'view_details', { page: 'tour-recommendations' });
	}, [track]);

	const categories = ['all', 'Thiên nhiên', 'Văn hóa', 'Biển đảo'];
	const regions = ['all', 'Miền Bắc', 'Miền Trung', 'Miền Nam'];

	const filteredLocations = locations.filter(location => {
		const categoryMatch = selectedCategory === 'all' || location.category === selectedCategory;
		const regionMatch = selectedRegion === 'all' || location.region === selectedRegion;
		return categoryMatch && regionMatch;
	});

	const getUserRating = (destinationId: number) => {
		return ratings.find(r => r.destination_id === destinationId);
	};

	const handleFavoriteToggle = async (locationId: number) => {
		try {
			if (isFavorited(locationId)) {
				await removeFavorite(locationId);
				showSuccessToast('Đã xóa khỏi danh sách yêu thích');
				track(locationId, 'skip');
			} else {
				await addFavorite(locationId);
				showSuccessToast('Đã thêm vào danh sách yêu thích');
				track(locationId, 'save');
			}
		} catch (error) {
			showErrorToast('Có lỗi xảy ra');
		}
	};

	const handleOpenRatingModal = (location: Location) => {
		setSelectedLocation(location);
		setShowRatingModal(true);
		track(location.id, 'click', { action: 'open_rating_modal' });
	};

	const handleSubmitRating = async (rating: number, reviewText?: string) => {
		if (!selectedLocation) return;
		
		try {
			await createRating(selectedLocation.id, rating, reviewText);
			showSuccessToast('Đánh giá thành công!');
			setShowRatingModal(false);
			setSelectedLocation(null);
		} catch (error) {
			showErrorToast('Không thể gửi đánh giá');
		}
	};

	const handleLocationClick = (location: Location) => {
		track(location.id, 'click', { from: 'tour_card' });
		// Navigate to detail page...
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Khám phá Việt Nam 🇻🇳
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Những điểm đến tuyệt vời được gợi ý dành riêng cho bạn
					</p>
				</div>

				{/* Filters */}
				<div className="bg-white rounded-xl shadow-md p-6 mb-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Category Filter */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Loại hình du lịch
							</label>
							<div className="flex flex-wrap gap-2">
								{categories.map(category => (
									<button
										key={category}
										onClick={() => setSelectedCategory(category)}
										className={`px-4 py-2 rounded-lg font-medium transition-colors ${
											selectedCategory === category
												? 'bg-emerald-600 text-white'
												: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
										}`}
									>
										{category === 'all' ? 'Tất cả' : category}
									</button>
								))}
							</div>
						</div>

						{/* Region Filter */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Vùng miền
							</label>
							<div className="flex flex-wrap gap-2">
								{regions.map(region => (
									<button
										key={region}
										onClick={() => setSelectedRegion(region)}
										className={`px-4 py-2 rounded-lg font-medium transition-colors ${
											selectedRegion === region
												? 'bg-blue-600 text-white'
												: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
										}`}
									>
										{region === 'all' ? 'Tất cả' : region}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Results count */}
				<div className="mb-6">
					<p className="text-gray-600">
						Tìm thấy <span className="font-semibold text-emerald-600">{filteredLocations.length}</span> điểm đến
					</p>
				</div>

				{/* Locations Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{filteredLocations.map(location => {
						const userRating = getUserRating(location.id);
						const isFav = isFavorited(location.id);

						return (
							<div
								key={location.id}
								className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
							>
								{/* Image */}
								<div className="relative h-56 overflow-hidden">
									<img
										src={location.image}
										alt={location.name}
										className="w-full h-full object-cover"
										onError={(e) => {
											e.currentTarget.src = '/gallery/room1.jpg'; // Fallback image
										}}
									/>
									<div className="absolute top-3 right-3">
										<FavoriteButton
											isFavorited={isFav}
											onToggle={() => handleFavoriteToggle(location.id)}
										/>
									</div>
									<div className="absolute bottom-3 left-3">
										<span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-emerald-600">
											{location.category}
										</span>
									</div>
								</div>

								{/* Content */}
								<div className="p-6">
									<h3 className="text-xl font-bold text-gray-900 mb-2">
										{location.name}
									</h3>
									<p className="text-gray-600 text-sm mb-4 line-clamp-2">
										{location.description}
									</p>

									{/* Stats */}
									<div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
										<div className="flex items-center gap-1">
											<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
											<span className="font-medium">{location.rating}</span>
											<span className="text-gray-400">({location.reviews})</span>
										</div>
										<div className="flex items-center gap-1">
											<MapPin className="w-4 h-4" />
											<span>{location.region}</span>
										</div>
									</div>

									{/* Rating Section */}
									<div className="flex items-center gap-3 mb-3">
										<RatingStars
											initialRating={userRating?.rating || 0}
											onRate={(rating) => createRating(location.id, rating)}
											size="sm"
										/>
										{userRating && (
											<span className="text-xs text-emerald-600 font-medium">
												Bạn đã đánh giá: {userRating.rating.toFixed(1)} ⭐
											</span>
										)}
									</div>

									{/* Price & Duration */}
									<div className="flex items-center justify-between mb-4 text-sm">
										<div className="flex items-center gap-1 text-gray-600">
											<Clock className="w-4 h-4" />
											<span>{location.duration}</span>
										</div>
										<div className="flex items-center gap-1 text-emerald-600 font-semibold">
											<DollarSign className="w-4 h-4" />
											<span>{location.price}</span>
										</div>
									</div>

									{/* Actions */}
									<div className="flex gap-2">
										<button
											onClick={() => handleLocationClick(location)}
											className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
										>
											Xem chi tiết
										</button>
										<button
											onClick={() => handleOpenRatingModal(location)}
											className="px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
										>
											Đánh giá
										</button>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Empty state */}
				{filteredLocations.length === 0 && (
					<div className="text-center py-12">
						<p className="text-gray-500 text-lg">
							Không tìm thấy điểm đến phù hợp. Thử thay đổi bộ lọc!
						</p>
					</div>
				)}
			</div>

			{/* Rating Modal */}
			{selectedLocation && (
				<RatingModal
					isOpen={showRatingModal}
					onClose={() => {
						setShowRatingModal(false)
						setSelectedLocation(null)
					}}
					destinationName={selectedLocation.name}
					destinationId={selectedLocation.id}
					userId={userId}
					initialRating={getUserRating(selectedLocation.id)?.rating || 0}
					initialReview={getUserRating(selectedLocation.id)?.review_text || ''}
					onSubmit={handleSubmitRating}
				/>
			)}
		</div>
	);
}
