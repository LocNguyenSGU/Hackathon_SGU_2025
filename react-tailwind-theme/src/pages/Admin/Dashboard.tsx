import React from 'react'
import { Users, MapPin, TrendingUp, DollarSign, ArrowUp, ArrowDown } from 'lucide-react'

export default function Dashboard() {
	const stats = [
		{
			title: 'Total Users',
			value: '10,234',
			change: '+12.5%',
			trend: 'up',
			icon: Users,
			color: 'from-blue-500 to-cyan-500',
		},
		{
			title: 'Total Tours',
			value: '523',
			change: '+8.2%',
			trend: 'up',
			icon: MapPin,
			color: 'from-emerald-500 to-teal-500',
		},
		{
			title: 'Active Bookings',
			value: '1,842',
			change: '+23.1%',
			trend: 'up',
			icon: TrendingUp,
			color: 'from-purple-500 to-pink-500',
		},
		{
			title: 'Revenue',
			value: '$125,430',
			change: '-3.4%',
			trend: 'down',
			icon: DollarSign,
			color: 'from-orange-500 to-red-500',
		},
	]

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
				<p className="text-slate-600 mt-1">Welcome back, duylam15! Here's what's happening today.</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat, index) => {
					const Icon = stat.icon
					return (
						<div
							key={index}
							className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300"
						>
							<div className="flex items-center justify-between mb-4">
								<div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
									<Icon className="w-6 h-6 text-white" />
								</div>
								<div className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
									}`}>
									{stat.trend === 'up' ? (
										<ArrowUp className="w-4 h-4" />
									) : (
										<ArrowDown className="w-4 h-4" />
									)}
									{stat.change}
								</div>
							</div>
							<h3 className="text-slate-600 text-sm font-medium mb-1">{stat.title}</h3>
							<p className="text-3xl font-bold text-slate-900">{stat.value}</p>
						</div>
					)
				})}
			</div>

			{/* Recent Activity */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
					<h2 className="text-xl font-bold text-slate-900 mb-4">Recent Users</h2>
					<div className="space-y-4">
						{[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
								<div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
									<Users className="w-5 h-5 text-white" />
								</div>
								<div className="flex-1">
									<p className="font-semibold text-slate-900">User {i}</p>
									<p className="text-sm text-slate-500">Joined 2 hours ago</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
					<h2 className="text-xl font-bold text-slate-900 mb-4">Popular Tours</h2>
					<div className="space-y-4">
						{[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
								<div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
									<MapPin className="w-5 h-5 text-white" />
								</div>
								<div className="flex-1">
									<p className="font-semibold text-slate-900">Tour Package {i}</p>
									<p className="text-sm text-slate-500">{Math.floor(Math.random() * 100)} bookings</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}