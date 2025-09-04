'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AdminAuthContext = createContext()

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const SESSION_HOURS = 2 // auto-logout after 2 hours of inactivity

  useEffect(() => {
    // Check if admin is logged in on page load
    const checkAuth = () => {
      const adminData = localStorage.getItem('admin')
      const lastActive = parseInt(localStorage.getItem('admin_last_active') || '0', 10)
      const now = Date.now()
      const maxIdleMs = SESSION_HOURS * 60 * 60 * 1000

      if (adminData && lastActive && now - lastActive < maxIdleMs) {
        setAdmin(JSON.parse(adminData))
      } else {
        localStorage.removeItem('admin')
        localStorage.removeItem('admin_last_active')
      }
      setLoading(false)
    }
    checkAuth()

    // Activity listeners to refresh last active time
    const bump = () => localStorage.setItem('admin_last_active', String(Date.now()))
    window.addEventListener('mousemove', bump)
    window.addEventListener('keydown', bump)
    window.addEventListener('click', bump)

    // Periodic idle check
    const interval = setInterval(() => {
      const last = parseInt(localStorage.getItem('admin_last_active') || '0', 10)
      if (admin && last) {
        const nowTs = Date.now()
        if (nowTs - last >= SESSION_HOURS * 60 * 60 * 1000) {
          // auto logout
          setAdmin(null)
          localStorage.removeItem('admin')
          localStorage.removeItem('admin_last_active')
        }
      }
    }, 60 * 1000) // check every minute

    return () => {
      window.removeEventListener('mousemove', bump)
      window.removeEventListener('keydown', bump)
      window.removeEventListener('click', bump)
      clearInterval(interval)
    }
  }, [])

  const login = async (email, password) => {
    try {
      // First, check hardcoded admin credentials
      if (email === 'admin@lifewood.com' && password === 'admin123') {
        const adminData = {
          id: 'default-admin',
          email: email,
          name: 'Admin User'
        }
        setAdmin(adminData)
        localStorage.setItem('admin', JSON.stringify(adminData))
        return { success: true }
      }

      // If not hardcoded, try database authentication
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (result.success) {
        setAdmin(result.admin)
        localStorage.setItem('admin', JSON.stringify(result.admin))
        localStorage.setItem('admin_last_active', String(Date.now()))
        return { success: true }
      } else {
        return { success: false, error: result.error || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem('admin')
    localStorage.removeItem('admin_last_active')
  }

  const value = {
    admin,
    loading,
    login,
    logout
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
