import React, { useState, useEffect } from 'react'
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets, Eye, Gauge, Loader2 } from 'lucide-react'

interface WeatherData {
	temp: number
	feels_like: number
	humidity: number
	pressure: number
	wind_speed: number
	visibility: number
	weather: {
		main: string
		description: string
		icon: string
	}
	city: string
	country: string
}

interface WeatherWidgetProps {
	city?: string
	lat?: number
	lon?: number
	showDetails?: boolean
	className?: string
}

export default function WeatherWidget({
	city = 'Hanoi',
	lat,
	lon,
	showDetails = false,
	className = ''
}: WeatherWidgetProps) {
	const [weather, setWeather] = useState<WeatherData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const API_KEY = '53f024cb47047908d35e5f97ddbb3ddd'

	useEffect(() => {
		fetchWeather()
	}, [city, lat, lon])

	const fetchWeather = async () => {
		setLoading(true)
		setError('')

		try {
			let url = ''

			// Use coordinates if provided, otherwise use city name
			if (lat && lon) {
				url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=vi`
			} else {
				url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=vi`
			}

			const response = await fetch(url)

			if (!response.ok) {
				throw new Error('Không thể lấy dữ liệu thời tiết')
			}

			const data = await response.json()

			setWeather({
				temp: Math.round(data.main.temp),
				feels_like: Math.round(data.main.feels_like),
				humidity: data.main.humidity,
				pressure: data.main.pressure,
				wind_speed: data.wind.speed,
				visibility: data.visibility / 1000, // Convert to km
				weather: {
					main: data.weather[0].main,
					description: data.weather[0].description,
					icon: data.weather[0].icon,
				},
				city: data.name,
				country: data.sys.country,
			})
		} catch (err: any) {
			setError(err.message || 'Đã xảy ra lỗi')
		} finally {
			setLoading(false)
		}
	}

	const getWeatherIcon = (weatherMain: string) => {
		switch (weatherMain.toLowerCase()) {
			case 'clear':
				return <Sun className="w-12 h-12 text-yellow-400" />
			case 'clouds':
				return <Cloud className="w-12 h-12 text-slate-400" />
			case 'rain':
			case 'drizzle':
				return <CloudRain className="w-12 h-12 text-blue-400" />
			case 'snow':
				return <CloudSnow className="w-12 h-12 text-blue-200" />
			case 'thunderstorm':
				return <CloudRain className="w-12 h-12 text-purple-400" />
			default:
				return <Cloud className="w-12 h-12 text-slate-400" />
		}
	}

	const getWeatherBackground = (weatherMain: string) => {
		switch (weatherMain.toLowerCase()) {
			case 'clear':
				return 'from-yellow-400 to-orange-400'
			case 'clouds':
				return 'from-slate-400 to-slate-500'
			case 'rain':
			case 'drizzle':
				return 'from-blue-400 to-blue-600'
			case 'snow':
				return 'from-blue-200 to-blue-400'
			case 'thunderstorm':
				return 'from-purple-400 to-purple-600'
			default:
				return 'from-slate-400 to-slate-500'
		}
	}

	if (loading) {
		return (
			<div className={`bg-white rounded-2xl p-6 shadow-lg border border-slate-200 ${className}`}>
				<div className="flex items-center justify-center">
					<Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
					<span className="ml-3 text-slate-600">Đang tải thời tiết...</span>
				</div>
			</div>
		)
	}

	if (error || !weather) {
		return (
			<div className={`bg-white rounded-2xl p-6 shadow-lg border border-red-200 ${className}`}>
				<p className="text-red-600 text-center">{error || 'Không thể tải thời tiết'}</p>
			</div>
		)
	}

	return (
		<div className={`bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden ${className}`}>
			{/* Header */}
			<div className={`bg-gradient-to-r ${getWeatherBackground(weather.weather.main)} p-6 text-white`}>
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-2xl font-bold">{weather.city}, {weather.country}</h3>
						<p className="text-white/90 capitalize mt-1">{weather.weather.description}</p>
					</div>
					<div className="text-right">
						{getWeatherIcon(weather.weather.main)}
					</div>
				</div>

				<div className="mt-4 flex items-baseline">
					<span className="text-6xl font-bold">{weather.temp}°</span>
					<span className="text-2xl ml-2">C</span>
				</div>
				<p className="text-white/80 mt-2">Cảm giác như {weather.feels_like}°C</p>
			</div>

			{/* Details */}
			{showDetails && (
				<div className="p-6 grid grid-cols-2 gap-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
							<Droplets className="w-5 h-5 text-blue-600" />
						</div>
						<div>
							<p className="text-xs text-slate-500">Độ ẩm</p>
							<p className="text-lg font-semibold text-slate-900">{weather.humidity}%</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
							<Wind className="w-5 h-5 text-emerald-600" />
						</div>
						<div>
							<p className="text-xs text-slate-500">Gió</p>
							<p className="text-lg font-semibold text-slate-900">{weather.wind_speed} m/s</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
							<Gauge className="w-5 h-5 text-purple-600" />
						</div>
						<div>
							<p className="text-xs text-slate-500">Áp suất</p>
							<p className="text-lg font-semibold text-slate-900">{weather.pressure} hPa</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
							<Eye className="w-5 h-5 text-orange-600" />
						</div>
						<div>
							<p className="text-xs text-slate-500">Tầm nhìn</p>
							<p className="text-lg font-semibold text-slate-900">{weather.visibility} km</p>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}