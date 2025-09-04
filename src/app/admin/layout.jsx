import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import { Toaster } from 'react-hot-toast'

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      {children}
      <Toaster position="top-right" />
    </AdminAuthProvider>
  )
}
