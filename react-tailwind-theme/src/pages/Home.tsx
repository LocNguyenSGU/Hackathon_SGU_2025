import React, { useState } from 'react'
import { 
  MapPin, 
  Sparkles, 
  Menu, 
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
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header / Navigation */}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video/Image Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-emerald-900/60 to-slate-900/80 z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center animate-slow-zoom"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=2000')",
            }}
          ></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pt-20">
          {/* Badge */}
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Khám phá hành trình <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              của riêng bạn
            </span>
            <br />cùng AI Tour Planner
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
            Cá nhân hóa trải nghiệm du lịch – Học và cảm nhận bản sắc địa phương
            qua công nghệ AI thông minh
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-full text-lg shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            onClick={() => navigate("/quiz")}
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Trắc nghiệm cá nhân hóa
              </span>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
            
            <button className="group relative px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            onClick={() => navigate("/vr")}
            >
              <span className="flex items-center justify-center gap-2">
                <MapIcon className="w-5 h-5" />
                Khám phá địa điểm VR
              </span>
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'Du khách tin dùng', icon: UsersIcon },
              { number: '500+', label: 'Địa điểm VR', icon: MapIcon },
              { number: '15+', label: 'Ngôn ngữ hỗ trợ', icon: Globe },
              { number: '98%', label: 'Hài lòng', icon: Star },
            ].map((stat, idx) => (
              <div key={idx} className="text-center group">
                <stat.icon className="w-12 h-12 mx-auto mb-3 text-emerald-600 group-hover:scale-110 transition-transform" />
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trải nghiệm du lịch <span className="text-emerald-600">thông minh</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hệ sinh thái AI toàn diện cho du khách hiện đại và doanh nghiệp du lịch
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'Trắc nghiệm tâm lý du lịch',
                description: 'Phân tích sở thích, tính cách và mong muốn của bạn để tạo profile du lịch cá nhân hóa hoàn hảo',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: Target,
                title: 'Gợi ý tour thông minh',
                description: 'AI phân tích profile, xu hướng thị trường và dữ liệu địa điểm để đề xuất hành trình phù hợp nhất',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Glasses,
                title: 'Trải nghiệm VR 360°',
                description: 'Khám phá địa điểm trước khi đến với công nghệ thực tế ảo, hiệu ứng thời tiết và âm thanh chân thực',
                gradient: 'from-emerald-500 to-teal-500'
              },
              {
                icon: MessageCircle,
                title: 'Hướng dẫn viên ảo AI',
                description: 'Trợ lý du lịch thông minh, đa ngôn ngữ sử dụng LLM để giải đáp mọi thắc mắc của bạn',
                gradient: 'from-orange-500 to-red-500'
              },
              {
                icon: Trophy,
                title: 'Gamification & Rewards',
                description: 'Tích điểm, nhận huy hiệu, tham gia quiz và nhận phần thưởng từ các đối tác du lịch',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: UsersIcon,
                title: 'Kết nối sinh thái',
                description: 'Nền tảng kết nối du khách, cộng đồng địa phương và doanh nghiệp du lịch một cách thông minh',
                gradient: 'from-indigo-500 to-purple-500'
              },
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Hành trình của bạn bắt đầu thế nào?
            </h2>
            <p className="text-xl text-gray-600">
              4 bước đơn giản để có trải nghiệm du lịch hoàn hảo
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Trắc nghiệm',
                description: 'Hoàn thành bài test tâm lý du lịch 5 phút',
                icon: FileText
              },
              {
                step: '02',
                title: 'AI phân tích',
                description: 'Hệ thống tạo profile và đề xuất tour phù hợp',
                icon: Bot
              },
              {
                step: '03',
                title: 'Khám phá VR',
                description: 'Trải nghiệm địa điểm qua công nghệ thực tế ảo',
                icon: Glasses
              },
              {
                step: '04',
                title: 'Đặt tour & đi',
                description: 'Xác nhận và bắt đầu hành trình của bạn',
                icon: Send
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                {/* Connection Line */}
                {idx < 3 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500 opacity-30"></div>
                )}
                
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {item.step}
                  </div>
                  <item.icon className="w-12 h-12 mx-auto mb-4 mt-4 text-emerald-600" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VR Experience Showcase */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-400/30">
                <Glasses className="w-5 h-5" />
                <span>Công nghệ VR tiên tiến</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Trải nghiệm địa điểm như thật trước khi đến
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Khám phá mọi ngóc ngách của điểm đến với công nghệ VR 360°, 
                hoàn chỉnh với hiệu ứng thời tiết chân thực và âm thanh bản địa đặc trưng.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: Sun, text: 'Hiệu ứng thời tiết thời gian thực' },
                  { icon: Music, text: 'Âm thanh bản địa chân thực' },
                  { icon: Hand, text: 'Tương tác 360° hoàn toàn' },
                  { icon: Smartphone, text: 'Trải nghiệm trên mọi thiết bị' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-lg">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl blur-3xl opacity-30"></div>
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Mountain className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
                    <div className="text-2xl font-bold mb-2">Vịnh Hạ Long</div>
                    <div className="text-gray-400">Khám phá ngay với VR</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Business Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-3xl p-8 md:p-12">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: BarChart3, label: 'Phân tích dữ liệu' },
                    { icon: Target, label: 'Marketing AI' },
                    { icon: Briefcase, label: 'Quản lý tour' },
                    { icon: TrendingUp, label: 'Tăng doanh thu' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow group">
                      <item.icon className="w-10 h-10 mb-2 text-blue-600 group-hover:scale-110 transition-transform" />
                      <div className="font-semibold text-gray-800">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                <span>Dành cho Doanh nghiệp</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Nâng tầm doanh nghiệp du lịch của bạn
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Tiếp cận khách hàng tiềm năng chính xác với AI, 
                tối ưu hoá chiến dịch marketing và tăng tỷ lệ chuyển đổi.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'Nhận insights về hành vi và sở thích du khách',
                  'Tự động đề xuất tour phù hợp với từng profile',
                  'Tích hợp VR để tăng trải nghiệm khách hàng',
                  'Dashboard phân tích và báo cáo chi tiết'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg">{item}</span>
                  </li>
                ))}
              </ul>

              <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2">
                Đăng ký dùng thử miễn phí
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Câu chuyện từ du khách
            </h2>
            <p className="text-xl text-gray-600">
              Hàng nghìn người đã khám phá hành trình của riêng mình
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Minh Anh',
                role: 'Du khách độc lập',
                content: 'Trắc nghiệm tâm lý giúp tôi hiểu rõ phong cách du lịch của mình. Tour được gợi ý hoàn toàn phù hợp với tính cách và sở thích của tôi!',
                rating: 5
              },
              {
                name: 'Đức Thắng',
                role: 'Giám đốc công ty du lịch',
                content: 'Hệ thống AI giúp chúng tôi hiểu khách hàng sâu hơn và tối ưu hoá các gói tour. Doanh thu tăng 40% trong 3 tháng!',
                rating: 5
              },
              {
                name: 'Thu Hằng',
                role: 'Blogger du lịch',
                content: 'Trải nghiệm VR thật tuyệt vời! Tôi có thể khám phá địa điểm trước và chuẩn bị tốt hơn cho chuyến đi. Âm thanh và hình ảnh rất chân thực.',
                rating: 5
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Bắt đầu hành trình của bạn ngay hôm nay
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Tham gia cộng đồng 10,000+ du khách thông minh đang khám phá thế giới theo cách của riêng họ
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group px-10 py-5 bg-white text-emerald-600 font-bold rounded-full text-lg shadow-2xl hover:shadow-white/50 transition-all duration-300 hover:scale-105 w-full sm:w-auto inline-flex items-center justify-center gap-2">
              Trắc nghiệm miễn phí ngay
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
            <button className="px-10 py-5 bg-transparent border-2 border-white text-white font-bold rounded-full text-lg hover:bg-white/10 transition-all duration-300 w-full sm:w-auto">
              Tìm hiểu thêm
            </button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-8 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Miễn phí đăng ký</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Không cần thẻ tín dụng</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slow-zoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}