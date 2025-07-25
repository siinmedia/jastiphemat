import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Heart, Calendar, MapPin, Phone, Mail, Package, DollarSign, CheckCircle, Clock, X, Download, Share2 } from 'lucide-react'
import { supabase, Pesanan } from '../lib/supabase'

interface InvoiceData {
  id: string
  id_pesanan: string
  harga: number
  fee: number
  diskon: number
  dp: number
  total: number
  status: string
  created_at: string
}

const InvoicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [invoice, setInvoice] = useState<InvoiceData | null>(null)
  const [pesanan, setPesanan] = useState<Pesanan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchInvoiceData()
    }
  }, [id])

  const fetchInvoiceData = async () => {
    try {
      // Fetch invoice data
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoice')
        .select('*')
        .eq('id', id)
        .single()

      if (invoiceError) throw invoiceError
      setInvoice(invoiceData)

      // Fetch pesanan data
      const { data: pesananData, error: pesananError } = await supabase
        .from('pesanan')
        .select('*')
        .eq('id', invoiceData.id_pesanan)
        .single()

      if (pesananError) throw pesananError
      setPesanan(pesananData)
    } catch (error) {
      console.error('Error fetching invoice data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <Heart className="text-white" size={24} />
          </div>
          <p className="text-gray-600 font-poppins">Memuat invoice...</p>
        </div>
      </div>
    )
  }

  if (!invoice || !pesanan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="text-red-500" size={24} />
          </div>
          <p className="text-gray-600 font-poppins">Invoice tidak ditemukan</p>
        </div>
      </div>
    )
  }

  const sisaBayar = invoice.total - invoice.dp

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Invoice Jastip by Livia',
          text: `Invoice untuk pesanan ${pesanan.nama}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link invoice berhasil disalin!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:py-4">
      <div className="max-w-4xl mx-auto">
        {/* Action Buttons - Hidden when printing */}
        <div className="flex justify-end gap-3 mb-6 print:hidden">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors font-poppins"
          >
            <Share2 size={16} />
            Share
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors font-poppins"
          >
            <Download size={16} />
            Print/Save
          </button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-8 mb-6 print:shadow-none print:border-gray-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 font-poppins">Jastip by Livia</h1>
                <p className="text-gray-600 text-sm font-poppins">Layanan Titip Beli Terpercaya</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600 font-poppins">Invoice ID</p>
              <p className="font-mono text-gray-800">{invoice.id}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-2 mt-1">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-500">{new Date(invoice.created_at).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {invoice.status === 'lunas' ? (
                  <>
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-green-600 font-medium text-sm font-poppins">LUNAS</span>
                  </>
                ) : (
                  <>
                    <Clock size={16} className="text-yellow-500" />
                    <span className="text-yellow-600 font-medium text-sm font-poppins">BELUM LUNAS</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 font-poppins">Detail Pemesan</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Nama:</span>
                  <span>{pesanan.nama}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-pink-400 mt-0.5" />
                  <span>{pesanan.alamat}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-pink-400" />
                  <span>{pesanan.no_hp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-pink-400" />
                  <span>{pesanan.email}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 font-poppins">Detail Pesanan</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Package size={16} className="text-pink-400 mt-0.5" />
                  <span>{pesanan.barang}</span>
                </div>
                <div>
                  <span className="font-medium">Metode Bayar:</span>
                  <span className="ml-2">{pesanan.metode_bayar}</span>
                </div>
                {pesanan.catatan && (
                  <div>
                    <span className="font-medium">Catatan:</span>
                    <span className="ml-2">{pesanan.catatan}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-pink-400" />
                  <span>{new Date(invoice.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-8 print:shadow-none print:border-gray-300">
          <h2 className="text-xl font-bold text-gray-800 mb-6 font-poppins flex items-center gap-2">
            <DollarSign size={24} className="text-pink-500" />
            Rincian Pembayaran
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-pink-100">
              <span className="text-gray-700 font-poppins">Harga Barang</span>
              <span className="font-medium font-poppins">Rp {invoice.harga.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-pink-100">
              <span className="text-gray-700 font-poppins">Fee Jastip</span>
              <span className="font-medium font-poppins">Rp {invoice.fee.toLocaleString('id-ID')}</span>
            </div>
            {invoice.diskon > 0 && (
              <div className="flex justify-between py-2 border-b border-pink-100">
                <span className="text-gray-700 font-poppins">Diskon</span>
                <span className="font-medium text-green-600 font-poppins">-Rp {invoice.diskon.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between py-4 border-b-2 border-pink-200 bg-pink-50 px-4 rounded-lg">
              <span className="text-lg font-semibold text-gray-800 font-poppins">Total</span>
              <span className="text-xl font-bold text-pink-600 font-poppins">Rp {invoice.total.toLocaleString('id-ID')}</span>
            </div>
            
            {invoice.dp > 0 && (
              <>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700 font-poppins">DP Sudah Dibayar</span>
                  <span className="font-medium text-blue-600 font-poppins">Rp {invoice.dp.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between py-4 bg-red-50 px-4 rounded-xl border border-red-200">
                  <span className="text-lg font-semibold text-gray-800 font-poppins">Sisa Bayar</span>
                  <span className="text-xl font-bold text-red-600 font-poppins">Rp {sisaBayar.toLocaleString('id-ID')}</span>
                </div>
              </>
            )}
          </div>

          {/* Payment Status */}
          <div className="mt-8 text-center">
            {invoice.status === 'lunas' ? (
              <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-green-700 font-semibold font-poppins text-lg">✅ Pembayaran Lunas</p>
                <p className="text-green-600 text-sm font-poppins">Terima kasih atas kepercayaan Anda!</p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-yellow-700 font-semibold font-poppins text-lg">⏳ Menunggu Pembayaran</p>
                <p className="text-yellow-600 text-sm font-poppins">
                  {sisaBayar > 0 ? `Sisa pembayaran: Rp ${sisaBayar.toLocaleString('id-ID')}` : 'Segera lakukan pembayaran sesuai total di atas'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-6 mt-6 print:shadow-none print:border-gray-300">
          <h3 className="font-semibold text-gray-800 mb-3 font-poppins">Informasi Kontak</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 font-poppins">WhatsApp Admin:</p>
              <p className="font-medium text-pink-600 font-poppins">+62 812-3456-7890</p>
            </div>
            <div>
              <p className="text-gray-600 font-poppins">Email:</p>
              <p className="font-medium text-pink-600 font-poppins">admin@jastipbylivia.com</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 print:mt-4">
          <p className="text-gray-500 text-sm font-poppins">© 2025 Jastip by Livia. Made with 💖</p>
          <p className="text-gray-400 text-xs font-poppins mt-1">Layanan jastip terpercaya untuk kebutuhan belanja Anda</p>
        </div>
      </div>
    </div>
  )
}

export default InvoicePage