import React, { useState } from 'react'
import { X, DollarSign, Calculator, FileText, Eye } from 'lucide-react'
import { supabase, Pesanan } from '../lib/supabase'
import FormInput from './FormInput'

interface InvoiceModalProps {
  pesanan: Pesanan
  onClose: () => void
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ pesanan, onClose }) => {
  const [invoiceData, setInvoiceData] = useState({
    harga: '',
    fee: '',
    diskon: '',
    dp: '',
    status: 'belum_lunas'
  })
  const [loading, setLoading] = useState(false)
  const [invoiceLink, setInvoiceLink] = useState('')

  const handleInputChange = (field: string, value: string) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }))
  }

  const calculateTotal = () => {
    const harga = parseFloat(invoiceData.harga) || 0
    const fee = parseFloat(invoiceData.fee) || 0
    const diskon = parseFloat(invoiceData.diskon) || 0
    return harga + fee - diskon
  }

  const handleGenerateInvoice = async () => {
    setLoading(true)
    try {
      const total = calculateTotal()
      const { data, error } = await supabase
        .from('invoice')
        .insert([{
          id_pesanan: pesanan.id,
          harga: parseFloat(invoiceData.harga) || 0,
          fee: parseFloat(invoiceData.fee) || 0,
          diskon: parseFloat(invoiceData.diskon) || 0,
          dp: parseFloat(invoiceData.dp) || 0,
          total,
          status: invoiceData.status
        }])
        .select()

      if (error) throw error

      const invoiceId = data[0].id
      const link = `${window.location.origin}/invoice/${invoiceId}`
      setInvoiceLink(link)
    } catch (error) {
      console.error('Error generating invoice:', error)
      alert('Terjadi kesalahan saat membuat invoice')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invoiceLink)
    alert('Link invoice berhasil disalin!')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-pink-100">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 font-poppins">Detail & Invoice</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Pesanan Details */}
          <div className="bg-pink-50 p-4 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-3 font-poppins">Detail Pesanan</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Nama:</strong> {pesanan.nama}</div>
              <div><strong>Email:</strong> {pesanan.email}</div>
              <div><strong>HP:</strong> {pesanan.no_hp}</div>
              <div><strong>Alamat:</strong> {pesanan.alamat}</div>
              <div><strong>Barang:</strong> {pesanan.barang}</div>
              <div><strong>Metode Bayar:</strong> {pesanan.metode_bayar}</div>
              {pesanan.catatan && <div><strong>Catatan:</strong> {pesanan.catatan}</div>}
            </div>
          </div>

          {/* Invoice Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 font-poppins flex items-center gap-2">
              <Calculator size={20} />
              Buat Invoice Profesional
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label="Harga Barang"
                type="number"
                value={invoiceData.harga}
                onChange={(value) => handleInputChange('harga', value)}
                placeholder="0"
                required
              />
              <FormInput
                label="Fee Jastip"
                type="number"
                value={invoiceData.fee}
                onChange={(value) => handleInputChange('fee', value)}
                placeholder="0"
                required
              />
              <FormInput
                label="Diskon"
                type="number"
                value={invoiceData.diskon}
                onChange={(value) => handleInputChange('diskon', value)}
                placeholder="0"
              />
              <FormInput
                label="DP (Down Payment)"
                type="number"
                value={invoiceData.dp}
                onChange={(value) => handleInputChange('dp', value)}
                placeholder="0"
              />
            </div>

            <FormInput
              label="Status Pembayaran"
              type="select"
              value={invoiceData.status}
              onChange={(value) => handleInputChange('status', value)}
              options={[
                { value: 'belum_lunas', label: 'Belum Lunas' },
                { value: 'lunas', label: 'Lunas' }
              ]}
            />

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-lg font-semibold text-gray-800 font-poppins">
                💰 Total Pembayaran: Rp {calculateTotal().toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {!invoiceLink ? (
              <button
                onClick={handleGenerateInvoice}
                disabled={loading || !invoiceData.harga}
                className="flex-1 bg-gradient-to-r from-pink-400 to-pink-500 text-white py-3 rounded-xl font-medium hover:from-pink-500 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-poppins flex items-center justify-center gap-2"
              >
                <FileText size={20} />
                {loading ? 'Membuat Invoice...' : 'Generate Invoice'}
              </button>
            ) : (
              <div className="flex-1 space-y-3">
                <div className="bg-green-50 border border-green-200 p-3 rounded-xl">
                  <p className="text-sm text-green-600 font-medium font-poppins">✅ Invoice profesional berhasil dibuat!</p>
                  <p className="text-xs text-green-600 mt-1 break-all">{invoiceLink}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors font-poppins"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => window.open(invoiceLink, '_blank')}
                    className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-pink-600 transition-colors font-poppins flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    Preview
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceModal