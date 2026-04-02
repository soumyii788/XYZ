import React, { useState } from 'react'
import { 
  User, 
  Building2, 
  Mail, 
  Shield, 
  LogOut, 
  ChevronRight, 
  Settings, 
  Globe,
  ArrowRight,
  Activity
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

const Account = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const profileItems = [
    { label: 'Username', value: user?.username || 'user_admin', icon: User },
    { label: 'Email Address', value: user?.email || 'admin@example.com', icon: Mail },
    { label: 'Role', value: user?.profile?.role || 'Administrator', icon: Shield },
    { label: 'Company', value: user?.profile?.company_name || 'Global Logistics', icon: Building2 },
    { label: 'Region', value: user?.profile?.region || 'Europe', icon: Globe },
  ]

  return (
    <div className="flex flex-col gap-10 w-full max-w-5xl mx-auto px-4 md:px-6 pb-32 animate-fade-in">
      <Header />

      <header className="flex flex-col gap-2 pb-6 border-b border-slate-200">
         <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
         <p className="text-slate-500 text-sm">Manage your profile and platform preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Profile Card */}
        <section className="lg:col-span-2 space-y-8">
           <div className="surface-card p-10 flex flex-col md:flex-row items-center gap-10 bg-white">
              <div className="w-40 h-40 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-5xl border-4 border-white shadow-md shrink-0">
                 {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col gap-4 text-center md:text-left">
                 <div>
                    <h2 className="text-4xl font-bold text-slate-900 tracking-tight">{user?.username || 'Username'}</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Cargo Logic Platform Member</p>
                 </div>
                 <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold border border-blue-100">Verified Account</span>
                    <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-xs font-semibold border border-slate-200">Pro Tier</span>
                 </div>
              </div>
           </div>

           <div className="surface-card p-10 bg-white">
              <h3 className="text-lg font-bold text-slate-800 mb-8 border-b border-slate-50 pb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {profileItems.map((item, i) => (
                   <div key={i} className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-slate-400">
                         <item.icon size={16} />
                         <span className="label-caps text-[10px]">{item.label}</span>
                      </div>
                      <span className="text-lg font-semibold text-slate-800">{item.value}</span>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Sidebar Settings */}
        <section className="space-y-8">
           <div className="surface-card p-8 bg-white border-t-4 border-blue-500">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Settings</h3>
              <div className="flex flex-col gap-2">
                 {[
                   { label: 'Privacy & Security', icon: Shield },
                   { label: 'Global Notifications', icon: Globe },
                   { label: 'Appearance Theme', icon: Activity },
                 ].map((action, i) => (
                   <button key={i} className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-all group">
                      <div className="flex items-center gap-3">
                         <action.icon size={18} />
                         <span className="text-sm font-medium">{action.label}</span>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                   </button>
                 ))}
              </div>
           </div>

           <button 
             onClick={handleLogout}
             className="surface-card p-8 bg-white border-t-4 border-rose-500 hover:bg-rose-50 transition-all group text-left shadow-md hover:shadow-lg"
           >
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors">Sign Out</h3>
                    <p className="text-slate-500 text-xs">Securely end your session</p>
                 </div>
                 <div className="p-3 bg-rose-50 text-rose-500 rounded-lg group-hover:bg-rose-500 group-hover:text-white transition-all">
                    <LogOut size={24} />
                 </div>
              </div>
           </button>
        </section>

      </div>
    </div>
  )
}

export default Account
