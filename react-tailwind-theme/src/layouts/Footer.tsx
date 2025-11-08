import React from 'react'
import { MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
	return (
		<footer className="bg-slate-900 text-white py-8">
			<div className="max-w-6xl mx-auto px-4">
				<div className="grid md:grid-cols-4 gap-6 mb-6">
					<div>
						<div className="flex items-center gap-2 mb-3">
							<div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
								<MapPin className="w-5 h-5 text-white" />
							</div>
							<h3 className="text-lg font-bold">AI Tour Planner</h3>
						</div>
						<p className="text-sm text-gray-400">
							Nền tảng du lịch thông minh
						</p>
					</div>

					<div>
						<h4 className="font-semibold mb-3 text-sm">Sản phẩm</h4>
						<ul className="space-y-2 text-sm text-gray-400">
							<li><a href="#" className="hover:text-emerald-400 transition-colors">Trắc nghiệm AI</a></li>
							<li><a href="#" className="hover:text-emerald-400 transition-colors">Trải nghiệm VR</a></li>
							<li><a href="#" className="hover:text-emerald-400 transition-colors">Hướng dẫn viên</a></li>
						</ul>
					</div>

					<div>
						<h4 className="font-semibold mb-3 text-sm">Công ty</h4>
						<ul className="space-y-2 text-sm text-gray-400">
							<li><a href="#" className="hover:text-emerald-400 transition-colors">Về chúng tôi</a></li>
							<li><a href="#" className="hover:text-emerald-400 transition-colors">Đối tác</a></li>
							<li><a href="#" className="hover:text-emerald-400 transition-colors">Liên hệ</a></li>
						</ul>
					</div>

					<div>
						<h4 className="font-semibold mb-3 text-sm">Kết nối</h4>
						<div className="flex gap-3">
							{[Facebook, Instagram, Twitter, Linkedin].map((Icon, idx) => (
								<a
									key={idx}
									href="#"
									className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-all"
								>
									<Icon className="w-4 h-4" />
								</a>
							))}
						</div>
					</div>
				</div>

				<div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
					<p>© 2025 AI Tour Planner. All rights reserved.</p>
				</div>
			</div>
		</footer>
	)
}