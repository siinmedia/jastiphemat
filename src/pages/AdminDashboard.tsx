import React, { useState, useEffect } from 'react'
import { LogOut, Plus, DollarSign, Package, TrendingUp, Eye } from 'lucide-react'
import { supabase, Pesanan } from '../lib/supabase'
import CardPesanan from '../components/CardPesanan'
import InvoiceModal from '../components/InvoiceModal'

interface AdminDashboardProps {
  onLogout: () => void
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [pesananList, setPesananList] = useState<Pesanan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPesanan, setSelectedPesanan] = useState<Pesanan | null>(null)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [stats, setStats] = useState({
    totalPesanan: 0,
    totalPenghasilan: 0,
    totalDP: 0
  })

  useEffect(() => {
    fetchPesanan()
    fetchStats()
  }, [])

  const fetchPesanan = async () => {
    try {
      const { data, error } = await supabase
        .from('pesanan')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPesananList(data || [])
    } catch (error) {
      console.error('Error fetching pesanan:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Fetch total pesanan
      const { count: totalPesanan } = await supabase
        .from('pesanan')
        .select('*', { count: 'exact', head: true })

      // Fetch invoice data for stats
      const { data: invoices } = await supabase
        .from('invoice')
        .select('total, dp, status')

      const totalPenghasilan = invoices?.reduce((sum, inv) => sum + (inv.status === 'lunas' ? inv.total : 0), 0) || 0
      const totalDP = invoices?.reduce((sum, inv) => sum + inv.dp, 0) || 0

      setStats({
        totalPesanan: totalPesanan || 0,
        totalPenghasilan,
        totalDP
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleDetailClick = (pesanan: Pesanan) => {
    setSelectedPesanan(pesanan)
    setShowInvoiceModal(true)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    onLogout()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <Package className="text-white" size={24} />
          </div>
          <p className="text-gray-600 font-poppins">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-800 font-poppins">Dashboard Admin</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium font-poppins"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-poppins">Total Pesanan</p>
                <p className="text-3xl font-bold text-gray-800 font-poppins">{stats.totalPesanan}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-poppins">Total Penghasilan</p>
                <p className="text-3xl font-bold text-gray-800 font-poppins">
                  Rp {stats.totalPenghasilan.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-poppins">Total DP</p>
                <p className="text-3xl font-bold text-gray-800 font-poppins">
                  Rp {stats.totalDP.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <TrendingUp className="text-pink-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Pesanan List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 font-poppins">Daftar Pesanan</h2>
            <div className="flex gap-3">
              <div className="text-sm text-gray-600 font-poppins">
                Total: <span className="font-semibold text-gray-800">{pesananList.length} pesanan</span>
              </div>
              <button
                onClick={fetchPesanan}
                className="bg-gradient-to-r from-pink-400 to-pink-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-pink-500 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 font-poppins"
              >
                Refresh
              </button>
            </div>
          </div>

          {pesananList.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-poppins">Belum ada pesanan masuk hari ini</p>
              <p className="text-gray-400 text-sm font-poppins mt-2">Pesanan baru akan muncul di sini secara otomatis</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pesananList.map((pesanan) => (
                <CardPesanan
                  key={pesanan.id}
                  pesanan={pesanan}
                  onDetail={() => handleDetailClick(pesanan)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedPesanan && (
        <InvoiceModal
          pesanan={selectedPesanan}
          onClose={() => {
            setShowInvoiceModal(false)
            setSelectedPesanan(null)
            fetchStats() // Refresh stats after invoice creation
          }}
        />
      )}
    </div>
  )
}

export default AdminDashboard