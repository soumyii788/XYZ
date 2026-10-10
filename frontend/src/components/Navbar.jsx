import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  BarChart2, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Layers,
  Sparkles
} from 'lucide-react'
import BrandLogo from './BrandLogo'
import { useAuth } from '../context/AuthContext'

const Navbar = ({ onOpenSimulation, onOpenTracking }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { label: 'Dashboard', path: '/' },
    { label: 'Search & Track', path: '/search' },
    { label: 'Technology & AI', path: '/#technology' },
    { label: 'Analytics', path: '/analysis' },
    { label: 'Account', path: '/account' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-[#111827] text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-95 transition-opacity">
            <BrandLogo variant="dark" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path)
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`px-3 py-2 text-xs lg:text-sm font-semibold tracking-wide transition-all duration-150 relative ${
                    active 
                      ? 'text-white' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#d61f26]" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Action Hub */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenTracking}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Search size={14} className="text-[#d61f26]" />
              <span>Track Orders</span>
            </button>

            <button
              onClick={onOpenSimulation}
              className="px-3.5 py-1.5 bg-[#d61f26] hover:bg-[#b91c1c] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus size={14} />
              <span>Ingest Signal</span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <Link 
                to="/account"
                className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white hover:border-[#d61f26] transition-colors"
                title={user?.username || 'User Profile'}
              >
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </Link>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenSimulation}
              className="p-1.5 bg-[#d61f26] text-white rounded text-xs"
              title="Ingest Signal"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0f172a] border-b border-slate-800 px-4 pt-2 pb-5 space-y-1 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded text-sm font-semibold ${
                isActive(link.path) 
                  ? 'bg-slate-800 text-white border-l-2 border-[#d61f26]' 
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenTracking()
              }}
              className="w-full py-2 bg-slate-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Search size={14} className="text-[#d61f26]" />
              <span>Track Orders</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-slate-850 text-slate-400 hover:text-rose-400 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
