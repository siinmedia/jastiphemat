import React from 'react'
import { Calendar, MapPin, Phone, Mail, Package, CreditCard, FileText } from 'lucide-react'
import { Pesanan } from '../lib/supabase'

interface CardPesananProps {
  pesanan: Pesanan
  onDetail: () => void
}

const CardPesanan: React.FC<CardPesananProps> = ({ pesanan, onDetail }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'processed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg text-gray-800 font-poppins">{pesanan.nama}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(pesanan.status)}`}>
          {pesanan.status}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={16} className="text-pink-400" />
          <span className="truncate">{pesanan.alamat}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone size={16} className="text-pink-400" />
          <span>{pesanan.no_hp}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail size={16} className="text-pink-400" />
          <span className="truncate">{pesanan.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package size={16} className="text-pink-400" />
          <span className="truncate">{pesanan.barang}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CreditCard size={16} className="text-pink-400" />
          <span>{pesanan.metode_bayar}</span>
        </div>
        {pesanan.catatan && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <FileText size={16} className="text-pink-400 mt-0.5" />
            <span className="truncate">{pesanan.catatan}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-pink-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar size={14} />
          <span>{pesanan.created_at ? new Date(pesanan.created_at).toLocaleDateString('id-ID') : 'N/A'}</span>
        </div>
        <button
          onClick={onDetail}
          className="bg-gradient-to-r from-pink-400 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-pink-500 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
        >
          Lihat Detail
        </button>
      </div>
    </div>
  )
}

export default CardPesanan