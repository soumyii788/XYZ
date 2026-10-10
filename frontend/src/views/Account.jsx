import React from 'react'
import { 
  User, 
  Building2, 
  Mail, 
  Shield, 
  LogOut, 
  ChevronRight, 
  Globe,
  Activity
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Account = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const profileItems = [
    { label: 'Carrier Username', value: user?.username || 'operator_admin', icon: User },
    { label: 'Email Address', value: user?.email || 'admin@xyzlogistics.com', icon: Mail },
    { label: 'Role', value: user?.profile?.role || 'Carrier Operations Lead', icon: Shield },
    { label: 'Company', value: user?.profile?.company_name || 'XYZ Logistics Enterprise', icon: Building2 },
    { label: 'Region', value: user?.profile?.region || 'India & South Asia Hub', icon: Globe },
  ]

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 md:px-6 py-8 pb-32 animate-fade-in text-slate-800">
      
      <header className="flex flex-col gap-2 pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#d61f26]/10 text-[#d61f26] text-[11px] font-bold uppercase tracking-wider rounded-xs w-fit">
          Portal Identity
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account & Organisation Settings</h1>
        <p className="text-slate-500 text-sm">Manage logistics operator credentials, company profile, and platform preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <section className="lg:col-span-2 space-y-6">
          <div className="surface-card p-8 flex flex-col sm:flex-row items-center gap-8 bg-white border border-slate-200">
            <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-800 text-4xl border-4 border-slate-50 shadow-inner shrink-0">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{user?.username || 'Carrier Operator'}</h2>
                <p className="text-slate-500 text-xs font-medium mt-0.5">XYZ Logistics Portal Member</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                <span className="px-2.5 py-0.5 bg-red-50 text-[#d61f26] rounded-xs text-[11px] font-bold border border-red-200">
                  Verified Operator
                </span>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-xs text-[11px] font-bold">
                  Enterprise Tier
                </span>
              </div>
            </div>
          </div>

          <div className="surface-card p-8 bg-white border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
              Profile Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {profileItems.map((item, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-slate-400">
                    <item.icon size={15} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sidebar Settings & Sign Out */}
        <section className="space-y-6">
          <div className="surface-card p-6 bg-white border border-slate-200 border-t-4 border-t-[#d61f26]">
            <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wider">
              Quick Preferences
            </h3>
            <div className="flex flex-col gap-1">
              {[
                { label: 'Carrier Security & Auth', icon: Shield },
                { label: 'Dispatch Alerts', icon: Globe },
                { label: 'Telemetry Settings', icon: Activity },
              ].map((action, i) => (
                <button key={i} className="flex items-center justify-between p-3 rounded-xs hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all text-xs font-medium group">
                  <div className="flex items-center gap-2.5">
                    <action.icon size={16} className="text-slate-400 group-hover:text-[#d61f26] transition-colors" />
                    <span>{action.label}</span>
                  </div>
                  <ChevronRight size={15} className="text-slate-300 group-hover:text-[#d61f26] transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full surface-card p-6 bg-white border border-slate-200 border-t-4 border-t-rose-600 hover:bg-rose-50/50 transition-all text-left shadow-sm group"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors">Sign Out</h3>
                <p className="text-slate-500 text-xs">Terminate active portal session</p>
              </div>
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded group-hover:bg-rose-600 group-hover:text-white transition-all">
                <LogOut size={20} />
              </div>
            </div>
          </button>
        </section>

      </div>
    </div>
  )
}

export default Account
