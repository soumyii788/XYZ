import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { 
  Search as SearchIcon, 
  Package, 
  FileText, 
  Ship, 
  ArrowRight,
  AlertCircle,
  Hash,
  DollarSign
} from 'lucide-react'

const Search = () => {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const categories = [
    { id: 'ALL', label: 'All Records' },
    { id: 'CASE', label: 'Case Files' },
    { id: 'CONTAINER', label: 'Containers' },
    { id: 'INVOICE', label: 'Invoices' },
  ]

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/v1/cases/')
      setCases(res.data)
    } catch (err) {
      console.error("Error fetching cases:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredCases = cases.filter(c => {
    const q = query.trim().toLowerCase()
    if (!q) return true

    if (filter === 'CASE') {
      return c.case_id?.toLowerCase().includes(q) || c.live_summary?.toLowerCase().includes(q)
    }
    if (filter === 'CONTAINER') {
      return c.shipment?.container_number?.toLowerCase().includes(q) || c.shipment?.bl_number?.toLowerCase().includes(q)
    }
    if (filter === 'INVOICE') {
      return c.payment?.invoice_number?.toLowerCase().includes(q)
    }
    return (
      c.case_id?.toLowerCase().includes(q) ||
      c.live_summary?.toLowerCase().includes(q) ||
      c.shipment?.container_number?.toLowerCase().includes(q) ||
      c.shipment?.bl_number?.toLowerCase().includes(q) ||
      c.payment?.invoice_number?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto px-4 md:px-6 py-8 pb-32 animate-fade-in text-slate-800">
      
      <header className="flex flex-col gap-2 pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#d61f26]/10 text-[#d61f26] text-[11px] font-bold uppercase tracking-wider rounded-xs w-fit">
          Global Telemetry
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Search & Tracking Registry</h1>
        <p className="text-slate-500 text-sm">Query active case files, container waybills, ocean bill of ladings, or invoices.</p>
      </header>

      <section className="surface-card p-6 sm:p-8 bg-white shadow-sm border border-slate-200">
        <div className="flex flex-col gap-6">
          <div className="relative">
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              className="v-input h-14 pl-12 text-sm border-slate-300 focus:border-[#d61f26]"
              placeholder="Search by Reference ID (e.g. XYZ-72230), Container Number, BL, or Invoice..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-2 rounded-xs text-xs font-bold uppercase tracking-wider transition-all border ${
                  filter === cat.id 
                    ? 'bg-[#111827] text-white border-[#111827] shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>Found {filteredCases.length} records</span>
          {query && <span>Filtering by: "{query}"</span>}
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading registry...</div>
        ) : filteredCases.length === 0 ? (
          <div className="surface-card p-12 text-center bg-white border border-slate-200">
            <AlertCircle size={32} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No records match your search</h3>
            <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
              Try adjusting your query or category filter. You can also ingest a new carrier email from the sidebar.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCases.map((c) => (
              <div 
                key={c.id}
                onClick={() => navigate(`/case/${c.id}`)}
                className="surface-card p-5 bg-white hover:border-[#d61f26] cursor-pointer transition-all hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Hash size={16} className="text-[#d61f26]" />
                      <span className="font-bold text-slate-900 group-hover:text-[#d61f26] transition-colors text-sm">
                        Case #{c.case_id}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {c.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {c.live_summary || c.messages?.[0]?.subject || 'Carrier telemetry in transit...'}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-slate-100 text-slate-500">
                    <div>
                      <span className="block text-[10px] uppercase text-slate-400">Container:</span>
                      <span className="font-semibold text-slate-800">{c.shipment?.container_number || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase text-slate-400">Bill of Lading:</span>
                      <span className="font-semibold text-slate-800">{c.shipment?.bl_number || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-50 text-[11px] text-slate-400">
                  <span>{new Date(c.created_at).toLocaleDateString()}</span>
                  <span className="text-[#d61f26] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Case <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}

export default Search
