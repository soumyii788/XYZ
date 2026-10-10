import React, { useState, useEffect, useCallback } from 'react'
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
  Loader2,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Ship,
  DollarSign,
  Calendar,
  Send,
  Plus,
  AlertTriangle,
  Mail,
  ChevronDown,
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const STATUS_CONFIG = {
  NEW: { label: 'New', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  BOOKING_PENDING: { label: 'Booking Pending', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  PAYMENT_PENDING: { label: 'Payment Pending', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
  FOLLOW_UP: { label: 'Follow-Up Required', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
  ESCALATED: { label: 'Escalated', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  RESOLVED: { label: 'Resolved', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
}

const PRIORITY_CONFIG = {
  HIGH: { label: 'High', color: 'text-rose-700 bg-rose-50 border-rose-200', dot: 'bg-rose-500' },
  MEDIUM: { label: 'Medium', color: 'text-amber-700 bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
  LOW: { label: 'Low', color: 'text-slate-600 bg-slate-50 border-slate-200', dot: 'bg-slate-400' }
}

const CaseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [summarizing, setSummarizing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [copiedKey, setCopiedKey] = useState(null)
  const [toast, setToast] = useState(null)

  // Message composer modal state
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messageForm, setMessageForm] = useState({
    sender: user?.email || 'operator@xyzlogistics.com',
    subject: '',
    body: ''
  })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const copyToClipboard = (text, key) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    showToast(`Copied ${key} to clipboard`)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const fetchCase = useCallback(async () => {
    try {
      const res = await axios.get(`/api/v1/cases/${id}/`)
      setCaseData(res.data)
      setMessageForm(prev => ({
        ...prev,
        subject: `Re: Case #${res.data.case_id}`
      }))
    } catch (err) {
      console.error('Error fetching case:', err)
      showToast('Error loading case details', 'error')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCase()
  }, [fetchCase])

  const handleStatusChange = async (newStatus) => {
    if (!caseData || caseData.status === newStatus) return
    try {
      setUpdating(true)
      await axios.patch(`/api/v1/cases/${id}/`, { status: newStatus })
      setCaseData(prev => ({ ...prev, status: newStatus }))
      showToast(`Status updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`)
    } catch (err) {
      console.error('Failed to update status:', err)
      showToast('Failed to update status', 'error')
    } finally {
      setUpdating(false)
    }
  }

  const handlePriorityChange = async (newPriority) => {
    if (!caseData || caseData.priority === newPriority) return
    try {
      setUpdating(true)
      await axios.patch(`/api/v1/cases/${id}/`, { priority: newPriority })
      setCaseData(prev => ({ ...prev, priority: newPriority }))
      showToast(`Priority updated to ${newPriority}`)
    } catch (err) {
      console.error('Failed to update priority:', err)
      showToast('Failed to update priority', 'error')
    } finally {
      setUpdating(false)
    }
  }

  const handleGenerateSummary = async () => {
    try {
      setSummarizing(true)
      const res = await axios.post(`/api/v1/cases/${id}/summarize/`)
      setCaseData(prev => ({ ...prev, live_summary: res.data.summary }))
      showToast('AI live summary updated successfully')
    } catch (err) {
      console.error('Error generating summary:', err)
      showToast(err.response?.data?.error || 'Failed to generate AI summary', 'error')
    } finally {
      setSummarizing(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageForm.body.trim()) return

    try {
      setSendingMessage(true)
      const threadId = caseData.messages?.[0]?.thread_id || `thread_${caseData.case_id}`
      const payload = {
        case: caseData.id,
        thread_id: threadId,
        subject: messageForm.subject || `Message on Case #${caseData.case_id}`,
        body: messageForm.body,
        sender: messageForm.sender || user?.email || 'carrier.ops@client.com',
        timestamp: new Date().toISOString()
      }

      const res = await axios.post('/api/v1/messages/', payload)
      setCaseData(prev => ({
        ...prev,
        messages: [...(prev.messages || []), res.data]
      }))
      setIsMessageModalOpen(false)
      setMessageForm(prev => ({ ...prev, body: '' }))
      showToast('Message logged to thread')
    } catch (err) {
      console.error('Failed to send message:', err)
      showToast('Failed to log message', 'error')
    } finally {
      setSendingMessage(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-slate-400 font-medium text-xs tracking-wide">Loading case details...</p>
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
        <AlertCircle className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">Case Not Found</h2>
        <p className="text-slate-500 text-sm mt-1 max-w-sm">The requested case record does not exist or has been removed.</p>
        <button onClick={() => navigate('/')} className="mt-6 v-btn-primary">
          <ArrowLeft size={16} />
          <span>Return to Dashboard</span>
        </button>
      </div>
    )
  }

  const currentStatus = STATUS_CONFIG[caseData.status] || {
    label: caseData.status?.replace('_', ' ') || 'Unknown',
    badge: 'bg-slate-50 text-slate-600 border-slate-200'
  }
  const currentPriority = PRIORITY_CONFIG[caseData.priority] || PRIORITY_CONFIG.MEDIUM

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-4 md:px-6 py-8 pb-32 animate-fade-in relative text-slate-800">

      {/* Subtle Toast Feedback */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium animate-fade-in ${
          toast.type === 'error' 
            ? 'bg-rose-50 text-rose-800 border-rose-200' 
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header & Quick Actions */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="flex items-start sm:items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm shrink-0"
            title="Return to Dashboard"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Case #{caseData.case_id}
                <button
                  onClick={() => copyToClipboard(caseData.case_id, 'Case ID')}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors rounded"
                  title="Copy Case ID"
                >
                  {copiedKey === 'Case ID' ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                </button>
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${currentStatus.badge}`}>
                {currentStatus.label}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${currentPriority.color}`}>
                <span className={`w-2 h-2 rounded-full ${currentPriority.dot}`} />
                {currentPriority.label}
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm font-medium flex items-center gap-2 flex-wrap">
              <span>Created {new Date(caseData.created_at).toLocaleDateString()}</span>
              <span>•</span>
              <span>Last updated: {new Date(caseData.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons: Status Selector, AI Summary & Add Message */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Changer */}
          <div className="relative inline-block">
            <select
              value={caseData.status}
              disabled={updating}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg pl-3 pr-8 py-2.5 shadow-sm hover:border-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50"
            >
              {Object.entries(STATUS_CONFIG).map(([value, conf]) => (
                <option key={value} value={value}>{conf.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Priority Changer */}
          <div className="relative inline-block">
            <select
              value={caseData.priority}
              disabled={updating}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg pl-3 pr-8 py-2.5 shadow-sm hover:border-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50"
            >
              {Object.entries(PRIORITY_CONFIG).map(([value, conf]) => (
                <option key={value} value={value}>{conf.label} Priority</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* AI Summarize Action */}
          <button
            onClick={handleGenerateSummary}
            disabled={summarizing}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm disabled:opacity-60"
            title="Generate AI Summary from Messages"
          >
            {summarizing ? (
              <Loader2 size={15} className="animate-spin text-blue-600" />
            ) : (
              <Sparkles size={15} className="text-blue-600" />
            )}
            <span>{summarizing ? 'Analyzing...' : 'AI Summary'}</span>
          </button>

          {/* Log Message / Reply */}
          <button
            onClick={() => setIsMessageModalOpen(true)}
            className="v-btn-primary text-xs py-2.5"
          >
            <Plus size={16} />
            <span>Add Message</span>
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Case Overview, Shipment & Payment, and Communication Thread */}
        <section className="lg:col-span-2 space-y-8">

          {/* Transmission & Logistics Overview Stats */}
          <div className="surface-card p-6 md:p-8 bg-white">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">
              Case Registry Metadata
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Hash size={13} />
                  Case Reference
                </span>
                <span className="text-sm font-bold text-slate-900">{caseData.case_id}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe size={13} />
                  Thread ID
                </span>
                <span className="text-sm font-bold text-slate-900 truncate">
                  {caseData.messages?.[0]?.thread_id || 'Direct'}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare size={13} />
                  Messages
                </span>
                <span className="text-sm font-bold text-slate-900">{caseData.messages?.length || 0} Emails</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={13} />
                  Logged At
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {new Date(caseData.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Cards Row: Shipment Tracking & Financial Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Shipment Card */}
            <div className="surface-card p-6 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Ship size={18} className="text-blue-600" />
                    Shipment Information
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Carrier Data
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 font-medium">Container #</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span>{caseData.shipment?.container_number || 'Unassigned'}</span>
                      {caseData.shipment?.container_number && (
                        <button
                          onClick={() => copyToClipboard(caseData.shipment.container_number, 'Container #')}
                          className="text-slate-400 hover:text-slate-600 p-0.5"
                          title="Copy Container #"
                        >
                          {copiedKey === 'Container #' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 font-medium">Bill of Lading (BL)</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {caseData.shipment?.bl_number || 'Pending'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 font-medium">Estimated Arrival</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Calendar size={13} className="text-slate-400" />
                      {caseData.shipment?.eta 
                        ? new Date(caseData.shipment.eta).toLocaleDateString() 
                        : 'Awaiting Carrier Update'}
                    </span>
                  </div>

                  {caseData.shipment?.details && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-slate-400 block mb-1">Carrier Notes</span>
                      <p className="text-slate-600 bg-slate-50 p-2.5 rounded text-[11px] leading-relaxed">
                        {caseData.shipment.details}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment & Invoicing Card */}
            <div className="surface-card p-6 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <DollarSign size={18} className="text-emerald-600" />
                    Payment & Invoicing
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    caseData.payment?.is_paid 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {caseData.payment?.is_paid ? 'Paid' : 'Unpaid / Pending'}
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 font-medium">Invoice Number</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {caseData.payment?.invoice_number || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 font-medium">Total Amount</span>
                    <span className="text-sm font-bold text-slate-900">
                      {caseData.payment?.amount 
                        ? `$${Number(caseData.payment.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
                        : 'Pending Invoice'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 font-medium">Due Date</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Clock size={13} className="text-slate-400" />
                      {caseData.payment?.due_date 
                        ? new Date(caseData.payment.due_date).toLocaleDateString() 
                        : 'Not specified'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Payment Settlement</span>
                    <span className="text-slate-700 font-semibold flex items-center gap-1">
                      {caseData.payment?.is_paid ? (
                        <CheckCircle2 size={14} className="text-emerald-600" />
                      ) : (
                        <AlertTriangle size={14} className="text-amber-600" />
                      )}
                      {caseData.payment?.is_paid ? 'Settled in Full' : 'Pending Remittance'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Email Activity Timeline */}
          <div className="surface-card p-6 md:p-8 bg-white">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <MessageSquare size={18} className="text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Communication Timeline</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-xs font-semibold">
                  {caseData.messages?.length || 0} Messages
                </span>
                <button
                  onClick={() => setIsMessageModalOpen(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:underline"
                >
                  <Plus size={14} />
                  <span>Add Message</span>
                </button>
              </div>
            </div>

            {/* Message List */}
            <div className="space-y-4">
              {(!caseData.messages || caseData.messages.length === 0) ? (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                  <Mail className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-600 text-sm font-semibold">No communication history</p>
                  <p className="text-slate-400 text-xs mt-1">Ingest an email or log a new message to start tracking this thread.</p>
                  <button
                    onClick={() => setIsMessageModalOpen(true)}
                    className="mt-4 v-btn-primary text-xs py-2 px-3 mx-auto"
                  >
                    Log First Message
                  </button>
                </div>
              ) : (
                caseData.messages.map((msg, idx) => (
                  <div 
                    key={msg.id || idx}
                    className="p-5 bg-slate-50/60 rounded-lg border border-slate-200/70 hover:border-blue-200 hover:bg-white transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {msg.sender?.[0]?.toUpperCase() || 'M'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight">{msg.sender}</p>
                          <p className="text-[11px] text-slate-500 font-medium">{msg.subject || 'No Subject'}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400 shrink-0">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : 'Recent'}
                      </span>
                    </div>

                    <div className="bg-white p-3.5 rounded border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line group-hover:border-slate-200 transition-colors">
                      {msg.body}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </section>

        {/* Right Column: AI Live Summary & System Status */}
        <section className="flex flex-col gap-8">
          
          {/* AI Live Summary Card */}
          <div className="surface-card p-6 md:p-8 bg-blue-50/40 border-blue-200/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                <Sparkles size={16} className="text-blue-600" />
                Live AI Summary
              </h3>
              <button
                onClick={handleGenerateSummary}
                disabled={summarizing}
                className="text-xs text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline disabled:opacity-50"
                title="Regenerate Summary"
              >
                <RefreshCw size={12} className={summarizing ? 'animate-spin' : ''} />
                <span>{summarizing ? 'Updating...' : 'Regenerate'}</span>
              </button>
            </div>

            <div className="p-4 bg-white rounded-lg border border-blue-100 shadow-sm">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {caseData.live_summary || 'No live summary generated yet. Click "Regenerate" or "AI Summary" to analyze thread messages.'}
              </p>
            </div>
            <p className="text-[10px] text-blue-600/70 font-medium mt-3 text-right">
              Powered by Gemini Intelligence
            </p>
          </div>

          {/* Automated Reminders / Relentless Follow-Ups */}
          <div className="surface-card p-6 bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock size={16} className="text-amber-600" />
                Automated Reminders
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                24h Escalation
              </span>
            </div>

            {(!caseData.reminders || caseData.reminders.length === 0) ? (
              <div className="p-4 bg-slate-50 rounded text-center">
                <p className="text-xs text-slate-500">No active escalation reminders.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Automated worker monitors pending cases daily.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {caseData.reminders.map((reminder, idx) => (
                  <div key={reminder.id || idx} className="p-3 bg-amber-50/60 rounded border border-amber-200/60 text-xs">
                    <p className="font-semibold text-amber-900 leading-snug">{reminder.text}</p>
                    <span className="text-[10px] text-amber-700 mt-1 block">
                      Triggered {new Date(reminder.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System & Routing Integrity */}
          <div className="surface-card p-6 bg-white">
            <h3 className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
              System Connections
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>Carrier Email Ingestion</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Operational
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>Gemini NLP Pipeline</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Shield size={15} className="text-purple-600" />
                  <span>API Protocol</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  v1 Standard
                </span>
              </div>
            </div>
          </div>

        </section>

      </div>

      {/* Message Composer Modal */}
      {isMessageModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsMessageModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Log Message on Case #{caseData.case_id}</h3>
              </div>
              <button 
                onClick={() => setIsMessageModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Sender Email
                </label>
                <input
                  type="email"
                  required
                  value={messageForm.sender}
                  onChange={e => setMessageForm({ ...messageForm, sender: e.target.value })}
                  placeholder="carrier.agent@shipping.com"
                  className="v-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subject Line
                </label>
                <input
                  type="text"
                  required
                  value={messageForm.subject}
                  onChange={e => setMessageForm({ ...messageForm, subject: e.target.value })}
                  placeholder={`Re: Case #${caseData.case_id}`}
                  className="v-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message Body
                </label>
                <textarea
                  required
                  rows={5}
                  value={messageForm.body}
                  onChange={e => setMessageForm({ ...messageForm, body: e.target.value })}
                  placeholder="Paste or write carrier update regarding container, delay, or invoice..."
                  className="v-input resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMessageModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingMessage}
                  className="v-btn-primary text-xs py-2 px-4"
                >
                  {sendingMessage ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  <span>{sendingMessage ? 'Logging...' : 'Submit Message'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default CaseDetail
