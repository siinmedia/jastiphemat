import React, { useState } from 'react'
import { ArrowLeft, Heart, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput'
import { supabase } from '../lib/supabase'

const FormPage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    no_hp: '',
    email: '',
    barang: '',
    metode_bayar: '',
    catatan: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('pesanan')
        .insert([{
          ...formData,
          status: 'pending'
        }])

      if (error) {
        throw error
      }

      setSuccess(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Terjadi kesalahan saat mengirim pesanan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-pink-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-poppins">Pesanan Berhasil!</h2>
          <p className="text-gray-600 mb-6 font-poppins">
            Terima kasih! Pesanan kamu sudah diterima. Livia akan segera menghubungi untuk konfirmasi.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-pink-400 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-pink-500 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 font-poppins"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium font-poppins"
            >
              <ArrowLeft size={20} />
              Kembali
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="text-white" size={16} />
              </div>
              <span className="text-lg font-bold text-gray-800 font-poppins">Jastip by Livia</span>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-pink-100">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4 font-poppins">Form Titip Barang</h1>
              <p className="text-gray-600 font-poppins">Isi data lengkap untuk memulai pesanan jastip kamu</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="Nama Lengkap"
                value={formData.nama}
                onChange={(value) => handleInputChange('nama', value)}
                placeholder="Masukkan nama lengkap"
                required
              />

              <FormInput
                label="Alamat Lengkap"
                type="textarea"
                value={formData.alamat}
                onChange={(value) => handleInputChange('alamat', value)}
                placeholder="Jl. Contoh No. 123, RT/RW 01/02, Kelurahan, Kecamatan, Kota, Kode Pos"
                required
                rows={3}
              />

              <FormInput
                label="Nomor HP / WhatsApp"
                type="tel"
                value={formData.no_hp}
                onChange={(value) => handleInputChange('no_hp', value)}
                placeholder="08xxxxxxxxxx"
                required
              />

              <FormInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                placeholder="email@example.com"
                required
              />

              <FormInput
                label="Barang yang Ingin Dititipkan"
                type="textarea"
                value={formData.barang}
                onChange={(value) => handleInputChange('barang', value)}
                placeholder="Contoh: Tas LV Neverfull MM warna hitam, Sepatu Nike Air Force 1 size 40, dll. Sebutkan merek, ukuran, warna, dan detail lainnya"
                required
                rows={4}
              />

              <FormInput
                label="Metode Pembayaran"
                type="select"
                value={formData.metode_bayar}
                onChange={(value) => handleInputChange('metode_bayar', value)}
                required
                options={[
                  { value: 'COD', label: 'COD (Cash on Delivery)' },
                  { value: 'Transfer', label: 'Transfer Bank' }
                ]}
              />

              <FormInput
                label="Catatan Tambahan"
                type="textarea"
                value={formData.catatan}
                onChange={(value) => handleInputChange('catatan', value)}
                placeholder="Catatan khusus atau permintaan tambahan (opsional)"
                rows={3}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-pink-500 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-poppins"
              >
                {loading ? 'Mengirim Pesanan...' : 'Kirim Pesanan 💖'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormPage