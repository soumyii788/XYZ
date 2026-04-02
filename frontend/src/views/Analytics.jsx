import React from 'react'
import { 
  BarChart2, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Layers, 
  Zap, 
  Calendar 
} from 'lucide-react'
import Header from '../components/Header'

const Analytics = () => {
  const stats = [
    { label: 'Avg Cycle Time', value: '4.2 Days', change: '-12%', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Volume', value: '1,280', change: '+20%', icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Revenue Impact', value: '$840K', change: '+8%', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'System Accuracy', value: '98.4%', change: '+3%', icon: Zap, color: 'text-green-600', bg: 'bg-green-50' },
  ]

  const bars = [40, 60, 30, 80, 50, 90, 70, 85, 45, 65, 55, 75]

  return (
    <div className="flex flex-col gap-10 w-full max-w-6xl mx-auto px-4 md:px-6 pb-20 animate-fade-in">
      <Header />

      <header className="flex flex-col gap-2 pb-6 border-b border-slate-200">
         <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Performance Analytics</h1>
         <p className="text-slate-500 text-sm">Real-time operational metrics and growth tracking.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="surface-card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="label-caps">{stat.label}</span>
              <div className={`p-2 ${stat.bg} ${stat.color} rounded-lg shadow-sm`}>
                 <stat.icon size={18} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
              <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-rose-600'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <section className="lg:col-span-2 surface-card p-10 bg-white">
            <header className="flex items-center justify-between mb-10">
               <h3 className="text-lg font-bold text-slate-800">Operational Throughput</h3>
               <span className="bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-100">
                  Last 12 Periods
               </span>
            </header>
            <div className="h-[280px] flex items-end justify-between gap-2 px-2">
               {bars.map((height, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative cursor-help">
                   <div 
                     className="w-full bg-blue-50 border border-blue-100/50 hover:bg-blue-600 transition-all rounded-md"
                     style={{ height: `${height}%` }}
                   >
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-md">
                       P_{i+1}: {Math.floor(height * 1.5)}
                     </div>
                   </div>
                   <span className="text-[10px] font-medium text-slate-400">P_{i+1}</span>
                 </div>
               ))}
            </div>
         </section>

         <section className="surface-card p-10 bg-white flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-8">Status Distribution</h3>
              <div className="space-y-6">
                 {[
                   { label: 'Booking Pending', val: 42, color: 'bg-blue-600' },
                   { label: 'In Transit', val: 28, color: 'bg-amber-500' },
                   { label: 'Resolved', val: 30, color: 'bg-green-600' },
                 ].map((item, i) => (
                   <div key={i} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                         <span className="text-xs font-semibold text-slate-600">{item.label}</span>
                         <span className="text-xs font-bold text-slate-900">{item.val}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                         <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.val}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
            <div className="mt-10 p-6 bg-slate-50 rounded-lg border border-slate-100 text-center">
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Average Integrity Score</p>
               <h4 className="text-2xl font-bold text-blue-600">98.4%</h4>
            </div>
         </section>
      </div>
    </div>
  )
}

export default Analytics
