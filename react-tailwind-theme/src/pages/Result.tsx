import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	MapPin,
	Clock,
	DollarSign,
	Navigation,
	ArrowRight,
	Map as MapIcon,
	Share2,
	RotateCcw,
	Loader2,
	CheckCircle
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

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	useEffect(() => {
		const storedResult = localStorage.getItem('quizResult')
		if (storedResult) {
			const parsedResult = JSON.parse(storedResult)

			const demoTourRoute: TourRoute = {
				success: true,
				route: [
					{
						id: 15,
						name: "Landmark 81 Skyview",
						type: "Adventure",
						latitude: 10.7946,
						longitude: 106.7217,
						location_address: "720A Đ. Điện Biên Phủ, Bình Thạnh",
						price: 250000,
						visit_time: 90,
						travel_time: 4,
						score: 0.85,
						opening_hours: "09:00-22:00",
						facilities: []
					},
					{
						id: 7,
						name: "Bitexco Financial Tower",
						type: "Adventure",
						latitude: 10.7717,
						longitude: 106.7038,
						location_address: "36 Hồ Tung Mậu, Quận 1",
						price: 200000,
						visit_time: 90,
						travel_time: 15,
						score: 0.82,
						opening_hours: "09:30-21:30",
						facilities: []
					},
					{
						id: 1,
						name: "Nhà Thờ Đức Bà",
						type: "Cultural",
						latitude: 10.7797,
						longitude: 106.699,
						location_address: "Bến Nghé, Quận 1",
						price: 0,
						visit_time: 60,
						travel_time: 10,
						score: 0.78,
						opening_hours: "08:00-17:00",
						facilities: []
					},
					{
						id: 11,
						name: "Bưu Điện Trung Tâm",
						type: "Cultural",
						latitude: 10.7798,
						longitude: 106.6995,
						location_address: "Công xã Paris, Quận 1",
						price: 0,
						visit_time: 45,
						travel_time: 5,
						score: 0.75,
						opening_hours: "07:00-19:00",
						facilities: []
					}
				],
				total_locations: 4,
				total_time: 319,
				total_distance: 15.5,
				total_score: 3.2,
				total_cost: 450000,
				avg_score: 0.8,
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

	const handleViewMap = () => {
		if (result?.tour_route) {
			localStorage.setItem('tourRoute', JSON.stringify(result.tour_route))
			navigate('/map')
		}
	}

	const handleShareResult = () => {
		if (navigator.share) {
			navigator.share({
				title: 'Kết quả trắc nghiệm du lịch',
				text: `Khám phá ${result?.tour_route?.total_locations} địa điểm tại TP.HCM`,
				url: window.location.href,
			})
		} else {
			navigator.clipboard.writeText(window.location.href)
			alert('Đã sao chép link!')
		}
	}

	const formatTime = (minutes: number) => {
		const hours = Math.floor(minutes / 60)
		const mins = minutes % 60
		return hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}m` : ''}` : `${mins}m`
	}

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('vi-VN').format(amount) + 'đ'
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto mb-3" />
					<p className="text-gray-600 text-sm">Đang tải kết quả...</p>
				</div>
			</div>
		)
	}

	if (!result) return null

	const tourRoute = result.tour_route

	return (
		<div className="min-h-screen bg-gradient-to-br  from-emerald-50 to-blue-50 py-6 mt-[60px] px-4">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100 mb-4">
					<div className="flex items-start gap-3">
						<div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
							<CheckCircle className="w-6 h-6 text-white" />
						</div>
						<div className="flex-1">
							<h1 className="text-xl font-bold text-gray-900 mb-1">
								{result.user_type || 'Lộ trình của bạn'}
							</h1>
							<p className="text-sm text-gray-600">
								{result.description}
							</p>
						</div>
					</div>
				</div>

				{/* Stats */}
				{tourRoute && (
					<div className="grid grid-cols-4 gap-2 mb-4">
						<div className="bg-white rounded-lg p-3 border border-emerald-100 shadow-sm">
							<div className="flex items-center gap-1.5 mb-1">
								<MapPin className="w-3.5 h-3.5 text-emerald-600" />
								<span className="text-xs text-gray-600">Điểm</span>
							</div>
							<p className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
								{tourRoute.total_locations}
							</p>
						</div>
						<div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm">
							<div className="flex items-center gap-1.5 mb-1">
								<Clock className="w-3.5 h-3.5 text-blue-600" />
								<span className="text-xs text-gray-600">T.gian</span>
							</div>
							<p className="text-xl font-bold text-blue-600">
								{formatTime(tourRoute.total_time)}
							</p>
						</div>
						<div className="bg-white rounded-lg p-3 border border-emerald-100 shadow-sm">
							<div className="flex items-center gap-1.5 mb-1">
								<Navigation className="w-3.5 h-3.5 text-emerald-600" />
								<span className="text-xs text-gray-600">K.cách</span>
							</div>
							<p className="text-lg font-bold text-emerald-600">
								{tourRoute.total_distance.toFixed(1)}km
							</p>
						</div>
						<div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm">
							<div className="flex items-center gap-1.5 mb-1">
								<DollarSign className="w-3.5 h-3.5 text-blue-600" />
								<span className="text-xs text-gray-600">Chi phí</span>
							</div>
							<p className="text-base font-bold text-blue-600">
								{formatCurrency(tourRoute.total_cost)}
							</p>
						</div>
					</div>
				)}

				{/* Tour List */}
				{tourRoute && tourRoute.route.length > 0 && (
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
						<div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-3 flex items-center justify-between">
							<h3 className="text-sm font-semibold text-white">
								Danh sách địa điểm
							</h3>
							<button
								onClick={handleViewMap}
								className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-medium rounded-lg transition-colors"
							>
								<MapIcon className="w-3.5 h-3.5" />
								Xem bản đồ
							</button>
						</div>

						<div className="divide-y divide-gray-100">
							{tourRoute.route.map((location, index) => (
								<div
									key={location.id}
									className="p-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 transition-colors"
								>
									<div className="flex gap-3">
										<div className="flex-shrink-0">
											<div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-blue-500 text-white rounded-lg flex items-center justify-center text-xs font-semibold shadow-sm">
												{index + 1}
											</div>
										</div>

										<div className="flex-1 min-w-0">
											<h4 className="text-sm font-semibold text-gray-900 mb-0.5">
												{location.name}
											</h4>
											<p className="text-xs text-gray-500 mb-2 flex items-start gap-1">
												<MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-emerald-600" />
												<span className="line-clamp-1">{location.location_address}</span>
											</p>

											<div className="flex flex-wrap gap-2 text-xs">
												<span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-0.5 rounded">
													<Clock className="w-3 h-3 text-blue-600" />
													{formatTime(location.visit_time)}
												</span>
												<span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-0.5 rounded">
													<Navigation className="w-3 h-3 text-emerald-600" />
													{formatTime(location.travel_time)}
												</span>
												<span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-0.5 rounded">
													<DollarSign className="w-3 h-3 text-blue-600" />
													{location.price === 0 ? 'Miễn phí' : formatCurrency(location.price)}
												</span>
												<span className="text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
													{location.opening_hours}
												</span>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Actions */}
				<div className="flex flex-wrap gap-2">
					<button
						onClick={handleRetakeQuiz}
						className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-colors"
					>
						<RotateCcw className="w-3.5 h-3.5" />
						Làm lại
					</button>

					<button
						onClick={handleShareResult}
						className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors"
					>
						<Share2 className="w-3.5 h-3.5" />
						Chia sẻ
					</button>

					<button
						onClick={() => navigate('/vr-tour')}
						className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-colors shadow-sm ml-auto"
					>
						Trải nghiệm VR
						<ArrowRight className="w-3.5 h-3.5" />
					</button>
				</div>
			</div>
		</div>
	)
}