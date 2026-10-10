import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  PlusCircle, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Clock, 
  Layers, 
  AlertTriangle,
  TrendingUp,
  MoreVertical
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

const Dashboard = () => {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      const res = await axios.get('/api/v1/cases/')
      setCases(res.data)
    } catch (err) {
      console.error("Error fetching cases:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-50 text-blue-600'
      case 'IN_PROGRESS': return 'bg-amber-50 text-amber-600'
      case 'RESOLVED': return 'bg-green-50 text-green-600'
      default: return 'bg-slate-50 text-slate-600'
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-4 md:px-6 pb-20 animate-fade-in">
      <Header />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
           <p className="text-slate-500 text-sm mt-1">Manage and track your active logistics cases.</p>
        </div>
        <button onClick={() => navigate('/search')} className="v-btn-primary">
          <PlusCircle size={18} />
          <span>New Case</span>
        </button>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Cases', value: cases.length, icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Action', value: cases.filter(c => c.status === 'OPEN').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Priority Issues', value: 0, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="surface-card p-6 flex items-center justify-between">
            <div>
              <p className="label-caps mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
            </div>
            <div className={`p-3 ${stat.bg} ${stat.color} rounded-lg`}>
               <stat.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="surface-card overflow-hidden">
        <header className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
           <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-600" />
              Recent Activity
           </h4>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/20 label-caps text-slate-500 border-b border-slate-100">
                <th className="px-6 py-4">Case Reference</th>
                <th className="px-6 py-4 hidden lg:table-cell">Details</th>
                <th className="px-6 py-4 hidden md:table-cell">Status</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                   <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">Fetching records...</td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                   <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium italic">No active cases found.</td>
                </tr>
              ) : (
                cases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => navigate(`/case/${c.id}`)}>
                    <td className="px-6 py-5">
                       <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">#{c.case_id}</span>
                          <span className="text-[11px] text-slate-400">ID: {c.id}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5 hidden lg:table-cell max-w-md">
                      <p className="text-sm text-slate-600 truncate">
                        {c.live_summary || 'Synchronizing details...'}
                      </p>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-tight ${getStatusColor(c.status)}`}>
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <span className="text-xs font-medium text-slate-500">
                          {new Date(c.created_at).toLocaleDateString()}
                       </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
