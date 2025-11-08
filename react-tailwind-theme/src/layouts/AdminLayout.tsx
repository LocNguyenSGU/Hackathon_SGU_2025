import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import {
	LayoutDashboard,
	MapPin,
	Users,
	Menu,
	X,
	Bell,
	Search,
	Settings,
	LogOut,
	ChevronDown,
	User
} from 'lucide-react'

export default function AdminLayout() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true)
	const [isProfileOpen, setIsProfileOpen] = useState(false)
	const navigate = useNavigate()
	const location = useLocation()

	const menuItems = [
		{
			title: 'Dashboard',
			icon: LayoutDashboard,
			path: '/admin/dashboard',
		},
		{
			title: 'Tours',
			icon: MapPin,
			path: '/admin/tours',
		},
		{
			title: 'Users',
			icon: Users,
			path: '/admin/users',
		},
	]

	const isActiveRoute = (path: string) => {
		return location.pathname === path
	}

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Sidebar */}
			<aside
				className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
					} bg-slate-900 w-64`}
			>
				<div className="flex flex-col h-full">
					{/* Logo */}
					<div className="flex items-center justify-between p-6 border-b border-slate-800">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
								<MapPin className="w-6 h-6 text-white" />
							</div>
							<div>
								<h2 className="text-white font-bold text-lg">AI Tour Planner</h2>
								<p className="text-slate-400 text-xs">Admin Panel</p>
							</div>
						</div>
					</div>

					{/* Navigation */}
					<nav className="flex-1 p-4 space-y-2 overflow-y-auto">
						{menuItems.map((item) => {
							const Icon = item.icon
							const isActive = isActiveRoute(item.path)

							return (
								<Link
									key={item.path}
									to={item.path}
									className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
											? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
											: 'text-slate-400 hover:bg-slate-800 hover:text-white'
										}`}
								>
									<Icon className="w-5 h-5" />
									<span className="font-medium">{item.title}</span>
								</Link>
							)
						})}
					</nav>

					{/* Settings */}
					<div className="p-4 border-t border-slate-800 space-y-2">
						<button className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 w-full">
							<Settings className="w-5 h-5" />
							<span className="font-medium">Settings</span>
						</button>
						<button className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800 hover:text-red-300 transition-all duration-200 w-full">
							<LogOut className="w-5 h-5" />
							<span className="font-medium">Logout</span>
						</button>
					</div>
				</div>
			</aside>

			{/* Main Content */}
			<div
				className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'
					}`}
			>
				{/* Top Navigation Bar */}
				<header className="bg-white border-b border-slate-200 sticky top-0 z-30">
					<div className="flex items-center justify-between px-6 py-4">
						{/* Left Side */}
						<div className="flex items-center gap-4">
							<button
								onClick={() => setIsSidebarOpen(!isSidebarOpen)}
								className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
							>
									<Menu className="w-6 h-6 text-slate-600" />
							</button>

							{/* Search Bar */}
							<div className="relative hidden md:block">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
								<input
									type="text"
									placeholder="Search..."
									className="pl-10 pr-4 py-2 w-80 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
								/>
							</div>
						</div>

						{/* Right Side */}
						<div className="flex items-center gap-4">
							{/* Notifications */}
							<button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
								<Bell className="w-6 h-6 text-slate-600" />
								<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
							</button>

							{/* User Profile */}
							<div className="relative">
								<button
									onClick={() => setIsProfileOpen(!isProfileOpen)}
									className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
								>
									<div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
										<User className="w-5 h-5 text-white" />
									</div>
									<div className="hidden md:block text-left">
										<p className="text-sm font-semibold text-slate-700">duylam15</p>
										<p className="text-xs text-slate-500">Administrator</p>
									</div>
									<ChevronDown className="w-4 h-4 text-slate-600" />
								</button>

								{/* Profile Dropdown */}
								{isProfileOpen && (
									<div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
										<div className="px-4 py-3 border-b border-slate-200">
											<p className="text-sm font-semibold text-slate-700">duylam15</p>
											<p className="text-xs text-slate-500">admin@aitourplanner.com</p>
										</div>
										<button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
											<User className="w-4 h-4" />
											Profile
										</button>
										<button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
											<Settings className="w-4 h-4" />
											Settings
										</button>
										<hr className="my-2" />
										<button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
											<LogOut className="w-4 h-4" />
											Logout
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
				</header>

				{/* Page Content */}
				<main className="p-6">
					<Outlet />
				</main>
			</div>

			{/* Mobile Overlay */}
			{isSidebarOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-30 lg:hidden"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}
		</div>
	)
}