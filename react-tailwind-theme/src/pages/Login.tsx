import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MapPin, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'

export default function Login() {
	const navigate = useNavigate()
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const [formData, setFormData] = useState({
		username: '',
		password: '',
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			// Create form data for OAuth2 password flow
			const body = new URLSearchParams({
				grant_type: 'password',
				username: formData.username,
				password: formData.password,
				scope: '',
				client_id: '',
				client_secret: '',
			})

			const response = await fetch('http://localhost:8000/api/v1/auth/login', {
				method: 'POST',
				headers: {
					'accept': 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: body.toString(),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.detail || 'Login failed')
			}

			const data = await response.json()

			// Store token in localStorage
			localStorage.setItem('access_token', data.access_token)
			localStorage.setItem('token_type', data.token_type)

			// Decode JWT to get user info (optional)
			const payload = JSON.parse(atob(data.access_token.split('.')[1]))
			localStorage.setItem('user_role', payload.role)
			localStorage.setItem('username', payload.sub)

			// Redirect based on role
			if (payload.role === 'admin') {
				navigate('/admin/dashboard')
			} else {
				navigate('/')
			}
		} catch (err: any) {
			setError(err.message || 'An error occurred during login')
		} finally {
			setLoading(false)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Logo & Title */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back!</h1>
					<p className="text-slate-600">Sign in to continue to AI Tour Planner</p>
				</div>

				{/* Login Form */}
				<div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Error Message */}
						{error && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
								<AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
								<div>
									<p className="text-sm text-red-800 font-medium">Login Failed</p>
									<p className="text-sm text-red-600">{error}</p>
								</div>
							</div>
						)}

						{/* Username */}
						<div>
							<label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
								Username
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
								<input
									type="text"
									id="username"
									name="username"
									value={formData.username}
									onChange={handleChange}
									required
									className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
									placeholder="Enter your username"
								/>
							</div>
						</div>

						{/* Password */}
						<div>
							<label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
								<input
									type={showPassword ? 'text' : 'password'}
									id="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									required
									className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
									placeholder="Enter your password"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
								>
									{showPassword ? (
										<EyeOff className="w-5 h-5" />
									) : (
										<Eye className="w-5 h-5" />
									)}
								</button>
							</div>
						</div>

						{/* Remember Me & Forgot Password */}
						<div className="flex items-center justify-between">
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									className="w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500"
								/>
								<span className="text-sm text-slate-600">Remember me</span>
							</label>
							<Link to="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
								Forgot password?
							</Link>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading}
							className="w-full py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{loading ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									Signing in...
								</>
							) : (
								'Sign In'
							)}
						</button>
					</form>

					{/* Divider */}
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-slate-200"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-4 bg-white text-slate-500">Or continue with</span>
						</div>
					</div>

					{/* Social Login */}
					<div className="grid grid-cols-2 gap-4">
						<button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
							<svg className="w-5 h-5" viewBox="0 0 24 24">
								<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
								<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
								<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
								<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
							</svg>
							Google
						</button>
						<button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
							<svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
								<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
							</svg>
							Facebook
						</button>
					</div>
				</div>

				{/* Sign Up Link */}
				<p className="text-center mt-6 text-slate-600">
					Don't have an account?{' '}
					<Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-semibold">
						Sign up
					</Link>
				</p>
			</div>
		</div>
	)
}