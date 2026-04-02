import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Search, 
  Plus, 
  BarChart2, 
  User 
} from 'lucide-react'

const BottomNav = ({ onPlusClick }) => {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed bottom-8 left-6 right-6 z-[1000] lg:hidden animate-fade-in">
      <div className="bg-white/90 backdrop-blur-2xl flex justify-around items-center h-[72px] px-4 shadow-xl shadow-slate-200/50 border border-white/60 rounded-[2rem]">
        <Link to="/" className={`flex flex-col items-center gap-1.5 flex-1 transition-all active:scale-90 ${isActive('/') ? 'text-accent-primary drop-shadow-[0_0_8px_rgba(79,70,229,0.3)]' : 'text-slate-400 hover:text-slate-600'}`}>
          <Home size={22} strokeWidth={isActive('/') ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest leading-none">Home</span>
        </Link>
        
        <Link to="/search" className={`flex flex-col items-center gap-1.5 flex-1 transition-all active:scale-90 ${isActive('/search') ? 'text-accent-primary drop-shadow-[0_0_8px_rgba(79,70,229,0.3)]' : 'text-slate-400 hover:text-slate-600'}`}>
          <Search size={22} strokeWidth={isActive('/search') ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest leading-none">Search</span>
        </Link>

        {/* Central Action Button */}
        <div className="group cursor-pointer mx-2" onClick={onPlusClick}>
          <div className="w-14 h-14 bg-accent-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-accent-primary/40 transition-all hover:scale-110 active:scale-90 relative -top-6">
            <Plus size={32} strokeWidth={3} />
          </div>
        </div>

        <Link to="/analysis" className={`flex flex-col items-center gap-1.5 flex-1 transition-all active:scale-90 ${isActive('/analysis') ? 'text-accent-primary drop-shadow-[0_0_8px_rgba(79,70,229,0.3)]' : 'text-slate-400 hover:text-slate-600'}`}>
          <BarChart2 size={22} strokeWidth={isActive('/analysis') ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest leading-none">Stats</span>
        </Link>

        <Link to="/account" className={`flex flex-col items-center gap-1.5 flex-1 transition-all active:scale-90 ${isActive('/account') ? 'text-accent-primary drop-shadow-[0_0_8px_rgba(79,70,229,0.3)]' : 'text-slate-400 hover:text-slate-600'}`}>
          <User size={22} strokeWidth={isActive('/account') ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest leading-none">User</span>
        </Link>
      </div>
    </nav>
  )
}

export default BottomNav
