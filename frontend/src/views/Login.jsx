import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  AlertCircle, 
  Lock, 
  User, 
  Shield, 
  ArrowRight, 
  KeyRound, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  ArrowLeft 
} from 'lucide-react'
import BrandLogo from '../components/BrandLogo'

const Login = () => {
  const [authMode, setAuthMode] = useState('otp') // 'otp' | 'password' | 'register'
  const [email, setEmail] = useState('saumyashukla788708@gmail.com')
  const [password, setPassword] = useState('123456')
  const [otp, setOtp] = useState('')
  const [otpStep, setOtpStep] = useState(1) // 1: enter email, 2: enter otp
  const [generatedOtp, setGeneratedOtp] = useState(null)
  const [resendCooldown, setResendCooldown] = useState(0)
  
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  // Resend countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  // Step 1: Request OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault()
    if (!email.trim()) {
      setError('Please enter your carrier email or username.')
      return
    }

    setError('')
    setSuccessMsg('')
    setLoading(true)

    try {
      const res = await axios.post('/api/v1/auth/send-otp/', { email: email.trim() })
      if (res.data.status === 'success') {
        setGeneratedOtp(res.data.otp)
        setOtpStep(2)
        setResendCooldown(30)
        setSuccessMsg(res.data.message || `OTP sent to ${email}`)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP & Sign In
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otp.trim()) {
      setError('Please enter the 6-digit OTP code.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await axios.post('/api/v1/auth/login/', {
        username: email.trim(),
        otp: otp.trim()
      })
      if (res.data.status === 'success') {
        login(res.data.user)
        res.data.onboarded ? navigate('/') : navigate('/onboarding')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP code. Please check and retry.')
    } finally {
      setLoading(false)
    }
  }

  // Password Login Handler
  const handlePasswordLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const endpoint = authMode === 'register' ? '/api/v1/auth/register/' : '/api/v1/auth/login/'
    const payload = { username: email.trim(), password, email: email.trim() }

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
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-slate-900 relative overflow-hidden text-slate-800">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-radial from-slate-800 to-slate-950 pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-6 text-center">
          <BrandLogo variant="dark" className="scale-125 mb-3" />
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">
            Enterprise Logistics Management Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-2xl border border-slate-200">
          
          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-slate-200 mb-6 pb-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode('otp')
                setError('')
                setSuccessMsg('')
              }}
              className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider transition-all relative ${
                authMode === 'otp'
                  ? 'text-[#d61f26] border-b-2 border-[#d61f26]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In with OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('password')
                setError('')
                setSuccessMsg('')
              }}
              className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider transition-all relative ${
                authMode === 'password'
                  ? 'text-[#d61f26] border-b-2 border-[#d61f26]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Password Login
            </button>
          </div>

          {/* ================= MODE 1: OTP LOGIN ================= */}
          {authMode === 'otp' && (
            <div>
              {otpStep === 1 ? (
                /* Step 1: Enter Username/Email */
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="mb-2">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">One-Time Password Login</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter your registered carrier email or username to receive a 6-digit verification code.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Carrier Email / Username
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        required
                        className="v-input pl-10 text-xs" 
                        placeholder="e.g. saumyashukla788708@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded flex items-center gap-2 text-rose-700 text-xs font-semibold animate-fade-in">
                      <AlertCircle className="shrink-0" size={15} />
                      <span>{error}</span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="v-btn-primary w-full py-3 mt-2 shadow-md shadow-[#d61f26]/20"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <KeyRound size={15} />
                        <span className="text-xs font-bold uppercase tracking-wider">Send Verification OTP</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2: Enter OTP Code */
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">Enter Verification Code</h2>
                      <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[220px]">
                        Sent to: <span className="font-semibold text-slate-700">{email}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep(1)
                        setError('')
                      }}
                      className="text-xs text-[#d61f26] font-semibold hover:underline"
                    >
                      Change
                    </button>
                  </div>

                  {/* Demo OTP Helper Box */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Live Demo Code
                      </span>
                      <span className="text-base font-black tracking-widest text-[#d61f26] font-mono">
                        {generatedOtp || '123456'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtp(generatedOtp || '123456')}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded text-xs font-bold shadow-2xs transition-colors"
                    >
                      Auto-Fill OTP
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      6-Digit Security OTP
                    </label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        maxLength={6}
                        required
                        className="v-input pl-10 text-center tracking-[0.4em] text-lg font-mono font-bold" 
                        placeholder="••••••"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        autoFocus
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded flex items-center gap-2 text-rose-700 text-xs font-semibold animate-fade-in">
                      <AlertCircle className="shrink-0" size={15} />
                      <span>{error}</span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading || otp.length < 6}
                    className="v-btn-primary w-full py-3 mt-2 shadow-md shadow-[#d61f26]/20 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="text-xs font-bold uppercase tracking-wider">Verify & Sign In</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>

                  {/* Resend OTP */}
                  <div className="pt-2 text-center text-xs text-slate-500">
                    {resendCooldown > 0 ? (
                      <span>Resend code in <strong className="text-slate-800">{resendCooldown}s</strong></span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[#d61f26] font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <RefreshCw size={12} />
                        <span>Resend OTP Code</span>
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ================= MODE 2: PASSWORD LOGIN ================= */}
          {authMode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="mb-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Password Authentication</h2>
                <p className="text-xs text-slate-500 mt-1">Sign in using your account password.</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Carrier Username / Email
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    className="v-input pl-10 text-xs" 
                    placeholder="e.g. saumyashukla788708@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="password" 
                    required
                    className="v-input pl-10 text-xs font-mono" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-100 mt-1">
                  <Shield size={13} className="text-[#d61f26]" />
                  <p className="text-[11px] text-slate-600">Demo password override: <span className="font-bold text-slate-900 font-mono">123456</span></p>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded flex items-center gap-2 text-rose-700 text-xs font-semibold animate-fade-in">
                  <AlertCircle className="shrink-0" size={15} />
                  <span>{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="v-btn-primary w-full py-3 mt-2 shadow-md shadow-[#d61f26]/20"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="text-xs font-bold uppercase tracking-wider">Sign In</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Bottom Link */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500">Universal demo access code is </span>
            <span className="text-xs font-mono font-bold text-slate-900">123456</span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login
