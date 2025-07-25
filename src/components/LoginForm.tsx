import React, { useState } from 'react'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface LoginFormProps {
  onLogin: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError('Email atau password salah')
      } else {
        onLogin()
      }
    } catch (err) {
      setError('Terjadi kesalahan, silakan coba lagi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-pink-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 font-poppins">Admin Login</h2>
          <p className="text-gray-600 text-sm mt-2">Masuk ke dashboard admin Jastip by Livia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 font-poppins">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm font-poppins"
                placeholder="admin@jastip.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 font-poppins">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm font-poppins"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-400 hover:text-pink-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white py-3 rounded-xl font-medium hover:from-pink-500 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-poppins"
          >
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm