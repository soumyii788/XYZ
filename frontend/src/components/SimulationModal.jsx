import React, { useState } from 'react'
import axios from 'axios'
import { 
  Ship, 
  X, 
  CheckCircle2, 
  User, 
  MessageSquare, 
  Send,
  Loader2
} from 'lucide-react'

const SimulationModal = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState('New Booking Request: 40ft Container #MSKU99283')
  const [body, setBody] = useState('We need to book a shipment for 40ft container MSKU99283 from Shanghai to Rotterdam. Please confirm ETA.')
  const [sender, setSender] = useState('logistics.ops@client.com')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSimulate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/ingest/', { subject, body, sender })
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (err) {
      console.error("Simulation failed:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl glass-panel overflow-hidden shadow-accent-primary/20 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-primary/10 rounded-xl text-accent-primary border border-accent-primary/20">
              <Ship size={20} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-white">Signal Injector</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-full text-slate-500 hover:text-white transition-all active:scale-90"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </header>

        <form onSubmit={handleSimulate} className="p-8 flex flex-col gap-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in group">
              <div className="text-accent-success p-4 bg-accent-success/10 rounded-full border-2 border-accent-success/20 mb-4 animate-bounce">
                <CheckCircle2 size={56} strokeWidth={3} />
              </div>
              <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Signal Synchronized</h4>
              <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mt-2">Updating Operational Feed...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Transmitter Identity (Sender)</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    className="v-input pl-12" 
                    value={sender} 
                    onChange={e => setSender(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject Header</label>
                <div className="relative">
                  <MessageSquare size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    className="v-input pl-12" 
                    value={subject} 
                    onChange={e => setSubject(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Data Transmission Payload</label>
                <textarea 
                  className="v-input min-h-[160px] resize-none py-4 leading-relaxed" 
                  value={body} 
                  onChange={e => setBody(e.target.value)} 
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="v-btn-primary h-[56px]"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={20} strokeWidth={2.5} />}
                <span className="font-black uppercase tracking-widest">
                  {loading ? 'INJECTING...' : 'INJECT SIGNAL'}
                </span>
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  )
}

export default SimulationModal
