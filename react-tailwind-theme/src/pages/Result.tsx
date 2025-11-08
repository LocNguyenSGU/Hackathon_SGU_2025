import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	Trophy,
	MapPin,
	Sparkles,
	Target,
	Clock,
	DollarSign,
	Navigation,
	Star,
	Calendar,
	Users,
	ArrowRight,
	Share2,
	RotateCcw,
	Loader2,
	Map as MapIcon,
	Info,
	Wifi,
	Car,
	Utensils,
	Coffee,
	AlertCircle
} from 'lucide-react'

interface Location {
	id: number
	name: string
	type: string
	latitude: number
	longitude: number
	location_address: string
	price: number
	visit_time: number
	travel_time: number
	score: number
	opening_hours: string
	facilities: string[]
}

interface TourRoute {
	success: boolean
	route: Location[]
	total_locations: number
	total_time: number
	total_distance: number
	total_score: number
	total_cost: number
	avg_score: number
	message: string | null
}

interface QuizResult {
	user_type?: string
	description?: string
	score?: number
	insights?: string[]
	recommendations?: string[]
	tour_route?: TourRoute
	[key: string]: any
}

export default function Result() {
	const navigate = useNavigate()
	const [result, setResult] = useState<QuizResult | null>(null)
	const [loading, setLoading] = useState(true)
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
	const [showMap, setShowMap] = useState(false)

	useEffect(() => {
		const storedResult = localStorage.getItem('quizResult')
		if (storedResult) {
			const parsedResult = JSON.parse(storedResult)

			// Demo data - replace with actual API response
			const demoTourRoute: TourRoute = {
				success: true,
				route: [
					{
						id: 15,
						name: "Landmark 81 Skyview",
						type: "Adventure",
						latitude: 10.7946,
						longitude: 106.7217,
						location_address: "720A Đ. Điện Biên Phủ, Vinhomes Tân Cảng, Bình Thạnh, TP.HCM",
						price: 250000,
						visit_time: 90,
						travel_time: 4,
						score: 0.641,
						opening_hours: "09:00-22:00",
						facilities: ["parking", "restroom", "wifi", "restaurant"]
					},
					{
						id: 7,
						name: "Bitexco Financial Tower - Saigon Skydeck",
						type: "Adventure",
						latitude: 10.7717,
						longitude: 106.7038,
						location_address: "36 Hồ Tung Mậu, Bến Nghé, Quận 1, TP.HCM",
						price: 200000,
						visit_time: 90,
						travel_time: 4,
						score: 0.641,
						opening_hours: "09:30-21:30",
						facilities: ["parking", "restroom", "wifi", "restaurant"]
					},
					{
						id: 20,
						name: "Chợ Nổi Cái Răng",
						type: "Adventure",
						latitude: 10.0377,
						longitude: 105.7835,
						location_address: "Cái Răng, Cần Thơ (Tour từ TP.HCM)",
						price: 500000,
						visit_time: 360,
						travel_time: 194,
						score: 0.573,
						opening_hours: "05:00-09:00",
						facilities: ["boat", "guide", "restaurant"]
					},
					{
						id: 13,
						name: "Chùa Vĩnh Nghiêm",
						type: "Cultural",
						latitude: 10.7981,
						longitude: 106.6833,
						location_address: "339 Nam Kỳ Khởi Nghĩa, Phường 7, Quận 3, TP.HCM",
						price: 0,
						visit_time: 60,
						travel_time: 194,
						score: 0.344,
						opening_hours: "06:00-18:00",
						facilities: ["parking", "restroom"]
					},
					{
						id: 1,
						name: "Nhà Thờ Đức Bà",
						type: "Cultural",
						latitude: 10.7797,
						longitude: 106.699,
						location_address: "01 Công xã Paris, Bến Nghé, Quận 1, TP.HCM",
						price: 0,
						visit_time: 60,
						travel_time: 1,
						score: 0.344,
						opening_hours: "08:00-17:00",
						facilities: ["parking", "restroom"]
					},
					{
						id: 11,
						name: "Bưu Điện Trung Tâm Sài Gòn",
						type: "Cultural",
						latitude: 10.7798,
						longitude: 106.6995,
						location_address: "02 Công xã Paris, Bến Nghé, Quận 1, TP.HCM",
						price: 0,
						visit_time: 45,
						travel_time: 0,
						score: 0.345,
						opening_hours: "07:00-19:00",
						facilities: ["restroom", "wifi", "shop"]
					}
				],
				total_locations: 6,
				total_time: 1210,
				total_distance: 268.55,
				total_score: 3.577,
				total_cost: 950000,
				avg_score: 0.447,
				message: null
			}

			parsedResult.tour_route = demoTourRoute
			setResult(parsedResult)
			setLoading(false)
		} else {
			navigate('/quiz')
		}
	}, [navigate])

	const handleRetakeQuiz = () => {
		localStorage.removeItem('quizResult')
		navigate('/quiz')
	}

	const handleShareResult = () => {
		if (navigator.share) {
			navigator.share({
				title: 'Kết quả trắc nghiệm du lịch',
				text: `Tôi là ${result?.user_type || 'một du khách'}! Khám phá ${result?.tour_route?.total_locations} địa điểm tuyệt vời tại TP.HCM`,
				url: window.location.href,
			})
		} else {
			const shareText = `Tôi là ${result?.user_type || 'một du khách'}! Khám phá phong cách du lịch của bạn tại AI Tour Planner`
			navigator.clipboard.writeText(shareText)
			alert('Đã sao chép vào clipboard!')
		}
	}

	const getFacilityIcon = (facility: string) => {
		switch (facility.toLowerCase()) {
			case 'wifi': return <Wifi className="w-4 h-4" />
			case 'parking':
			case 'car': return <Car className="w-4 h-4" />
			case 'restaurant':
			case 'food': return <Utensils className="w-4 h-4" />
			case 'cafe':
			case 'coffee': return <Coffee className="w-4 h-4" />
			default: return <Info className="w-4 h-4" />
		}
	}

	const getTypeColor = (type: string) => {
		switch (type.toLowerCase()) {
			case 'adventure': return 'from-orange-500 to-red-500'
			case 'cultural': return 'from-purple-500 to-pink-500'
			case 'relaxation': return 'from-green-500 to-teal-500'
			default: return 'from-blue-500 to-cyan-500'
		}
	}

	const formatTime = (minutes: number) => {
		const hours = Math.floor(minutes / 60)
		const mins = minutes % 60
		if (hours > 0) {
			return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
		}
		return `${mins}m`
	}

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND'
		}).format(amount)
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
					<p className="text-gray-600">Đang tải kết quả...</p>
				</div>
			</div>
		)
	}

	if (!result) return null

	const tourRoute = result.tour_route

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
			<div className="max-w-7xl mx-auto">
				{/* Hero Section */}
				<div className="text-center mb-12">
					<div className="inline-block mb-6">
						<div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
							<Trophy className="w-12 h-12 text-white" />
						</div>
					</div>
					<h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
						Kết quả của bạn
					</h1>
					<div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-600 px-6 py-3 rounded-full text-lg font-semibold">
						<Sparkles className="w-6 h-6" />
						<span>Phân tích hoàn tất!</span>
					</div>
				</div>

				{/* Personality Type Card */}
				<div className="bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl p-8 md:p-12 text-white mb-8 shadow-2xl">
					<div className="flex flex-col md:flex-row items-center gap-6">
						<div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
							<Target className="w-10 h-10" />
						</div>
						<div className="text-center md:text-left flex-1">
							<h2 className="text-3xl md:text-4xl font-bold mb-2">
								{result.user_type || 'Du khách khám phá'}
							</h2>
							<p className="text-white/90 text-lg">
								{result.description || 'Bạn là người thích khám phá và trải nghiệm những điều mới mẻ'}
							</p>
						</div>
					</div>
				</div>

				{/* Tour Summary */}
				{tourRoute && (
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
						<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
							<div className="flex items-center gap-3 mb-2">
								<MapPin className="w-6 h-6 text-emerald-600" />
								<span className="text-sm text-gray-500">Địa điểm</span>
							</div>
							<p className="text-3xl font-bold text-gray-900">{tourRoute.total_locations}</p>
						</div>
						<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
							<div className="flex items-center gap-3 mb-2">
								<Clock className="w-6 h-6 text-blue-600" />
								<span className="text-sm text-gray-500">Thời gian</span>
							</div>
							<p className="text-3xl font-bold text-gray-900">{formatTime(tourRoute.total_time)}</p>
						</div>
						<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
							<div className="flex items-center gap-3 mb-2">
								<Navigation className="w-6 h-6 text-purple-600" />
								<span className="text-sm text-gray-500">Quãng đường</span>
							</div>
							<p className="text-3xl font-bold text-gray-900">{tourRoute.total_distance.toFixed(1)} km</p>
						</div>
						<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
							<div className="flex items-center gap-3 mb-2">
								<DollarSign className="w-6 h-6 text-orange-600" />
								<span className="text-sm text-gray-500">Chi phí</span>
							</div>
							<p className="text-2xl font-bold text-gray-900">{formatCurrency(tourRoute.total_cost)}</p>
						</div>
					</div>
				)}

				{/* Map Section */}
				{tourRoute && tourRoute.route.length > 0 && (
					<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
									<MapIcon className="w-6 h-6 text-white" />
								</div>
								<h3 className="text-2xl font-bold text-gray-900">
									Lộ trình gợi ý cho bạn
								</h3>
							</div>
							<button
								onClick={() => setShowMap(!showMap)}
								className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors flex items-center gap-2"
							>
								<MapIcon className="w-4 h-4" />
								{showMap ? 'Ẩn bản đồ' : 'Xem bản đồ'}
							</button>
						</div>

						{/* Map Placeholder */}
						{showMap && (
							<div className="mb-6 rounded-xl overflow-hidden border-2 border-gray-200">
								<div className="relative w-full h-96 bg-gradient-to-br from-blue-100 to-emerald-100">
									<img
										src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/106.6297,10.8231,11,0/1200x400@2x?access_token=pk.eyJ1IjoiZHVsYW0xNSIsImEiOiJjbTNsbDA3OWswMDZxMnJvcmFzNTBzZmdwIn0.wkXpIuD7AUvGq0Lx-7j_hQ"
										alt="Map"
										className="w-full h-full object-cover"
									/>
									<div className="absolute inset-0 flex items-center justify-center bg-black/10">
										<div className="bg-white/90 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg">
											<p className="text-gray-800 font-semibold flex items-center gap-2">
												<MapPin className="w-5 h-5 text-emerald-600" />
												{tourRoute.total_locations} điểm đến trên bản đồ
											</p>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Tour Route Timeline */}
						<div className="space-y-4">
							{tourRoute.route.map((location, index) => (
								<div
									key={location.id}
									className="group relative bg-gradient-to-r from-white to-slate-50 rounded-xl p-6 border-2 border-gray-200 hover:border-emerald-500 transition-all duration-300 hover:shadow-xl"
								>
									{/* Timeline connector */}
									{index < tourRoute.route.length - 1 && (
										<div className="absolute left-8 top-full w-0.5 h-4 bg-gradient-to-b from-emerald-500 to-blue-500 z-10"></div>
									)}

									<div className="flex gap-6">
										{/* Step Number */}
										<div className="flex-shrink-0">
											<div className={`w-16 h-16 bg-gradient-to-br ${getTypeColor(location.type)} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
												{index + 1}
											</div>
										</div>

										{/* Content */}
										<div className="flex-1">
											<div className="flex items-start justify-between mb-3">
												<div className="flex-1">
													<h4 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
														{location.name}
													</h4>
													<div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
														<MapPin className="w-4 h-4" />
														<span>{location.location_address}</span>
													</div>
												</div>
												<span className={`px-3 py-1 bg-gradient-to-r ${getTypeColor(location.type)} text-white text-xs font-semibold rounded-full`}>
													{location.type}
												</span>
											</div>

											{/* Info Grid */}
											<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
												<div className="flex items-center gap-2">
													<Clock className="w-4 h-4 text-blue-600" />
													<div>
														<p className="text-xs text-gray-500">Thời gian tham quan</p>
														<p className="text-sm font-semibold text-gray-900">{formatTime(location.visit_time)}</p>
													</div>
												</div>
												<div className="flex items-center gap-2">
													<Navigation className="w-4 h-4 text-purple-600" />
													<div>
														<p className="text-xs text-gray-500">Thời gian di chuyển</p>
														<p className="text-sm font-semibold text-gray-900">{formatTime(location.travel_time)}</p>
													</div>
												</div>
												<div className="flex items-center gap-2">
													<DollarSign className="w-4 h-4 text-orange-600" />
													<div>
														<p className="text-xs text-gray-500">Giá vé</p>
														<p className="text-sm font-semibold text-gray-900">
															{location.price === 0 ? 'Miễn phí' : formatCurrency(location.price)}
														</p>
													</div>
												</div>
												<div className="flex items-center gap-2">
													<Star className="w-4 h-4 text-yellow-500" />
													<div>
														<p className="text-xs text-gray-500">Điểm phù hợp</p>
														<p className="text-sm font-semibold text-gray-900">{(location.score * 100).toFixed(0)}%</p>
													</div>
												</div>
											</div>

											{/* Opening Hours & Facilities */}
											<div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200">
												<div className="flex items-center gap-2 text-sm text-gray-600">
													<Clock className="w-4 h-4" />
													<span>Giờ mở cửa: {location.opening_hours}</span>
												</div>
												<div className="flex items-center gap-2">
													{location.facilities.slice(0, 4).map((facility, idx) => (
														<div
															key={idx}
															className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600"
															title={facility}
														>
															{getFacilityIcon(facility)}
															<span className="hidden sm:inline">{facility}</span>
														</div>
													))}
													{location.facilities.length > 4 && (
														<span className="text-xs text-gray-500">+{location.facilities.length - 4} more</span>
													)}
												</div>
											</div>

											{/* View Details Button */}
											<button
												onClick={() => setSelectedLocation(location)}
												className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
											>
												<Info className="w-4 h-4" />
												Xem chi tiết
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Action Buttons */}
				<div className="grid md:grid-cols-2 gap-4 mb-8">
					<button
						onClick={handleRetakeQuiz}
						className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-all duration-200 hover:scale-105"
					>
						<RotateCcw className="w-5 h-5" />
						Làm lại trắc nghiệm
					</button>

					<button
						onClick={handleShareResult}
						className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-200 hover:scale-105"
					>
						<Share2 className="w-5 h-5" />
						Chia sẻ lộ trình
					</button>
				</div>

				{/* CTA Section */}
				<div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-center text-white shadow-2xl">
					<h3 className="text-3xl font-bold mb-4">
						Sẵn sàng bắt đầu hành trình?
					</h3>
					<p className="text-white/90 text-lg mb-6">
						{tourRoute ? `${tourRoute.total_locations} địa điểm tuyệt vời đang chờ bạn khám phá!` : 'Khám phá các tour du lịch phù hợp với bạn'}
					</p>
					<button
						onClick={() => navigate('/vr-tour')}
						className="group px-8 py-4 bg-white text-emerald-600 font-bold rounded-full text-lg hover:scale-105 transition-all duration-200 inline-flex items-center gap-2 shadow-lg"
					>
						Trải nghiệm VR 360°
						<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
					</button>
				</div>
			</div>

			{/* Location Detail Modal */}
			{selectedLocation && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
						<div className={`bg-gradient-to-r ${getTypeColor(selectedLocation.type)} p-6 text-white`}>
							<div className="flex items-start justify-between">
								<div>
									<h3 className="text-2xl font-bold mb-2">{selectedLocation.name}</h3>
									<p className="text-white/90">{selectedLocation.location_address}</p>
								</div>
								<button
									onClick={() => setSelectedLocation(null)}
									className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
								>
									<AlertCircle className="w-6 h-6" />
								</button>
							</div>
						</div>
						<div className="p-6">
							<div className="grid grid-cols-2 gap-4 mb-6">
								<div className="bg-gray-50 rounded-lg p-4">
									<p className="text-sm text-gray-500 mb-1">Giá vé</p>
									<p className="text-xl font-bold text-gray-900">
										{selectedLocation.price === 0 ? 'Miễn phí' : formatCurrency(selectedLocation.price)}
									</p>
								</div>
								<div className="bg-gray-50 rounded-lg p-4">
									<p className="text-sm text-gray-500 mb-1">Thời gian tham quan</p>
									<p className="text-xl font-bold text-gray-900">{formatTime(selectedLocation.visit_time)}</p>
								</div>
								<div className="bg-gray-50 rounded-lg p-4">
									<p className="text-sm text-gray-500 mb-1">Giờ mở cửa</p>
									<p className="text-xl font-bold text-gray-900">{selectedLocation.opening_hours}</p>
								</div>
								<div className="bg-gray-50 rounded-lg p-4">
									<p className="text-sm text-gray-500 mb-1">Điểm phù hợp</p>
									<p className="text-xl font-bold text-gray-900">{(selectedLocation.score * 100).toFixed(0)}%</p>
								</div>
							</div>

							<div className="mb-6">
								<h4 className="font-bold text-gray-900 mb-3">Tiện ích</h4>
								<div className="flex flex-wrap gap-2">
									{selectedLocation.facilities.map((facility, idx) => (
										<div
											key={idx}
											className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg"
										>
											{getFacilityIcon(facility)}
											<span className="capitalize">{facility}</span>
										</div>
									))}
								</div>
							</div>

							<button
								onClick={() => setSelectedLocation(null)}
								className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
							>
								Đóng
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}