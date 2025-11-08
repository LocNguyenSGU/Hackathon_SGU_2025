import React from 'react'
import { Users, Plus, Search, Filter, Mail, Shield } from 'lucide-react'

export default function AdminUsers() {
	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-slate-900">Users Management</h1>
					<p className="text-slate-600 mt-1">Manage all users and their permissions</p>
				</div>
				<button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200">
					<Plus className="w-5 h-5" />
					Add New User
				</button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{[
					{ title: 'Total Users', value: '10,234', icon: Users, color: 'from-blue-500 to-cyan-500' },
					{ title: 'Active Today', value: '2,543', icon: Users, color: 'from-emerald-500 to-teal-500' },
					{ title: 'Admins', value: '12', icon: Shield, color: 'from-purple-500 to-pink-500' },
				].map((stat, index) => {
					const Icon = stat.icon
					return (
						<div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
							<div className="flex items-center gap-4">
								<div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
									<Icon className="w-6 h-6 text-white" />
								</div>
								<div>
									<p className="text-slate-600 text-sm">{stat.title}</p>
									<p className="text-2xl font-bold text-slate-900">{stat.value}</p>
								</div>
							</div>
						</div>
					)
				})}
			</div>

			{/* Filters */}
			<div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
				<div className="flex flex-col md:flex-row gap-4">
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
						<input
							type="text"
							placeholder="Search users..."
							className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
					</div>
					<button className="flex items-center gap-2 px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
						<Filter className="w-5 h-5" />
						Filters
					</button>
				</div>
			</div>

			{/* Users Table */}
			<div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-slate-50 border-b border-slate-200">
							<tr>
								<th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">User</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Role</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Joined</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200">
							{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
								<tr key={i} className="hover:bg-slate-50 transition-colors">
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
												<Users className="w-5 h-5 text-white" />
											</div>
											<div>
												<p className="font-semibold text-slate-900">User {i}</p>
												<p className="text-sm text-slate-500">@user{i}</p>
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2 text-slate-700">
											<Mail className="w-4 h-4" />
											user{i}@example.com
										</div>
									</td>
									<td className="px-6 py-4">
										<span className={`px-3 py-1 rounded-full text-xs font-semibold ${i === 1
												? 'bg-purple-100 text-purple-700'
												: 'bg-blue-100 text-blue-700'
											}`}>
											{i === 1 ? 'Admin' : 'User'}
										</span>
									</td>
									<td className="px-6 py-4">
										<span className={`px-3 py-1 rounded-full text-xs font-semibold ${i % 3 === 0
												? 'bg-emerald-100 text-emerald-700'
												: 'bg-slate-100 text-slate-700'
											}`}>
											{i % 3 === 0 ? 'Active' : 'Offline'}
										</span>
									</td>
									<td className="px-6 py-4 text-slate-700">
										Nov {Math.floor(Math.random() * 30) + 1}, 2025
									</td>
									<td className="px-6 py-4">
										<div className="flex gap-2">
											<button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
												Edit
											</button>
											<button className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
												Delete
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}