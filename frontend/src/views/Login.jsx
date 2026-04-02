import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  ChevronRight, 
  AlertCircle, 
  Lock,
  User,
  Shield,
  ArrowRight
} from 'lucide-react'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // Payload uses 'username' but we collect it as 'email' for the login logic
    const endpoint = isLogin ? '/api/auth/login/' : '/api/auth/register/'
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
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="flex flex-col items-center mb-10 text-center">
           <h1 className="text-4xl font-bold tracking-tight text-slate-900">XYZ</h1>
           <p className="text-slate-500 font-medium mt-1">Logistics Management Platform</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-10 md:p-12 shadow-xl shadow-slate-200/50">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
            <p className="text-slate-500 text-sm mt-1">Please sign in to your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Username / Email</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text" 
                  className="v-input pl-12 h-[52px]" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="password" 
                  className="v-input pl-12 h-[52px]" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg mt-1 border border-slate-100">
                 <Shield size={14} className="text-blue-600" />
                 <p className="text-[10px] font-medium text-slate-500">
                    Security Login: <span className="font-mono text-xs font-bold text-slate-800">123456</span>
                 </p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-3 animate-shake">
                <AlertCircle className="text-rose-600 shrink-0" size={18} />
                <p className="text-xs font-bold text-rose-700 leading-tight">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              className="v-btn-primary w-full h-[54px] mt-4 shadow-lg shadow-blue-500/20"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="text-sm font-semibold">Sign In</span>
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-4">
              {isLogin ? "Need a platform account?" : "Already have an account?"}
            </p>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              {isLogin ? "Request Access" : "Back to Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
