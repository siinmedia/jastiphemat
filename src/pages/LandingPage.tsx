import React from 'react'
import { Heart, Shield, Truck, Star, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-gray-800 font-poppins">Jastip by Livia</span>
            </div>
            <button
              onClick={() => navigate('/admin')}
              className="text-pink-600 hover:text-pink-700 font-medium font-poppins"
            >
              Admin
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <Heart className="text-white" size={32} />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 font-poppins">
              <span className="bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                Jastip by Livia
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed font-poppins">
              Layanan jastip barang terpercaya dari luar negeri & dalam negeri. 
              Titip barang apapun, langsung dari Livia~ 💖
            </p>
          </div>

          <button
            onClick={() => navigate('/form')}
            className="bg-gradient-to-r from-pink-400 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-pink-500 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-poppins inline-flex items-center gap-2"
          >
            Titip Sekarang
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 font-poppins">
            Kenapa Pilih Jastip by Livia?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 font-poppins">Terpercaya</h3>
              <p className="text-gray-600 font-poppins">Layanan jastip yang sudah dipercaya oleh ribuan customer</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Truck className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 font-poppins">Pengiriman Aman</h3>
              <p className="text-gray-600 font-poppins">Barang dikemas dengan rapi dan dikirim dengan aman</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 font-poppins">Rating Tinggi</h3>
              <p className="text-gray-600 font-poppins">Pelayanan berkualitas dengan rating kepuasan tinggi</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 font-poppins">
            Siap Titip Barang Impianmu?
          </h2>
          <p className="text-lg text-gray-600 mb-8 font-poppins">
            Isi form sekarang dan biarkan Livia yang mengurus semuanya untuk kamu!
          </p>
          <button
            onClick={() => navigate('/form')}
            className="bg-gradient-to-r from-pink-400 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-pink-500 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-poppins inline-flex items-center gap-2"
          >
            Mulai Sekarang
            <Heart size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-pink-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center">
              <Heart className="text-white" size={16} />
            </div>
            <span className="text-lg font-bold text-gray-800 font-poppins">Jastip by Livia</span>
          </div>
          <p className="text-gray-600 font-poppins">© 2025 Jastip by Livia. Made with 💖</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage