import React, { useState } from 'react'
import axios from 'axios'
import { 
  Ship, 
  X, 
  CheckCircle2, 
  Send,
  Loader2,
  Sparkles,
  Plane,
  Truck,
  FileCheck
} from 'lucide-react'

const PRESETS = [
  {
    title: 'B2B Express: Ocean Container Booking',
    subject: 'New Booking Request: 40ft High-Cube Container #MSKU99283',
    body: 'We request immediate slot booking for 40ft container MSKU99283 from Shanghai to Rotterdam. Invoice INV-9041 issued for $4,500.00. Please confirm vessel ETA.',
    sender: 'booking.ops@maersk-line.com',
    icon: Ship
  },
  {
    title: 'Air Freight: Delayed Transit Notification',
    subject: 'URGENT: Flight Transit Delay for Waybill #AWB-77291',
    body: 'Shipment container CMAU88219 has encountered a flight transit reschedule due to adverse weather at Frankfurt hub. Revised arrival ETA is 2026-10-24. Please notify consignee.',
    sender: 'linehaul.dispatch@lufthansa-cargo.com',
    icon: Plane
  },
  {
    title: 'Last-Mile Express: Payment Confirmation',
    subject: 'Remittance Confirmation: Invoice INV-8821 Settled',
    body: 'Payment for invoice INV-8821 in the amount of $3,200.00 has been verified and settled in full by consignee. Please release container for final delivery haulage.',
    sender: 'accounts.payable@freight-finance.com',
    icon: FileCheck
  }
]

const SimulationModal = ({ isOpen, onClose, onIngested }) => {
  const [subject, setSubject] = useState(PRESETS[0].subject)
  const [body, setBody] = useState(PRESETS[0].body)
  const [sender, setSender] = useState(PRESETS[0].sender)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [resultCaseId, setResultCaseId] = useState(null)

  if (!isOpen) return null

  const handleSimulate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('/api/v1/ingest/', { subject, body, sender })
      setResultCaseId(res.data.case_id)
      setSuccess(true)
      if (onIngested) onIngested(res.data)
      setTimeout(() => {
        setSuccess(false)
        setResultCaseId(null)
        onClose()
      }, 2200)
    } catch (err) {
      console.error("Simulation failed:", err)
    } finally {
      setLoading(false)
    }
  }

  const applyPreset = (preset) => {
    setSubject(preset.subject)
    setBody(preset.body)
    setSender(preset.sender)
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
        {/* Red Brand Accent Line */}
        <div className="h-1.5 bg-[#d61f26] w-full" />

        <header className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#d61f26]/10 flex items-center justify-center text-[#d61f26]">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Carrier Signal Ingestion Engine</h3>
              <p className="text-xs text-slate-500 mt-0.5">Simulate incoming carrier email threads with AI parsing</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        {/* Quick Presets Strip */}
        <div className="p-4 bg-slate-100/60 border-b border-slate-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Load Quick Logistics Scenario:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applyPreset(p)}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <p.icon size={13} className="text-[#d61f26]" />
                <span className="truncate max-w-[140px] sm:max-w-none">{p.title}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSimulate} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Carrier Sender Email
            </label>
            <input 
              type="email"
              required
              className="v-input"
              value={sender}
              onChange={e => setSender(e.target.value)}
              placeholder="carrier.ops@shippingline.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Subject Line
            </label>
            <input 
              type="text"
              required
              className="v-input"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Container Booking or Delay Reference..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Body & Message Thread
            </label>
            <textarea 
              rows={4}
              required
              className="v-input resize-none"
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Provide container numbers, BL, and ETA details..."
            />
          </div>

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-fade-in">
              <CheckCircle2 size={16} />
              <span>Email ingested successfully into Case #{resultCaseId}!</span>
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
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              <span>{loading ? 'Ingesting...' : 'Ingest Carrier Signal'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default SimulationModal
