import React from 'react'
import { 
  BarChart2, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Layers, 
  Zap, 
  Sparkles,
  CheckCircle2,
  Ship,
  Truck
} from 'lucide-react'

const Analytics = () => {
  const stats = [
    { label: 'Avg Cycle Time', value: '3.8 Days', change: '-14%', icon: Clock, color: 'text-[#d61f26]', bg: 'bg-red-50' },
    { label: 'On-Time Fulfilment', value: '99.61%', change: '+3.2%', icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Carrier Volume', value: '1,420 TEU', change: '+22%', icon: Layers, color: 'text-slate-800', bg: 'bg-slate-100' },
    { label: 'Freight Invoiced', value: '$1.24M', change: '+11%', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  const bars = [45, 62, 38, 85, 54, 92, 78, 88, 50, 72, 65, 82]

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto px-4 md:px-6 py-8 pb-32 animate-fade-in text-slate-800">
      
      <header className="flex flex-col gap-2 pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#d61f26]/10 text-[#d61f26] text-[11px] font-bold uppercase tracking-wider rounded-xs w-fit">
          LOGIONE AI Telemetry
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Performance Analytics & Intelligence</h1>
        <p className="text-slate-500 text-sm">Real-time operational metrics, multi-modal throughput, and carrier SLA compliance.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="surface-card p-6 flex flex-col justify-between gap-4 bg-white border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</span>
              <div className={`p-2.5 ${stat.bg} ${stat.color} rounded shadow-2xs`}>
                <stat.icon size={18} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</span>
              <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-[#d61f26]'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Operational Throughput Bar Chart */}
        <section className="lg:col-span-2 surface-card p-8 bg-white border border-slate-200">
          <header className="flex items-center justify-between mb-8 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Linehaul Operational Throughput</h3>
              <p className="text-xs text-slate-400 mt-0.5">Monthly processed container and express volume</p>
            </div>
            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xs text-[10px] font-bold uppercase tracking-wider">
              Last 12 Months
            </span>
          </header>

          <div className="h-[260px] flex items-end justify-between gap-3 px-2 pt-4">
            {bars.map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div 
                  className="w-full bg-slate-100 group-hover:bg-[#d61f26] rounded-t-xs transition-all duration-300 relative"
                  style={{ height: `${height}%` }}
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded font-mono pointer-events-none transition-opacity">
                    {height}k
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">M{i + 1}</span>
              </div>
            ))}
          </div>
        </section>

        {/* LOGIONE Performance Benchmarks */}
        <section className="surface-card p-8 bg-white border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 mb-6 flex items-center gap-2">
              <Sparkles size={16} className="text-[#d61f26]" />
              LOGIONE AI Benchmark
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span className="font-semibold text-slate-800">Entity Parser Accuracy</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">98.4%</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span className="font-semibold text-slate-800">24h SLA Escalations</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">100%</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span className="font-semibold text-slate-800">Carrier API Uptime</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">99.98%</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-red-50/50 border border-red-100 rounded text-[11px] text-[#d61f26] font-medium mt-6">
            SLA targets configured in compliance with XYZ Logistics requirements.
          </div>
        </section>

      </div>
    </div>
  )
}

export default Analytics
