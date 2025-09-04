'use client'

import { useRouter } from 'next/navigation'
import { Hourglass, FileSearch, CheckCircle, XCircle } from 'lucide-react'

// Reusable Card styled to match your UI
const Card = ({ title, subtitle, Icon, gradientFrom, gradientTo, iconColor, count, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-4 rounded-lg border border-gray-200 relative overflow-hidden group bg-white hover:shadow-xl transition-shadow duration-300"
    >
      <div 
        className="absolute inset-0 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
        }}
      />
      <Icon 
        className="absolute z-0 -top-8 -right-8 text-8xl text-gray-100/50 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110"
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div 
            className="w-12 h-12 mb-3 rounded-full flex items-center justify-center transition-colors duration-300 bg-gray-100 group-hover:bg-white"
          >
            <Icon 
              className="text-2xl transition-colors duration-300"
              style={{ color: iconColor }}
            />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#133020] group-hover:text-white/90 leading-none">
            {count}
          </div>
        </div>
        <h3 className="font-bold text-xl text-[#133020] group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-500 group-hover:text-white/80 transition-colors duration-300">
          {subtitle}
        </p>
      </div>
    </button>
  )
}

export default function StatusCards({ applications }) {
  const router = useRouter()

  const getStatusCount = (status) => applications.filter(app => app.status === status).length

  // Match database statuses exactly: pending, reviewing, approved, rejected
  const statusConfigs = [
    {
      status: 'pending',
      title: 'Pending',
      Icon: Hourglass,
      gradientFrom: '#fde68a',
      gradientTo: '#f59e0b',
      iconColor: '#f59e0b'
    },
    {
      status: 'reviewing',
      title: 'Reviewing',
      Icon: FileSearch,
      gradientFrom: '#93c5fd',
      gradientTo: '#2563eb',
      iconColor: '#2563eb'
    },
    {
      status: 'approved',
      title: 'Approved',
      Icon: CheckCircle,
      gradientFrom: '#86efac',
      gradientTo: '#15803d',
      iconColor: '#15803d'
    },
    {
      status: 'rejected',
      title: 'Rejected',
      Icon: XCircle,
      gradientFrom: '#f87171',
      gradientTo: '#b91c1c',
      iconColor: '#b91c1c'
    }
  ]

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {statusConfigs.map((config) => (
        <Card
          key={config.status}
          title={config.title}
          subtitle={config.status === 'approved' ? `${getStatusCount(config.status)} application${getStatusCount(config.status) === 1 ? '' : 's'}` : `${getStatusCount(config.status)} application${getStatusCount(config.status) === 1 ? '' : 's'}`}
          Icon={config.Icon}
          gradientFrom={config.gradientFrom}
          gradientTo={config.gradientTo}
          iconColor={config.iconColor}
          count={getStatusCount(config.status)}
          onClick={() => router.push(`/admin?status=${config.status}`)}
        />
      ))}
    </div>
  )
}