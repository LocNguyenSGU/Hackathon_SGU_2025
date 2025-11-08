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

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50)
		}
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

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

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
					? 'bg-slate-800/70 backdrop-blur-lg shadow-lg'
					: isHomePage
						? 'bg-transparent'
						: 'bg-slate-900/95 backdrop-blur-lg shadow-lg'
				}`}
		>
			<nav className="max-w-6xl mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<div
						onClick={() => navigate('/')}
						className="flex items-center gap-2 group cursor-pointer"
					>
						<div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-emerald-500/50 transition-all">
							<MapPin className="w-5 h-5 text-white" />
						</div>
						<span className="text-lg font-bold text-white">
							Travel Loop
						</span>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-6">
						<button
							onClick={() => scrollToSection('features')}
							className="text-white/90 hover:text-white text-sm font-medium transition-colors"
						>
							Tính năng
						</button>
						<button
							onClick={() => scrollToSection('how-it-works')}
							className="text-white/90 hover:text-white text-sm font-medium transition-colors"
						>
							Cách hoạt động
						</button>

						{loading ? (
							<div className="flex items-center gap-2 animate-pulse">
								<div className="h-8 w-8 bg-white/20 rounded-full"></div>
								<div className="h-3 w-20 bg-white/20 rounded"></div>
							</div>
						) : isLoggedIn ? (
							<div className="relative profile-dropdown">
								<button
									onClick={() => setIsProfileOpen(!isProfileOpen)}
									onMouseEnter={() => setIsProfileOpen(true)}
									className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all"
								>
									<div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
										<User className="w-4 h-4 text-white" />
									</div>
									<span className="text-white text-sm font-medium">{username}</span>
									<ChevronDown className={`w-3 h-3 text-white/70 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
								</button>

								{isProfileOpen && (
									<div
										className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1"
										onMouseLeave={() => setIsProfileOpen(false)}
									>
										<div className="px-3 py-2 border-b border-slate-200">
											<p className="text-xs font-semibold text-slate-900">{username}</p>
											<p className="text-xs text-slate-500">
												{localStorage.getItem('user_role') === 'admin' ? 'Admin' : 'User'}
											</p>
										</div>

										<div className="py-1">
											<button
												onClick={() => { setIsProfileOpen(false); navigate('/profile') }}
												className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
											>
												<User className="w-3 h-3" />
												Profile
											</button>

											{localStorage.getItem('user_role') === 'admin' && (
												<button
													onClick={() => { setIsProfileOpen(false); navigate('/admin/dashboard') }}
													className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
												>
													<Settings className="w-3 h-3" />
													Admin
												</button>
											)}
										</div>

										<div className="border-t border-slate-200 pt-1">
											<button
												onClick={handleLogout}
												className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
											>
												<LogOut className="w-3 h-3" />
												Đăng xuất
											</button>
										</div>
									</div>
								)}
							</div>
						) : (
							<button
								className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all"
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
						{isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
					</button>
				</div>

				{/* Mobile Menu */}
				{isMobileMenuOpen && (
					<div className="md:hidden pb-3 border-t border-white/10 mt-2">
						<div className="flex flex-col space-y-2 pt-3">
							<button
								onClick={() => scrollToSection('features')}
								className="text-white/90 hover:text-white text-sm font-medium transition-colors text-left"
							>
								Tính năng
							</button>
							<button
								onClick={() => scrollToSection('how-it-works')}
								className="text-white/90 hover:text-white text-sm font-medium transition-colors text-left"
							>
								Cách hoạt động
							</button>

							{isLoggedIn ? (
								<div className="border-t border-white/20 pt-3 space-y-2">
									<div className="flex items-center gap-2 px-2">
										<div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
											<User className="w-4 h-4 text-white" />
										</div>
										<div>
											<p className="text-white text-sm font-medium">{username}</p>
											<p className="text-white/60 text-xs">
												{localStorage.getItem('user_role') === 'admin' ? 'Admin' : 'User'}
											</p>
										</div>
									</div>

									<button
										onClick={() => { setIsMobileMenuOpen(false); navigate('/profile') }}
										className="w-full px-2 py-2 text-white/90 hover:text-white text-sm transition-colors text-left flex items-center gap-2"
									>
										<User className="w-3 h-3" />
										Profile
									</button>

									{localStorage.getItem('user_role') === 'admin' && (
										<button
											onClick={() => { setIsMobileMenuOpen(false); navigate('/admin/dashboard') }}
											className="w-full px-2 py-2 text-white/90 hover:text-white text-sm transition-colors text-left flex items-center gap-2"
										>
											<Settings className="w-3 h-3" />
											Admin
										</button>
									)}

									<button
										onClick={handleLogout}
										className="w-full px-4 py-2 bg-red-500/20 text-white text-sm font-medium rounded-full border border-red-400/30 hover:bg-red-500/30 transition-all text-center flex items-center justify-center gap-2"
									>
										<LogOut className="w-3 h-3" />
										Đăng xuất
									</button>
								</div>
							) : (
								<button
									className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all text-center"
									onClick={() => navigate('/login')}
								>
									Đăng nhập
								</button>
							)}
						</div>
					</div>
				)}
			</nav>
		</header>
	)
}