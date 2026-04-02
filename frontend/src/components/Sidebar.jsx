import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Search, 
  Plus, 
  BarChart2, 
  User,
  Settings
} from 'lucide-react'

const Sidebar = ({ onPlusClick }) => {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/', id: 'nav-home' },
    { icon: Search, label: 'Search', path: '/search', id: 'nav-search' },
    { icon: BarChart2, label: 'Analytics', path: '/analysis', id: 'nav-stats' },
    { icon: User, label: 'Account', path: '/account', id: 'nav-account' },
  ]

  return (
    <aside className="hidden lg:flex w-[260px] h-screen bg-slate-50 border-r border-slate-200 p-6 flex-col sticky top-0 z-50">
      <div className="mb-10 px-2">
         <h1 className="text-2xl font-bold tracking-tight text-slate-900">XYZ</h1>
         <p className="label-caps mt-1">Cargo Logic</p>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link 
            key={item.id}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-bold ${
              isActive(item.path) 
                ? 'bg-accent-primary/10 text-accent-primary shadow-[0_0_20px_rgba(79,70,229,0.1)]' 
                : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'
            } active:scale-95`}
          >
            <item.icon size={20} strokeWidth={isActive(item.path) ? 3 : 2} />
            <span className="leading-none">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-10">
        <button 
          onClick={onPlusClick}
          className="v-btn-primary w-full h-[56px] shadow-lg shadow-accent-primary/25"
        >
          <Plus size={20} strokeWidth={3} />
          <span className="uppercase tracking-widest text-[11px]">New Case</span>
        </button>
      </div>

      <div className="mt-auto">
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
           <div className="flex items-center justify-between mb-2">
              <span className="label-caps text-[10px]">Cloud Sync</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.3)]"></div>
           </div>
           <span className="text-xs text-slate-600 font-medium leading-tight">Data Synchronized</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
