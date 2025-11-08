import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	MapPin,
	Clock,
	DollarSign,
	Navigation,
	ArrowLeft,
	Map as MapIcon,
	Calendar,
	Star,
	ChevronRight
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

interface TourRecommendation {
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

export default function TourRecommendations() {
	const navigate = useNavigate()
	const [recommendations, setRecommendations] = useState<TourRecommendation | null>(null)

	useEffect(() => {
		const stored = localStorage.getItem('tourRecommendations')
		if (stored) {
			setRecommendations(JSON.parse(stored))
		} else {
			navigate('/result')
		}
	}, [navigate])

	const formatTime = (minutes: number) => {
		const hours = Math.floor(minutes / 60)
		const mins = minutes % 60
		return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
	}

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
	}

	const handleViewMap = () => {
		if (recommendations) {
			localStorage.setItem('tourRoute', JSON.stringify(recommendations))
			navigate('/map')
		}
	}

	if (!recommendations) {
		return <div>Loading...</div>
	}

	return (
		<div className="min-h-screen bg-gray-50 py-6 px-4 pt-20">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<div className="mb-6">
					<button
						onClick={() => navigate('/result')}
						className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
					>
						<ArrowLeft className="w-4 h-4" />
						Quay lại
					</button>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Gợi ý tour cho bạn
					</h1>
					<p className="text-gray-600">
						{recommendations.total_locations} địa điểm • {formatTime(recommendations.total_time)} • {formatCurrency(recommendations.total_cost)}
					</p>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
					<div className="bg-white rounded-lg p-4 border border-gray-200">
						<div className="flex items-center gap-2 mb-1">
							<MapPin className="w-4 h-4 text-emerald-600" />
							<span className="text-xs text-gray-500">Điểm đến</span>
						</div>
						<p className="text-2xl font-bold text-gray-900">{recommendations.total_locations}</p>
					</div>
					<div className="bg-white rounded-lg p-4 border border-gray-200">
						<div className="flex items-center gap-2 mb-1">
							<Clock className="w-4 h-4 text-blue-600" />
							<span className="text-xs text-gray-500">Thời gian</span>
						</div>
						<p className="text-2xl font-bold text-gray-900">{formatTime(recommendations.total_time)}</p>
					</div>
					<div className="bg-white rounded-lg p-4 border border-gray-200">
						<div className="flex items-center gap-2 mb-1">
							<Navigation className="w-4 h-4 text-purple-600" />
							<span className="text-xs text-gray-500">Khoảng cách</span>
						</div>
						<p className="text-2xl font-bold text-gray-900">{recommendations.total_distance.toFixed(1)} km</p>
					</div>
					<div className="bg-white rounded-lg p-4 border border-gray-200">
						<div className="flex items-center gap-2 mb-1">
							<DollarSign className="w-4 h-4 text-orange-600" />
							<span className="text-xs text-gray-500">Chi phí</span>
						</div>
						<p className="text-xl font-bold text-gray-900">{formatCurrency(recommendations.total_cost)}</p>
					</div>
				</div>

				{/* Locations List */}
				<div className="bg-white rounded-xl border border-gray-200 mb-6">
					<div className="p-4 border-b border-gray-200 flex items-center justify-between">
						<h3 className="text-lg font-semibold text-gray-900">Lộ trình chi tiết</h3>
						<button
							onClick={handleViewMap}
							className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700"
						>
							<MapIcon className="w-4 h-4" />
							Xem bản đồ
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>

					<div className="divide-y divide-gray-100">
						{recommendations.route.map((location, index) => (
							<div key={location.id} className="p-4 hover:bg-gray-50">
								<div className="flex gap-4">
									<div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
										{index + 1}
									</div>
									<div className="flex-1 min-w-0">
										<h4 className="text-base font-semibold text-gray-900 mb-1">
											{location.name}
										</h4>
										<p className="text-sm text-gray-500 mb-3 flex items-start gap-1">
											<MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
											{location.location_address}
										</p>
										<div className="flex flex-wrap gap-3 text-xs">
											<span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded">
												<Clock className="w-3 h-3" />
												{formatTime(location.visit_time)}
											</span>
											<span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded">
												<Navigation className="w-3 h-3" />
												{formatTime(location.travel_time)}
											</span>
											<span className="flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-1 rounded">
												<DollarSign className="w-3 h-3" />
												{location.price === 0 ? 'Miễn phí' : formatCurrency(location.price)}
											</span>
											<span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
												<Star className="w-3 h-3 fill-yellow-600" />
												{(location.score * 100).toFixed(0)}%
											</span>
											<span className="text-gray-500">{location.opening_hours}</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Actions */}
				<div className="flex gap-3">
					<button
						onClick={() => navigate('/vr-tour')}
						className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all"
					>
						Trải nghiệm VR 360°
					</button>
				</div>
			</div>
		</div>
	)
}