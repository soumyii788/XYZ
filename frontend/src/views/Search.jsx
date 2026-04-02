import React, { useState } from 'react'
import { 
  Search as SearchIcon, 
  Filter, 
  ChevronRight, 
  Package, 
  FileText, 
  RefreshCcw 
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

const Search = () => {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('ALL')
  
  const categories = [
    { id: 'ALL', label: 'All Records' },
    { id: 'CASE', label: 'Case Files' },
    { id: 'CONTAINER', label: 'Containers' },
    { id: 'INVOICE', label: 'Invoices' },
  ]

  return (
    <div className="flex flex-col gap-10 w-full max-w-6xl mx-auto px-4 md:px-6 pb-20 animate-fade-in">
      <Header />

      <header className="flex flex-col gap-2 pb-6 border-b border-slate-200">
         <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Search Registry</h1>
         <p className="text-slate-500 text-sm">Search for cases, containers, or shipment references.</p>
      </header>

      <section className="surface-card p-10 bg-white shadow-md">
        <div className="flex flex-col gap-8">
           <div className="relative group">
              <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                className="v-input h-[60px] pl-12 text-[15px] border-slate-200 focus:border-blue-500 transition-all font-medium"
                placeholder="Reference number, BL, or container ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
           </div>

           <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`px-4 py-2 rounded-md text-[11px] font-bold uppercase tracking-widest transition-all border ${
                    filter === cat.id 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
           </div>
        </div>
      </section>

      <div className="surface-card p-16 text-center bg-slate-50 border-none shadow-none">
         <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-200 mx-auto mb-6 shadow-sm border border-slate-100">
            <RefreshCcw size={24} className="animate-spin-slow" />
         </div>
         <h3 className="text-lg font-bold text-slate-800">Awaiting search query</h3>
         <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
            Please enter a valid shipment reference to search our global records.
         </p>
      </div>
    </div>
  )
}

export default Search
