import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  AlertCircle, 
  Lock,
  User,
  Shield,
  ArrowRight
} from 'lucide-react'
import BrandLogo from '../components/BrandLogo'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const endpoint = isLogin ? '/api/v1/auth/login/' : '/api/v1/auth/register/'
    const payload = { username: email, password, email: email }

    try {
      const res = await axios.post(endpoint, payload)
      if (res.data.status === 'success') {
        login(res.data.user)
        res.data.onboarded ? navigate('/') : navigate('/onboarding')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Access Denied. Check credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-900 relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-radial from-slate-800 to-slate-950 pointer-events-none" />
      
      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <BrandLogo variant="dark" className="scale-125 mb-4" />
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
            Enterprise Logistics Management Portal
          </p>
        </div>

        <div className="bg-white rounded-lg p-8 sm:p-10 shadow-2xl border border-slate-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {isLogin ? 'Sign In to Portal' : 'Register Account'}
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Enter your credentials to access live cases and carrier telemetry.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Username / Carrier Email
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  className="v-input pl-10 text-xs" 
                  placeholder="e.g. operator@xyzlogistics.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" 
                  className="v-input pl-10 text-xs font-mono" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded border border-slate-100 mt-1">
                <Shield size={14} className="text-[#d61f26]" />
                <p className="text-[11px] font-medium text-slate-600">
                  Demo password: <span className="font-mono font-bold text-slate-900">123456</span>
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded flex items-center gap-2 text-rose-700 text-xs font-semibold animate-fade-in">
                <AlertCircle className="shrink-0" size={16} />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="v-btn-primary w-full py-3 mt-2 shadow-md shadow-[#d61f26]/20"
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-semibold text-[#d61f26] hover:text-[#b91c1c] transition-colors"
            >
              {isLogin ? "Need a carrier portal account? Register here" : "Existing account? Return to Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
