import React, { useState, useEffect } from 'react'
import { MapPin, Menu, X, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Header() {
	const [isScrolled, setIsScrolled] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [isProfileOpen, setIsProfileOpen] = useState(false)
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [username, setUsername] = useState('')
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()
	const location = useLocation()

	// Check login status
	useEffect(() => {
		const checkAuthStatus = () => {
			const token = localStorage.getItem('access_token')
			const user = localStorage.getItem('username')
			setIsLoggedIn(!!token)
			setUsername(user || '')
			setLoading(false)
		}

		checkAuthStatus()
	}, [location])

	// Handle scroll effect
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50)
		}
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement
			if (!target.closest('.profile-dropdown')) {
				setIsProfileOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const isHomePage = location.pathname === '/'

	const scrollToSection = (sectionId: string) => {
		if (location.pathname !== '/') {
			navigate('/')
			setTimeout(() => {
				const element = document.getElementById(sectionId)
				element?.scrollIntoView({ behavior: 'smooth' })
			}, 100)
		} else {
			const element = document.getElementById(sectionId)
			element?.scrollIntoView({ behavior: 'smooth' })
		}
		setIsMobileMenuOpen(false)
	}

	const handleLogout = () => {
		localStorage.removeItem('access_token')
		localStorage.removeItem('token_type')
		localStorage.removeItem('user_role')
		localStorage.removeItem('username')
		setIsLoggedIn(false)
		setIsProfileOpen(false)
		navigate('/login')
	}

	const handleProfile = () => {
		setIsProfileOpen(false)
		navigate('/profile')
	}

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
					? 'bg-slate-900/95 backdrop-blur-lg shadow-lg'
					: isHomePage
						? 'bg-transparent'
						: 'bg-slate-900/95 backdrop-blur-lg shadow-lg'
				}`}
		>
			<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-20">
					{/* Logo */}
					<div
						onClick={() => navigate('/')}
						className="flex items-center gap-3 group cursor-pointer"
					>
						<div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300 group-hover:scale-110">
							<MapPin className="w-6 h-6 text-white" />
						</div>
						<span className="text-xl font-bold text-white">
							AI Tour Planner
						</span>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-8">
						<button
							onClick={() => scrollToSection('features')}
							className="text-white/90 hover:text-white font-medium transition-colors duration-200 hover:scale-105 transform"
						>
							Tính năng
						</button>
						<button
							onClick={() => scrollToSection('how-it-works')}
							className="text-white/90 hover:text-white font-medium transition-colors duration-200 hover:scale-105 transform"
						>
							Cách hoạt động
						</button>
						<button
							onClick={() => scrollToSection('pricing')}
							className="text-white/90 hover:text-white font-medium transition-colors duration-200 hover:scale-105 transform"
						>
							Lợi ích
						</button>

						{/* Loading Skeleton */}
						{loading ? (
							<div className="flex items-center gap-3 animate-pulse">
								<div className="h-10 w-10 bg-white/20 rounded-full"></div>
								<div className="h-4 w-24 bg-white/20 rounded"></div>
							</div>
						) : isLoggedIn ? (
							/* Profile Dropdown */
							<div className="relative profile-dropdown">
								<button
									onClick={() => setIsProfileOpen(!isProfileOpen)}
									onMouseEnter={() => setIsProfileOpen(true)}
									className="flex items-center gap-3 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105 group"
								>
									<div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
										<User className="w-5 h-5 text-white" />
									</div>
									<span className="text-white font-medium">{username}</span>
									<ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
								</button>

								{/* Dropdown Menu */}
								{isProfileOpen && (
									<div
										className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
										onMouseLeave={() => setIsProfileOpen(false)}
									>
										{/* User Info */}
										<div className="px-4 py-3 border-b border-slate-200">
											<p className="text-sm font-semibold text-slate-900">{username}</p>
											<p className="text-xs text-slate-500 mt-1">
												{localStorage.getItem('user_role') === 'admin' ? 'Administrator' : 'User'}
											</p>
										</div>

										{/* Menu Items */}
										<div className="py-2">
											<button
												onClick={handleProfile}
												className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
											>
												<User className="w-4 h-4 text-slate-500" />
												<span>Profile</span>
											</button>

											{localStorage.getItem('user_role') === 'admin' && (
												<button
													onClick={() => {
														setIsProfileOpen(false)
														navigate('/admin/dashboard')
													}}
													className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
												>
													<Settings className="w-4 h-4 text-slate-500" />
													<span>Admin Panel</span>
												</button>
											)}

											<button
												onClick={() => {
													setIsProfileOpen(false)
													navigate('/settings')
												}}
												className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
											>
												<Settings className="w-4 h-4 text-slate-500" />
												<span>Settings</span>
											</button>
										</div>

										{/* Logout */}
										<div className="border-t border-slate-200 pt-2">
											<button
												onClick={handleLogout}
												className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
											>
												<LogOut className="w-4 h-4" />
												<span>Đăng xuất</span>
											</button>
										</div>
									</div>
								)}
							</div>
						) : (
							/* Login Button */
							<button
								className="px-6 py-2.5 bg-white/10 backdrop-blur-sm text-white font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105"
								onClick={() => navigate('/login')}
							>
								Đăng nhập
							</button>
						)}
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						className="md:hidden text-white p-2"
					>
						{isMobileMenuOpen ? (
							<X className="w-6 h-6" />
						) : (
							<Menu className="w-6 h-6" />
						)}
					</button>
				</div>

				{/* Mobile Menu */}
				{isMobileMenuOpen && (
					<div className="md:hidden pb-4">
						<div className="flex flex-col space-y-4">
							<button
								onClick={() => scrollToSection('features')}
								className="text-white/90 hover:text-white font-medium transition-colors text-left"
							>
								Tính năng
							</button>
							<button
								onClick={() => scrollToSection('how-it-works')}
								className="text-white/90 hover:text-white font-medium transition-colors text-left"
							>
								Cách hoạt động
							</button>
							<button
								onClick={() => scrollToSection('pricing')}
								className="text-white/90 hover:text-white font-medium transition-colors text-left"
							>
								Lợi ích
							</button>

							{/* Mobile Auth Section */}
							{loading ? (
								<div className="flex items-center gap-3 animate-pulse px-2">
									<div className="h-10 w-10 bg-white/20 rounded-full"></div>
									<div className="h-4 w-24 bg-white/20 rounded"></div>
								</div>
							) : isLoggedIn ? (
								<div className="border-t border-white/20 pt-4 space-y-3">
									<div className="flex items-center gap-3 px-2">
										<div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
											<User className="w-5 h-5 text-white" />
										</div>
										<div>
											<p className="text-white font-medium">{username}</p>
											<p className="text-white/60 text-xs">
												{localStorage.getItem('user_role') === 'admin' ? 'Administrator' : 'User'}
											</p>
										</div>
									</div>

									<button
										onClick={handleProfile}
										className="w-full px-4 py-2.5 text-white/90 hover:text-white font-medium transition-colors text-left flex items-center gap-2"
									>
										<User className="w-4 h-4" />
										Profile
									</button>

									{localStorage.getItem('user_role') === 'admin' && (
										<button
											onClick={() => {
												setIsMobileMenuOpen(false)
												navigate('/admin/dashboard')
											}}
											className="w-full px-4 py-2.5 text-white/90 hover:text-white font-medium transition-colors text-left flex items-center gap-2"
										>
											<Settings className="w-4 h-4" />
											Admin Panel
										</button>
									)}

									<button
										onClick={() => {
											setIsMobileMenuOpen(false)
											navigate('/settings')
										}}
										className="w-full px-4 py-2.5 text-white/90 hover:text-white font-medium transition-colors text-left flex items-center gap-2"
									>
										<Settings className="w-4 h-4" />
										Settings
									</button>

									<button
										onClick={handleLogout}
										className="w-full px-6 py-2.5 bg-red-500/20 backdrop-blur-sm text-white font-medium rounded-full border border-red-400/30 hover:bg-red-500/30 transition-all duration-200 text-center flex items-center justify-center gap-2"
									>
										<LogOut className="w-4 h-4" />
										Đăng xuất
									</button>
								</div>
							) : (
								<button
									className="px-6 py-2.5 bg-white/10 backdrop-blur-sm text-white font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all duration-200 text-center"
									onClick={() => navigate('/login')}
								>
									Đăng nhập
								</button>
							)}
						</div>
					</div>
				)}
			</nav>

			{/* Custom CSS for animations */}
			<style>{`
				@keyframes fade-in {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				@keyframes slide-in-from-top-2 {
					from { transform: translateY(-8px); }
					to { transform: translateY(0); }
				}
				.animate-in {
					animation: fade-in 0.2s ease-out, slide-in-from-top-2 0.2s ease-out;
				}
			`}</style>
		</header>
	)
}