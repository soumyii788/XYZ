import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Ship, Hash, ArrowRight, AlertCircle } from 'lucide-react'
import axios from 'axios'

const TrackingModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setSearched(true)
    try {
      const res = await axios.get('/api/v1/cases/')
      const q = query.trim().toLowerCase()
      const filtered = res.data.filter(c => 
        c.case_id?.toLowerCase().includes(q) ||
        c.shipment?.container_number?.toLowerCase().includes(q) ||
        c.shipment?.bl_number?.toLowerCase().includes(q) ||
        c.payment?.invoice_number?.toLowerCase().includes(q)
      )
      setResults(filtered)
    } catch (err) {
      console.error('Failed to search cases:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectCase = (id) => {
    onClose()
    navigate(`/case/${id}`)
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Red Accent Bar */}
        <div className="h-1.5 bg-[#d61f26] w-full" />
        
        <header className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#d61f26]/10 flex items-center justify-center text-[#d61f26]">
              <Search size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Track Your Orders & Cases</h3>
              <p className="text-xs text-slate-500 mt-0.5">Enter Case ID, Container Number, or Bill of Lading</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSearch} className="p-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g. XYZ-72230, MSKU99283, or BL-449102"
                className="v-input pl-10"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="v-btn-primary px-5 shrink-0"
            >
              <span>{loading ? 'Searching...' : 'Track'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>

        {/* Results Section */}
        {searched && (
          <div className="px-6 pb-6 border-t border-slate-100 pt-4 max-h-[300px] overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                <AlertCircle size={28} className="mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-slate-600">No active cases matched "{query}"</p>
                <p className="text-xs mt-1">Check the reference ID or simulate an ingest signal.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Matching Cases ({results.length})
                </p>
                {results.map(c => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCase(c.id)}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded border border-slate-200/80 flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 group-hover:text-[#d61f26] transition-colors text-sm">
                          Case #{c.case_id}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white border border-slate-200 text-slate-600">
                          {c.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 truncate max-w-sm">
                        {c.live_summary || c.messages?.[0]?.subject || 'Active carrier transmission'}
                      </p>
                    </div>
                    <ArrowRight size={16} className="text-slate-400 group-hover:text-[#d61f26] transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default TrackingModal
