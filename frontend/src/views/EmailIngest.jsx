import React, { useState } from 'react'
import axios from 'axios'
import { Send, CheckCircle2, AlertCircle, Mail, ChevronRight } from 'lucide-react'

const EmailIngest = () => {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sender, setSender] = useState('')
  const [threadId, setThreadId] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleIngest = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post('/api/ingest/', {
        subject,
        body,
        sender,
        thread_id: threadId
      })
      setStatus({ type: 'success', msg: `Protocol Success: Ingested Case ${response.data.case_id}` })
      setSubject('')
      setBody('')
    } catch (error) {
      console.error("Error ingesting email:", error)
      setStatus({ type: 'error', msg: "Protocol Failure: Communication error with ingestion model." })
    }
    setLoading(false)
  }

  return (
    <div className="ingest-container animate-fade-in">
      <div className="surface ingest-card p-3 max-width-600 mx-auto">
        <header className="ingest-header mb-2 flex-between">
           <div className="flex-center gap-1">
             <div className="icon-box bg-indigo-500 rounded p-05">
               <Mail size={20} className="text-white" />
             </div>
             <div>
               <h2 className="text-lg font-bold">Carrier Ingestion Engine</h2>
               <p className="label lowercase">Synchronize shipment communication telemetry</p>
             </div>
           </div>
        </header>

        <div className="surface alert-info mb-2 p-1 border-indigo-500/20">
           <p className="text-xs text-muted leading-relaxed">
             This secure protocol simulates incoming documentation from global logistics carriers. 
             Use a **Thread ID** to aggregate messages into an existing lifecycle, or leave blank to initialize a new **XYZ Analytics ID**.
           </p>
        </div>

        <form onSubmit={handleIngest} className="ingest-form flex-col gap-15">
          <div className="form-group flex-col gap-05">
            <label className="label uppercase font-bold text-xs">Origin Carrier Address</label>
            <input 
              className="surface interactive p-075 rounded-md text-main text-sm"
              type="email" 
              value={sender} 
              onChange={(e) => setSender(e.target.value)} 
              placeholder="e.g. logistics@msc.com"
              required
            />
          </div>
          
          <div className="form-group flex-col gap-05">
            <label className="label uppercase font-bold text-xs">Communication Subject</label>
            <input 
              className="surface interactive p-075 rounded-md text-main text-sm"
              type="text" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              placeholder="e.g. URGENT: Port Congestion Delay - B/L 9871"
              required
            />
          </div>

          <div className="form-group flex-col gap-05">
            <label className="label uppercase font-bold text-xs">Aggregation Thread Reference (Optional)</label>
            <input 
              className="surface interactive p-075 rounded-md text-main text-sm"
              type="text" 
              value={threadId} 
              onChange={(e) => setThreadId(e.target.value)} 
              placeholder="Existing Case aggregation key"
            />
          </div>

          <div className="form-group flex-col gap-05">
            <label className="label uppercase font-bold text-xs">Carrier Payload Content</label>
            <textarea 
              className="surface interactive p-075 rounded-md text-main text-sm min-height-150"
              rows="6" 
              value={body} 
              onChange={(e) => setBody(e.target.value)} 
              placeholder="Enter carrier email content..."
              required
            ></textarea>
          </div>

          <button type="submit" disabled={loading} className="btn-primary glow-btn flex-between">
             <div className="flex-center gap-075">
               <Send size={16} />
               <span>{loading ? 'Ingesting...' : 'Execute Protocol'}</span>
             </div>
             <ChevronRight size={16} />
          </button>
        </form>

        {status && (
          <div className={`surface animate-fade-in mt-2 p-1 border-l-2 flex-center gap-1 ${status.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
            {status.type === 'success' ? <CheckCircle2 size={18} className="text-green-500" /> : <AlertCircle size={18} className="text-red-500" />}
            <span className="text-sm font-bold">{status.msg}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailIngest
