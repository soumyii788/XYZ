import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  Building2, 
  Globe, 
  ChevronRight, 
  CheckCircle2,
  Loader2
} from 'lucide-react'

const Onboarding = () => {
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')
  const [region, setRegion] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const { user, completeOnboarding } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate('/login')
    if (user?.onboarded) navigate('/')
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/auth/onboard/', {
        username: user.username,
        company_name: companyName,
        role: role,
        region: region
      })
      setSuccess(true)
      completeOnboarding()
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      console.error("Onboarding failed:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      <div className="w-full max-w-lg bg-white border border-slate-200 p-10 md:p-12 rounded-xl shadow-xl shadow-slate-200/50 animate-fade-in relative z-10 overflow-hidden">
        <header className="flex flex-col items-center gap-4 text-center mb-10">
           <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm mb-2">
              <Building2 size={32} />
           </div>
           <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">Complete Setup</h2>
           <p className="text-slate-500 text-sm mt-1 font-medium">Please provide your operational details.</p>
        </header>

        {success ? (
          <div className="flex flex-col items-center gap-6 py-12 animate-fade-in text-center">
             <div className="text-green-500 p-6 bg-green-50 rounded-full border border-green-100 shadow-sm animate-bounce">
                <CheckCircle2 size={48} />
             </div>
             <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Successfully Linked</h3>
                <p className="text-slate-500 text-sm font-medium">Redirecting to your dashboard...</p>
             </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Company Entity</label>
              <input 
                type="text" 
                className="v-input h-[52px] font-medium"
                placeholder="e.g. Global Forwarding INC"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Operational Role</label>
              <div className="relative">
                <select 
                  className="v-input h-[52px] font-medium appearance-none cursor-pointer pr-10"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="" disabled className="bg-white">Select your primary role</option>
                  <option value="SHIPPER" className="bg-white">Shipper / Exporter</option>
                  <option value="FORWARDER" className="bg-white">Freight Forwarder</option>
                  <option value="CARRIER" className="bg-white">Logistics Carrier</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                   <ChevronRight size={16} className="rotate-90" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Network Region</label>
              <div className="relative group">
                <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text" 
                  className="v-input h-[52px] pl-10 font-medium"
                  placeholder="e.g. Western Europe"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="v-btn-primary w-full h-[58px] shadow-lg shadow-blue-500/20 mt-4"
            >
              <span className="font-bold">
                {loading ? 'Processing...' : 'Complete Profile Setup'}
              </span>
              {loading ? <Loader2 size={18} className="animate-spin ml-2" /> : <ChevronRight size={18} className="ml-2" />}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Onboarding
