import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { supabase } from './lib/supabase'
import LandingPage from './pages/LandingPage'
import FormPage from './pages/FormPage'
import AdminDashboard from './pages/AdminDashboard'
import InvoicePage from './pages/InvoicePage'
import LoginForm from './components/LoginForm'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <p className="text-gray-600 font-poppins">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="font-poppins">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/invoice/:id" element={<InvoicePage />} />
          <Route 
            path="/admin" 
            element={
              isAuthenticated ? (
                <AdminDashboard onLogout={() => setIsAuthenticated(false)} />
              ) : (
                <LoginForm onLogin={() => setIsAuthenticated(true)} />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App