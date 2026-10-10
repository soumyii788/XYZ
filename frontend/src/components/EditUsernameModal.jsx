import React, { useState } from 'react'
import axios from 'axios'
import { X, User, Check, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const EditUsernameModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth()
  const [newUsername, setNewUsername] = useState(user?.username || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleSave = async (e) => {
    e.preventDefault()
    const trimmed = newUsername.trim()
    if (!trimmed) {
      setError('Username cannot be empty.')
      return
    }

    if (trimmed === user?.username) {
      onClose()
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await axios.post('/api/v1/auth/update-user/', {
        current_username: user?.username,
        new_username: trimmed,
        email: user?.email
      })

      if (res.data.status === 'success') {
        updateUser({ username: trimmed })
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          onClose()
        }, 1200)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update username. Try a different name.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in text-slate-800"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-1.5 bg-[#d61f26] w-full" />

        <header className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#d61f26]/10 flex items-center justify-center text-[#d61f26]">
              <User size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Edit Carrier Username</h3>
              <p className="text-xs text-slate-500 mt-0.5">Change your display name and operator identity</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X size={18} />
          </button>
        </header>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Current Username
            </label>
            <input 
              type="text" 
              disabled
              value={user?.username || ''}
              className="v-input bg-slate-50 text-slate-500 cursor-not-allowed text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              New Username / Display Name
            </label>
            <input 
              type="text" 
              required
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              placeholder="e.g. Saumya Shukla"
              className="v-input text-xs"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded flex items-center gap-2 text-rose-700 text-xs font-semibold animate-fade-in">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-fade-in">
              <Check size={16} className="text-emerald-600" />
              <span>Username successfully updated!</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || success}
              className="v-btn-primary text-xs py-2 px-5"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              <span>{loading ? 'Saving...' : 'Save Username'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default EditUsernameModal
