'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import toast, { Toaster } from 'react-hot-toast'
import Image from 'next/image'
import { LogIn, User, Lock, Eye, EyeOff } from 'lucide-react'

const InputField = ({ id, label, type, value, onChange, required, icon }) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-[#133020]">
        {label}
      </label>
      <div className="relative mt-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </div>
        <input
          id={id}
          name={id}
          type={isPassword && showPassword ? 'text' : type}
          required={required}
          value={value}
          onChange={onChange}
          className="block w-full rounded-md border-gray-300 bg-white/50 p-3 pl-10 pr-10 shadow-sm focus:border-[#046241] focus:ring focus:ring-[#046241] focus:ring-opacity-50 transition-colors"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdminAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await login(email, password)
    
    if (result.success) {
      router.push('/admin')
    } else {
      toast.error(result.error || 'Login failed. Please check your credentials.')
    }
    
    setLoading(false)
  }

  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { background: '#133020', color: '#ffffff' },
        }}
      />
             <div className="min-h-screen bg-gradient-to-br from-[#133020] to-[#4ade80] flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto bg-[#f5eedb] rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10">
          
          <div className="text-center mb-8">
            <Image
              src="/lifewood_logo2.png"
              alt="Lifewood Logo"
              width={180}
              height={55}
              className="mx-auto"
            />
          </div>
          
          <h2 className="text-center text-xl sm:text-2xl font-bold text-[#133020]">
            Administrator Login
          </h2>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <InputField
              id="email"
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<User className="h-5 w-5 text-gray-400" />}
            />

            <InputField
              id="password"
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-5 w-5 text-gray-400" />}
            />

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 mt-4 rounded-lg font-semibold text-white bg-[#046241] hover:bg-[#133020] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#f5eedb] focus:ring-[#046241] disabled:opacity-60 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}