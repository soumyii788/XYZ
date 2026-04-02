import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  Globe, 
  Shield, 
  Hash, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Loader2
} from 'lucide-react'
import Header from '../components/Header'

const CaseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCase()
  }, [id])

  const fetchCase = async () => {
    try {
      const res = await axios.get(`/api/cases/${id}/`)
      setCaseData(res.data)
    } catch (err) {
      console.error("Error fetching case:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN': return <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">OPEN</span>
      case 'IN_PROGRESS': return <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-semibold">IN PROGRESS</span>
      case 'RESOLVED': return <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold">RESOLVED</span>
      default: return <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-semibold">{status}</span>
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  )

  if (!caseData) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
       <AlertCircle className="w-16 h-16 text-slate-200 mb-4" />
       <h2 className="text-xl font-bold text-slate-900">Case not found</h2>
       <button onClick={() => navigate('/')} className="mt-4 v-btn-primary">返回 Dashboard</button>
    </div>
  )

  return (
    <div className="flex flex-col gap-10 w-full max-w-7xl mx-auto px-4 md:px-6 pb-32 animate-fade-in">
      <Header />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/')}
            className="p-3 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 transition-colors shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Case #{caseData.case_id}</h1>
                {getStatusBadge(caseData.status)}
             </div>
             <p className="text-slate-500 text-sm font-medium">Last updated: {new Date(caseData.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Details */}
        <section className="lg:col-span-2 space-y-10">
           
           <div className="surface-card p-10 bg-white">
              <h3 className="text-lg font-bold text-slate-800 mb-8 border-b border-slate-50 pb-4">Transmission Context</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                 {[
                   { label: 'Reference', value: caseData.case_id, icon: Hash },
                   { label: 'Origin Point', value: caseData.origin || 'DE-HAM-01', icon: Globe },
                   { label: 'Date Created', value: new Date(caseData.created_at).toLocaleDateString(), icon: Clock },
                   { label: 'Data Source', value: 'SystemRegistry', icon: Shield },
                 ].map((stat, i) => (
                   <div key={i} className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-slate-400">
                        <stat.icon size={14} />
                        <span className="label-caps text-[10px]">{stat.label}</span>
                      </div>
                      <p className="text-base font-bold text-slate-900">{stat.value}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="surface-card p-10">
              <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                  <MessageSquare size={20} className="text-blue-500" />
                  Activity History
                </h3>
                <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {caseData.messages.length} Records
                </span>
             </div>
             <div className="space-y-6">
                {caseData.messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm italic">No activity detected.</div>
                ) : (
                  caseData.messages.map((msg, i) => (
                    <div key={i} className="p-6 bg-slate-50/50 rounded-lg border border-slate-100/60 hover:bg-white hover:border-blue-100 transition-all group">
                       <span className="label-caps text-[10px] mb-2 block">{new Date(msg.created_at).toLocaleString()}</span>
                       <p className="text-slate-600 text-[13px] leading-relaxed group-hover:text-slate-900 transition-colors">{msg.content}</p>
                    </div>
                  ))
                )}
             </div>
           </div>
        </section>

        {/* Right Column: AI Analysis */}
        <section className="flex flex-col gap-10">
           <div className="surface-card p-10 bg-blue-50/30 border-blue-100">
              <h3 className="text-lg font-bold text-blue-900 mb-6 flex items-center gap-3">
                 <FileText size={20} className="text-blue-600" />
                 Context Summary
              </h3>
              <div className="p-6 bg-white rounded-lg border border-blue-100/50 shadow-sm">
                 <p className="text-sm text-slate-700 leading-relaxed italic">
                    "{caseData.live_summary || 'Ingesting metadata for analysis...'}"
                 </p>
              </div>
           </div>

           <div className="surface-card p-10">
              <h3 className="text-lg font-bold text-slate-800 mb-8 border-b border-slate-50 pb-4 italic font-display">System Integrity</h3>
              <div className="space-y-6">
                 {[
                   { label: 'Cloud Sync', status: 'Active', icon: CheckCircle2, color: 'text-green-500' },
                   { label: 'Auth Status', status: 'Verified', icon: Shield, color: 'text-blue-500' },
                 ].map((node, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-50/40 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-3">
                         <node.icon size={18} className={node.color} />
                         <span className="label-caps text-[10px]">{node.label}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">{node.status}</span>
                   </div>
                 ))}
              </div>
           </div>
        </section>
      </div>
    </div>
  )
}

export default CaseDetail
