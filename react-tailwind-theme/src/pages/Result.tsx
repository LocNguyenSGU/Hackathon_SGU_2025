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
	CheckCircle,
	Tag as TagIcon,
	Sparkles,
	Star,
	ChevronRight,
	ArrowLeft
} from 'lucide-react'

interface Tag {
	tag_id: number
	tag_name: string
	tag_display_name: string
	tag_category: string
	description: string
	icon: string
	is_active: boolean
}

interface QuizResult {
	user_type: string
	description: string
	score?: number
	insights?: string[]
	recommendations?: string[]
}

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

export default function Result() {
	const navigate = useNavigate()
	const [result, setResult] = useState<QuizResult | null>(null)
	const [tags, setTags] = useState<Tag[]>([])
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [loading, setLoading] = useState(true)
	const [loadingTags, setLoadingTags] = useState(false)
	const [recommendations, setRecommendations] = useState<TourRecommendation | null>(null)
	const [showRecommendations, setShowRecommendations] = useState(false)
	const [submittingRecommendation, setSubmittingRecommendation] = useState(false)

	// Form data for tour recommendation
	const [formData, setFormData] = useState({
		budget: '1000000',
		time_available: '8',
		max_locations: '6'
	})

	// Budget range state (separate from formData)
	const [budgetRange, setBudgetRange] = useState({
		min: '500000',
		max: '1500000'
	})

	useEffect(() => {
		const storedResult = localStorage.getItem('quizResult')
		if (storedResult) {
			const parsedResult = JSON.parse(storedResult)
			setResult(parsedResult)
			setLoading(false)

			// Auto fetch tags after getting result
			fetchTags()
		} else {
			navigate('/quiz')
		}
	}, [navigate])

	const fetchTags = async () => {
		setLoadingTags(true)
		try {
			const response = await fetch('http://localhost:8000/api/v1/tags')
			const data = await response.json()
			setTags(data.tags || [])
		} catch (error) {
			console.error('Error fetching tags:', error)
		} finally {
			setLoadingTags(false)
		}
	}

	const handleTagToggle = (tagName: string) => {
		setSelectedTags(prev =>
			prev.includes(tagName)
				? prev.filter(t => t !== tagName)
				: [...prev, tagName]
		)
	}

	const handleBudgetRangeChange = (min: string, max: string) => {
		const minVal = parseInt(min) || 0
		const maxVal = parseInt(max) || 0
		const avgBudget = Math.round((minVal + maxVal) / 2)
		setBudgetRange({ min, max })
		setFormData({ ...formData, budget: avgBudget.toString() })
	}

	const handleGetRecommendations = async () => {
		if (selectedTags.length === 0) {
			alert('Vui lòng chọn ít nhất 1 tag!')
			return
		}

		const payload = {
			user_profile: {
				name: localStorage.getItem('username') || 'Guest',
				type: result?.user_type,
				preference: selectedTags,
				budget: parseInt(formData.budget),
				time_available: parseInt(formData.time_available),
				max_locations: parseInt(formData.max_locations)
			}
		}

		try {
			setSubmittingRecommendation(true)
			const response = await fetch('http://localhost:8000/api/v1/tours/recommend', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload)
			})

			const recommendationsData = await response.json();

			console.log("recommendationsData", recommendationsData);

			if (recommendationsData.route) {
				if (recommendationsData.route.length > 0) {
					setRecommendations(recommendationsData);
					console.log("Lộ trình gợi ý đã được thiết lập:", recommendationsData);
					console.log("Lộ trình route:", recommendationsData.route);
				} else {
					console.error("Lỗi khi lấy lộ trình:", recommendationsData);
					// Nếu là object chứa thông báo lỗi
					setRecommendations([]);
					console.warn("Không tìm thấy lộ trình phù hợp:", recommendationsData.detail);
				}
			} else {
				setRecommendations([]);
			}
			setShowRecommendations(true)
		} catch (error) {
			console.error('Error getting recommendations:', error)
			alert('Không thể lấy gợi ý tour. Vui lòng thử lại!')
		} finally {
			setSubmittingRecommendation(false)
		}
	}

	const handleViewMap = () => {
		if (recommendations) {
			console.log("recommendations",recommendations);
			localStorage.setItem('tourRoute', JSON.stringify(recommendations))
			navigate('/map')
		}
	}

	const handleBackToTagSelection = () => {
		setShowRecommendations(false)
	}

	const formatTime = (minutes: number) => {
		const hours = Math.floor(minutes / 60)
		const mins = minutes % 60
		return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
	}

	const formatCurrency = (amount: string | number) => {
		const num = typeof amount === 'string' ? parseInt(amount) : amount
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num)
	}

	const groupedTags = tags.reduce((acc, tag) => {
		if (!acc[tag.tag_category]) {
			acc[tag.tag_category] = []
		}
		acc[tag.tag_category].push(tag)
		return acc
	}, {} as Record<string, Tag[]>)

	const categoryNames: Record<string, string> = {
		'interest': 'Sở thích',
		'activity': 'Hoạt động',
		'atmosphere': 'Không khí'
	}

	if (loading && !result) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center pt-16">
				<div className="text-center">
					<Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto mb-3" />
					<p className="text-gray-600 text-sm">Đang tải kết quả...</p>
				</div>
			</div>
		)
	}

	if (!result) return null

	// Show Recommendations
	if (showRecommendations && recommendations) {
		return (
			<div className="min-h-screen bg-gray-50 py-6 px-4 pt-20">
				<div className="max-w-5xl mx-auto">
					{/* Header */}
					<div className="mb-6">
						<button
							onClick={handleBackToTagSelection}
							className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm"
						>
							<ArrowLeft className="w-4 h-4" />
							Quay lại chỉnh sửa
						</button>
						<h1 className="text-2xl font-bold text-gray-900 mb-2">
							Gợi ý tour cho bạn
						</h1>
						<p className="text-sm text-gray-600">
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
							<p className="text-2xl font-bold text-gray-900">{recommendations.total_distance} km</p>
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
							{
								recommendations.route && recommendations.route.length > 0 ? recommendations.route.map((location, index) => (
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
											<div className="flex flex-wrap gap-2 text-xs">
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
							))
								: (<div className="p-4">
									<p className="text-gray-500">Không tìm thấy lộ trình phù hợp với yêu cầu của bạn.</p>
								</div>)}
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

	// Show Tag Selection (Default View)
	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-6 px-4 pt-20">
			<div className="max-w-5xl mx-auto">
				{/* Result Card */}
				<div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100 mb-6">
					<div className="flex items-start gap-4">
						<div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
							<CheckCircle className="w-6 h-6 text-white" />
						</div>
						<div className="flex-1">
							<h1 className="text-2xl font-bold text-gray-900 mb-2">
								Tính cách du lịch của bạn là: {result.user_type}
							</h1>
							<p className="text-gray-600">{result.description}</p>
						</div>
					</div>
				</div>

				{/* Configuration */}
				<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
					<h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
						<MapIcon className="w-5 h-5 text-emerald-600" />
						Cấu hình tour
					</h2>
					<div className="space-y-6">
						{/* Budget Range */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Khoảng ngân sách (VNĐ)
							</label>
							<div className="grid grid-cols-2 gap-3 mb-3">
								<div>
									<input
										type="number"
										value={budgetRange.min}
										onChange={(e) => handleBudgetRangeChange(e.target.value, budgetRange.max)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
										placeholder="Tối thiểu"
									/>
									<p className="text-xs text-gray-500 mt-1">Tối thiểu: {formatCurrency(budgetRange.min)}</p>
								</div>
								<div>
									<input
										type="number"
										value={budgetRange.max}
										onChange={(e) => handleBudgetRangeChange(budgetRange.min, e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
										placeholder="Tối đa"
									/>
									<p className="text-xs text-gray-500 mt-1">Tối đa: {formatCurrency(budgetRange.max)}</p>
								</div>
							</div>
							<div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
								<p className="text-sm text-emerald-700">
									<span className="font-semibold">Ngân sách trung bình:</span> {formatCurrency(formData.budget)}
								</p>
							</div>
							<div className="mt-3 flex flex-wrap gap-2">
								<button
									onClick={() => handleBudgetRangeChange('500000', '1000000')}
									className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-emerald-100 hover:text-emerald-700 text-gray-700 rounded-lg transition-colors"
								>
									500K - 1M
								</button>
								<button
									onClick={() => handleBudgetRangeChange('1000000', '2000000')}
									className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-emerald-100 hover:text-emerald-700 text-gray-700 rounded-lg transition-colors"
								>
									1M - 2M
								</button>
								<button
									onClick={() => handleBudgetRangeChange('2000000', '5000000')}
									className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-emerald-100 hover:text-emerald-700 text-gray-700 rounded-lg transition-colors"
								>
									2M - 5M
								</button>
								<button
									onClick={() => handleBudgetRangeChange('5000000', '10000000')}
									className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-emerald-100 hover:text-emerald-700 text-gray-700 rounded-lg transition-colors"
								>
									5M - 10M
								</button>
							</div>
						</div>

						{/* Time Available */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Thời gian có sẵn (giờ)
							</label>
							<input
								type="number"
								value={formData.time_available}
								onChange={(e) => setFormData({ ...formData, time_available: e.target.value })}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
								placeholder="8"
							/>
							<div className="mt-3 flex flex-wrap gap-2">
								<button
									onClick={() => setFormData({ ...formData, time_available: '4' })}
									className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-700 rounded-lg transition-colors"
								>
									4 giờ (Nửa ngày)
								</button>
								<button
									onClick={() => setFormData({ ...formData, time_available: '8' })}
									className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-700 rounded-lg transition-colors"
								>
									8 giờ (Cả ngày)
								</button>
								<button
									onClick={() => setFormData({ ...formData, time_available: '12' })}
									className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-700 rounded-lg transition-colors"
								>
									12 giờ
								</button>
								<button
									onClick={() => setFormData({ ...formData, time_available: '16' })}
									className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-700 rounded-lg transition-colors"
								>
									16 giờ (2 ngày)
								</button>
							</div>
						</div>

						{/* Max Locations */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Số địa điểm tối đa
							</label>
							<input
								type="number"
								value={formData.max_locations}
								onChange={(e) => setFormData({ ...formData, max_locations: e.target.value })}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
								placeholder="6"
							/>
							<div className="mt-3 flex flex-wrap gap-2">
								<button
									onClick={() => setFormData({ ...formData, max_locations: '3' })}
									className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-purple-100 hover:text-purple-700 text-gray-700 rounded-lg transition-colors"
								>
									3 điểm (Nhẹ nhàng)
								</button>
								<button
									onClick={() => setFormData({ ...formData, max_locations: '5' })}
									className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-purple-100 hover:text-purple-700 text-gray-700 rounded-lg transition-colors"
								>
									5 điểm (Vừa phải)
								</button>
								<button
									onClick={() => setFormData({ ...formData, max_locations: '8' })}
									className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-purple-100 hover:text-purple-700 text-gray-700 rounded-lg transition-colors"
								>
									8 điểm (Nhiều)
								</button>
								<button
									onClick={() => setFormData({ ...formData, max_locations: '10' })}
									className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-purple-100 hover:text-purple-700 text-gray-700 rounded-lg transition-colors"
								>
									10 điểm (Khám phá)
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Tag Selection */}
				<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
							<TagIcon className="w-5 h-5 text-emerald-600" />
							Chọn sở thích của bạn ({selectedTags.length} đã chọn)
						</h2>
					</div>

					{loadingTags ? (
						<div className="text-center py-8">
							<Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
							<p className="text-sm text-gray-600">Đang tải tags...</p>
						</div>
					) : (
						<div className="space-y-6">
							{Object.entries(groupedTags).map(([category, categoryTags]) => (
								<div key={category}>
									<h3 className="text-sm font-semibold text-gray-700 mb-3">
										{categoryNames[category] || category}
									</h3>
									<div className="flex flex-wrap gap-2">
										{categoryTags.map((tag) => (
											<button
												key={tag.tag_id}
												onClick={() => handleTagToggle(tag.tag_name)}
												className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedTags.includes(tag.tag_name)
													? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-md scale-105'
													: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
													}`}
												title={tag.description}
											>
												<span>{tag.tag_display_name}</span>
												{selectedTags.includes(tag.tag_name) && (
													<CheckCircle className="w-4 h-4" />
												)}
											</button>
										))}
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Action Buttons */}
				<div className="flex gap-3">
					<button
						onClick={() => { localStorage.removeItem('quizResult'); navigate('/quiz') }}
						className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
					>
						<RotateCcw className="w-4 h-4" />
						Làm lại
					</button>
					<button
						onClick={handleGetRecommendations}
						disabled={selectedTags.length === 0 || submittingRecommendation}
						className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{submittingRecommendation ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								Đang tạo gợi ý...
							</>
						) : (
							<>
								<Sparkles className="w-5 h-5" />
								Nhận gợi ý tour ({selectedTags.length} tags)
								<ArrowRight className="w-5 h-5" />
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	)
}