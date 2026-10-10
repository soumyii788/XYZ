import React, { useState } from 'react'
import { 
  User, 
  Building2, 
  Mail, 
  Shield, 
  LogOut, 
  ChevronRight, 
  Globe,
  Activity,
  Edit2,
  Check,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import EditUsernameModal from '../components/EditUsernameModal'
import axios from 'axios'

const Account = () => {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isInlineEditing, setIsInlineEditing] = useState(false)
  const [editName, setEditName] = useState(user?.username || '')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleInlineSave = async (e) => {
    e.preventDefault()
    const trimmed = editName.trim()
    if (!trimmed) {
      showToast('Username cannot be empty', 'error')
      return
    }

    if (trimmed === user?.username) {
      setIsInlineEditing(false)
      return
    }

    setSaving(true)
    try {
      const res = await axios.post('/api/v1/auth/update-user/', {
        current_username: user?.username,
        new_username: trimmed,
        email: user?.email
      })

      if (res.data.status === 'success') {
        updateUser({ username: trimmed })
        setIsInlineEditing(false)
        showToast('Username updated successfully!')
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update username', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 md:px-6 py-8 pb-32 animate-fade-in text-slate-800">
      
      {/* Toast Feedback */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-md shadow-lg border text-sm font-medium animate-fade-in ${
          toast.type === 'error' 
            ? 'bg-rose-50 text-rose-800 border-rose-200' 
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      <header className="flex flex-col gap-2 pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#d61f26]/10 text-[#d61f26] text-[11px] font-bold uppercase tracking-wider rounded-xs w-fit">
          Carrier Profile
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage your carrier identity, display name, and logistics parameters.</p>
          </div>
          
          {/* Main Edit Username Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="v-btn-primary text-xs py-2 px-4 shadow-sm self-start sm:self-auto"
          >
            <Edit2 size={14} />
            <span>Edit Username</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <section className="lg:col-span-2 space-y-6">
          <div className="surface-card p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white border border-slate-200">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-800 text-3xl border-4 border-slate-50 shadow-inner shrink-0">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>

            {/* User details & Editable Username */}
            <div className="flex-1 min-w-0 flex flex-col gap-2 text-center sm:text-left w-full">
              {isInlineEditing ? (
                <form onSubmit={handleInlineSave} className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md">
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="v-input text-sm py-1.5 font-bold"
                    autoFocus
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="submit"
                      disabled={saving}
                      className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs transition-colors"
                      title="Save"
                    >
                      {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsInlineEditing(false)
                        setEditName(user?.username || '')
                      }}
                      className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs transition-colors"
                      title="Cancel"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight break-all">
                    {user?.username || 'Carrier Operator'}
                  </h2>
                  <button
                    onClick={() => {
                      setEditName(user?.username || '')
                      setIsInlineEditing(true)
                    }}
                    className="p-1.5 text-slate-400 hover:text-[#d61f26] hover:bg-red-50 rounded transition-colors"
                    title="Click to edit username inline"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              )}

              <p className="text-slate-500 text-xs font-medium">Cargo Logic Platform Member</p>
              
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                <span className="px-2.5 py-0.5 bg-red-50 text-[#d61f26] rounded-xs text-[11px] font-bold border border-red-200">
                  Verified Account
                </span>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-xs text-[11px] font-bold">
                  Enterprise Operator
                </span>
              </div>
            </div>
          </div>

          {/* Profile Information List (Clean layout without overlapping) */}
          <div className="surface-card p-6 sm:p-8 bg-white border border-slate-200">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Profile Information
              </h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs text-[#d61f26] hover:underline font-semibold flex items-center gap-1"
              >
                <Edit2 size={12} />
                <span>Change Username</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Username Field */}
              <div className="flex flex-col gap-1.5 p-3.5 bg-slate-50/70 rounded border border-slate-100 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <User size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Username</span>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-[11px] text-[#d61f26] font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Edit
                  </button>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 break-all font-mono">
                  {user?.username || 'user_admin'}
                </span>
              </div>

              {/* Email Address Field */}
              <div className="flex flex-col gap-1.5 p-3.5 bg-slate-50/70 rounded border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Mail size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Email Address</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 break-all font-mono">
                  {user?.email || `${user?.username}@xyzlogistics.com`}
                </span>
              </div>

              {/* Role Field */}
              <div className="flex flex-col gap-1.5 p-3.5 bg-slate-50/70 rounded border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Shield size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Role</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {user?.profile?.role || 'Carrier Operations Administrator'}
                </span>
              </div>

              {/* Company Field */}
              <div className="flex flex-col gap-1.5 p-3.5 bg-slate-50/70 rounded border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Building2 size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Company</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {user?.profile?.company_name || 'Global Logistics & Supply Chain'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar Settings & Sign Out */}
        <section className="space-y-6">
          <div className="surface-card p-6 bg-white border border-slate-200 border-t-4 border-t-[#d61f26]">
            <h3 className="text-xs font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wider">
              Platform Actions
            </h3>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-between p-3 rounded-xs hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all text-xs font-semibold group"
              >
                <div className="flex items-center gap-2.5">
                  <Edit2 size={15} className="text-[#d61f26]" />
                  <span>Edit Carrier Username</span>
                </div>
                <ChevronRight size={15} className="text-slate-400 group-hover:text-[#d61f26] transition-colors" />
              </button>

              <button className="flex items-center justify-between p-3 rounded-xs hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all text-xs font-medium group">
                <div className="flex items-center gap-2.5">
                  <Shield size={15} className="text-slate-400 group-hover:text-[#d61f26] transition-colors" />
                  <span>Security & Two-Factor (OTP)</span>
                </div>
                <ChevronRight size={15} className="text-slate-300 group-hover:text-[#d61f26] transition-colors" />
              </button>

              <button className="flex items-center justify-between p-3 rounded-xs hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all text-xs font-medium group">
                <div className="flex items-center gap-2.5">
                  <Globe size={15} className="text-slate-400 group-hover:text-[#d61f26] transition-colors" />
                  <span>Dispatch Notifications</span>
                </div>
                <ChevronRight size={15} className="text-slate-300 group-hover:text-[#d61f26] transition-colors" />
              </button>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full surface-card p-6 bg-white border border-slate-200 border-t-4 border-t-rose-600 hover:bg-rose-50/50 transition-all text-left shadow-sm group"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors">Sign Out</h3>
                <p className="text-slate-500 text-xs">End active portal session</p>
              </div>
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded group-hover:bg-rose-600 group-hover:text-white transition-all">
                <LogOut size={20} />
              </div>
            </div>
          </button>
        </section>

      </div>

      {/* Edit Username Modal */}
      <EditUsernameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default Account
