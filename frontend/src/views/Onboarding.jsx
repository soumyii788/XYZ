import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  Building2, 
  Globe, 
  ChevronRight, 
  CheckCircle2,
  Loader2,
  User,
  Shield
} from 'lucide-react'
import BrandLogo from '../components/BrandLogo'

const Onboarding = () => {
  const { user, completeOnboarding, updateUser } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState(user?.username || '')
  const [companyName, setCompanyName] = useState('XYZ Logistics Partner')
  const [role, setRole] = useState('CARRIER')
  const [region, setRegion] = useState('South Asia & India Hub')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!user) navigate('/login')
    if (user?.onboarded) navigate('/')
    if (user?.username) setUsername(user.username)
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // If username changed, update it first
      if (username.trim() && username.trim() !== user?.username) {
        await axios.post('/api/v1/auth/update-user/', {
          current_username: user?.username,
          new_username: username.trim(),
          email: user?.email
        })
        updateUser({ username: username.trim() })
      }

      await axios.post('/api/v1/auth/onboard/', {
        username: username.trim() || user?.username,
        company_name: companyName,
        role: role,
        region: region
      })

      setSuccess(true)
      completeOnboarding()
      setTimeout(() => navigate('/'), 1800)
    } catch (err) {
      console.error("Onboarding failed:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-slate-900 relative overflow-hidden text-slate-800">
      <div className="absolute inset-0 bg-radial from-slate-800 to-slate-950 pointer-events-none" />

      <div className="w-full max-w-lg bg-white border border-slate-200 p-8 sm:p-10 rounded-lg shadow-2xl animate-fade-in relative z-10">
        
        <header className="flex flex-col items-center gap-3 text-center mb-8">
          <BrandLogo variant="light" className="mb-2" />
          <h2 className="text-2xl font-black tracking-tight text-slate-900 leading-none">
            Complete Operator Setup
          </h2>
          <p className="text-slate-500 text-xs font-medium">
            Configure your enterprise logistics identity and operations profile.
          </p>
        </header>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-8 animate-fade-in text-center">
            <div className="text-emerald-600 p-4 bg-emerald-50 rounded-full border border-emerald-100 shadow-sm animate-bounce">
              <CheckCircle2 size={40} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
                Profile Verified & Linked
              </h3>
              <p className="text-slate-500 text-xs font-medium">
                Redirecting to your XYZ Logistics portal...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Display / Operator Name */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Carrier Username / Display Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  className="v-input pl-10 text-xs"
                  placeholder="e.g. Saumya Shukla"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Company Name */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Company Entity
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  className="v-input pl-10 text-xs"
                  placeholder="e.g. Global Forwarding & Logistics INC"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Operational Role */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Operational Role
              </label>
              <div className="relative">
                <select 
                  className="v-input text-xs appearance-none cursor-pointer pr-10"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="SHIPPER">Shipper (Manufacturer / Retailer)</option>
                  <option value="FORWARDER">Freight Forwarder / Agent</option>
                  <option value="CARRIER">Shipping Line / Carrier Linehaul</option>
                  <option value="CHB">Customs House Broker</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight size={14} className="rotate-90" />
                </div>
              </div>
            </div>

            {/* Network Region */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Network Hub & Region
              </label>
              <div className="relative">
                <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  className="v-input pl-10 text-xs"
                  placeholder="e.g. Mumbai Hub / Europe Linehaul"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="v-btn-primary w-full py-3 mt-3 shadow-md shadow-[#d61f26]/20"
            >
              <span className="text-xs font-bold uppercase tracking-wider">
                {loading ? 'Finalizing Profile...' : 'Complete Profile Setup'}
              </span>
              {loading ? (
                <Loader2 size={15} className="animate-spin ml-2" />
              ) : (
                <ChevronRight size={15} className="ml-1" />
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Onboarding
