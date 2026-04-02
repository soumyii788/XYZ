import React from 'react'
import { Search, Bell, Hash } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const { user } = useAuth()

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-2">
      {/* Search Nexus - Simplified for clarity */}
      <div className="relative flex-1 w-full max-w-xl group">
        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent-primary transition-colors" />
        <input 
          type="text" 
          className="v-input pl-14 shadow-sm border-slate-200" 
          placeholder="Search cases, containers, or invoices..." 
        />
      </div>

      {/* Action Hub */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
        <div className="flex items-center gap-1">
          <button className="p-3 text-slate-400 hover:text-accent-primary transition-all hover:bg-slate-100 rounded-xl border border-transparent">
            <Bell size={20} strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="flex items-center gap-3 p-1.5 pr-5 bg-white rounded-full border border-slate-200 shadow-sm hover:border-accent-primary/30 transition-all cursor-pointer group">
           <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center font-bold text-accent-primary text-base">
             {user?.username?.[0]?.toUpperCase() || 'U'}
           </div>
           <div className="flex flex-col hidden sm:flex">
              <span className="text-xs font-bold text-slate-900 leading-none group-hover:text-accent-primary transition-colors">{user?.username || 'User'}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized</span>
           </div>
        </div>
      </div>
    </header>
  )
}

export default Header
