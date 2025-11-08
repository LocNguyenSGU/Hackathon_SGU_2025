import React, { useState } from 'react'
import {
  MapPin,
  Sparkles,
  Brain,
  Target,
  Glasses,
  MessageCircle,
  Trophy,
  Users as UsersIcon,
  Map as MapIcon,
  Globe,
  Star,
  CheckCircle2,
  ArrowRight,
  Zap,
  FileText,
  Bot,
  Send,
  BarChart3,
  TrendingUp,
  Briefcase,
  Building2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Check,
  Mountain,
  Sun,
  Music,
  Hand,
  Smartphone
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-emerald-900/60 to-slate-900/80 z-10"></div>
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=2000')",
            }}
          ></div>
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Khám phá hành trình{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              của riêng bạn
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Cá nhân hóa trải nghiệm du lịch với công nghệ AI thông minh
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={() => navigate("/quiz")}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-full text-base shadow-lg hover:shadow-emerald-500/50 transition-all hover:scale-105 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Trắc nghiệm cá nhân hóa
            </button>

            <button
              onClick={() => navigate("/vr-tour")}
              className="px-6 py-3 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full text-base border border-white/30 hover:bg-white/20 transition-all hover:scale-105 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <MapIcon className="w-4 h-4" />
              Khám phá VR
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '10K+', label: 'Du khách', icon: UsersIcon },
              { number: '500+', label: 'Địa điểm VR', icon: MapIcon },
              { number: '15+', label: 'Ngôn ngữ', icon: Globe },
              { number: '98%', label: 'Hài lòng', icon: Star },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <div className="text-2xl md:text-3xl font-bold text-emerald-600 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Trải nghiệm <span className="text-emerald-600">thông minh</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hệ sinh thái AI toàn diện cho du khách hiện đại
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'Trắc nghiệm tâm lý',
                description: 'Phân tích sở thích và tính cách để tạo profile du lịch cá nhân hóa',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: Target,
                title: 'Gợi ý tour thông minh',
                description: 'AI đề xuất hành trình phù hợp dựa trên profile của bạn',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Glasses,
                title: 'Trải nghiệm VR 360°',
                description: 'Khám phá địa điểm với công nghệ thực tế ảo chân thực',
                gradient: 'from-emerald-500 to-teal-500'
              },
              {
                icon: MessageCircle,
                title: 'Hướng dẫn viên AI',
                description: 'Trợ lý du lịch đa ngôn ngữ giải đáp mọi thắc mắc',
                gradient: 'from-orange-500 to-red-500'
              },
              {
                icon: Trophy,
                title: 'Gamification',
                description: 'Tích điểm, nhận huy hiệu và phần thưởng hấp dẫn',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: UsersIcon,
                title: 'Kết nối sinh thái',
                description: 'Nền tảng kết nối du khách và doanh nghiệp du lịch',
                gradient: 'from-indigo-500 to-purple-500'
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Cách hoạt động
            </h2>
            <p className="text-lg text-gray-600">
              4 bước đơn giản để bắt đầu
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Trắc nghiệm', description: 'Test tâm lý 5 phút', icon: FileText },
              { step: '02', title: 'AI phân tích', description: 'Tạo profile phù hợp', icon: Bot },
              { step: '03', title: 'Khám phá VR', description: 'Trải nghiệm địa điểm', icon: Glasses },
              { step: '04', title: 'Đặt tour', description: 'Bắt đầu hành trình', icon: Send },
            ].map((item, idx) => (
              <div key={idx} className="relative bg-white rounded-xl p-6 shadow-md text-center border border-gray-100">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {item.step}
                </div>
                <item.icon className="w-10 h-10 mx-auto mb-3 mt-2 text-emerald-600" />
                <h3 className="text-base font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VR Showcase */}
      <section className="py-12 bg-gradient-to-b from-slate-900 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-medium mb-4 border border-emerald-400/30">
                <Glasses className="w-4 h-4" />
                <span>Công nghệ VR</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trải nghiệm như thật
              </h2>
              <p className="text-base text-gray-300 mb-6">
                Khám phá địa điểm với VR 360°, hiệu ứng thời tiết và âm thanh chân thực
              </p>

              <div className="space-y-3">
                {[
                  { icon: Sun, text: 'Hiệu ứng thời tiết thực' },
                  { icon: Music, text: 'Âm thanh bản địa' },
                  { icon: Hand, text: 'Tương tác 360°' },
                  { icon: Smartphone, text: 'Trên mọi thiết bị' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Mountain className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                    <div className="text-xl font-bold mb-1">Vịnh Hạ Long</div>
                    <div className="text-sm text-gray-400">Khám phá với VR</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Câu chuyện từ du khách
            </h2>
            <p className="text-lg text-gray-600">
              Hàng nghìn người đã trải nghiệm
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Minh Anh',
                role: 'Du khách độc lập',
                content: 'Tour được gợi ý hoàn toàn phù hợp với tính cách của tôi!',
                rating: 5
              },
              {
                name: 'Đức Thắng',
                role: 'Giám đốc du lịch',
                content: 'Doanh thu tăng 40% trong 3 tháng nhờ hệ thống AI!',
                rating: 5
              },
              {
                name: 'Thu Hằng',
                role: 'Blogger',
                content: 'Trải nghiệm VR rất chân thực, âm thanh và hình ảnh tuyệt vời.',
                rating: 5
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full flex items-center justify-center">
                    <UsersIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-900">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Bắt đầu hành trình ngay
          </h2>
          <p className="text-base text-white/90 mb-6 max-w-2xl mx-auto">
            Tham gia 10,000+ du khách thông minh
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={() => navigate('/quiz')}
              className="px-8 py-3 bg-white text-emerald-600 font-bold rounded-full text-base shadow-lg hover:shadow-xl transition-all hover:scale-105 w-full sm:w-auto inline-flex items-center justify-center gap-2"
            >
              Trắc nghiệm miễn phí
              <Zap className="w-4 h-4" />
            </button>
            <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full text-base hover:bg-white/10 transition-all w-full sm:w-auto">
              Tìm hiểu thêm
            </button>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Miễn phí</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Không cần thẻ</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-10">
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
    </div>
  )
}