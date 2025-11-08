import React from 'react'
import { MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
	return (
		<footer className="bg-slate-900 text-white py-12">
			<div className="max-w-7xl mx-auto px-4">
				<div className="grid md:grid-cols-4 gap-8 mb-8">
					<div>
						<div className="flex items-center gap-3 mb-4">
							<div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
								<MapPin className="w-6 h-6 text-white" />
							</div>
							<h3 className="text-2xl font-bold">AI Tour Planner</h3>
						</div>
						<p className="text-gray-400 leading-relaxed">
							Nền tảng du lịch thông minh kết hợp AI, VR và gamification
						</p>
					</div>

					<div>
						<h4 className="font-semibold mb-4">Sản phẩm</h4>
						<ul className="space-y-2 text-gray-400">
							<li><a href="#" className="hover:text-emerald-400 transition-colors">Trắc nghiệm AI</a></li>
							<li><a href="#" className="hover:text-emerald-400 transition-colors">Trải nghiệm VR</a></li>
							<li><a href="#" className="hover:text-emerald-400 transition-colors">Hướng dẫn viên ảo</a></li>
							<li><a href="#" className="hover:text-emerald-400 transition-colors">Rewards</a></li>
						</ul>
					</div>

					<div>
						<h4 className="font-semibold mb-4">Công ty</h4>
						<ul className="space-y-2 text-gray-400">
							<li><a href="#" className="hover:text-emerald-400 transition-colors">Về chúng tôi</a></li>
							<li><a href="#" className="hover:text-emerald-400 transition-colors">Đối tác</a></li>
							<li><a href="#" className="hover:text-emerald-400 transition-colors">Tuyển dụng</a></li>
							<li><a href="#" className="hover:text-emerald-400 transition-colors">Liên hệ</a></li>
						</ul>
					</div>

					<div>
						<h4 className="font-semibold mb-4">Kết nối</h4>
						<div className="flex gap-4">
							{[
								{ icon: Facebook, href: '#' },
								{ icon: Instagram, href: '#' },
								{ icon: Twitter, href: '#' },
								{ icon: Linkedin, href: '#' },
							].map((social, idx) => (
								<a
									key={idx}
									href={social.href}
									className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-all duration-300 group"
								>
									<social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
								</a>
							))}
						</div>
					</div>
				</div>

				<div className="border-t border-gray-800 pt-8 text-center text-gray-400">
					<p>© 2025 AI Tour Planner. All rights reserved.</p>
				</div>
			</div>
		</footer>
	)
}