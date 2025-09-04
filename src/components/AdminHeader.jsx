'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LogOut } from 'lucide-react'

export default function AdminHeader() {
  const { admin, logout } = useAdminAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Image
              src="/lifewood_logo2.png"
              alt="Lifewood Logo"
              width={140}
              height={40}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-sm text-gray-700">
              Welcome, <span className="font-semibold">{admin?.email || 'Admin'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-[#133020] bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#133020] transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}