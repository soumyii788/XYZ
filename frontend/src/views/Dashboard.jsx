import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  ArrowRight, 
  Clock, 
  Ship, 
  Plane, 
  Truck, 
  Building2, 
  ChevronRight, 
  ChevronLeft,
  Sparkles, 
  TrendingUp, 
  Layers, 
  AlertTriangle,
  CheckCircle2,
  FileText,
  Activity,
  Plus
} from 'lucide-react'

const HERO_SLIDES = [
  {
    title: 'B2B Express',
    subtitle: 'Next-Generation High-Speed Line Haul & Multi-Modal Freight Logistics',
    tag: 'LOGISTICS EXCELLENCE',
    bgGradient: 'from-slate-950 via-slate-900 to-slate-800',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80',
    metric: '99.61%',
    metricLabel: 'On-Time SLA'
  },
  {
    title: 'Global Freight Forwarding',
    subtitle: 'Seamless Container Freight, Air Cargo & Real-Time Ocean Carrier Sync',
    tag: 'GLOBAL REACH',
    bgGradient: 'from-slate-950 via-blue-950 to-slate-900',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80',
    metric: '180+',
    metricLabel: 'Global Ports'
  },
  {
    title: 'Powered by LOGIONE AI',
    subtitle: 'Automated Carrier Email Ingestion, Entity Extraction & Relentless Tracking',
    tag: 'AI-DRIVEN ECOSYSTEM',
    bgGradient: 'from-slate-950 via-red-950 to-slate-900',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1600&q=80',
    metric: '24/7',
    metricLabel: 'Automated Escalation'
  }
]

const SERVICE_VERTICALS = [
  { 
    name: 'Freight Forwarding', 
    desc: 'Multi-modal international ocean and air freight orchestration',
    icon: Ship, 
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    name: 'B2B Express', 
    desc: 'Surface express delivery powered by relay-led fleet tech',
    icon: Truck, 
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    name: 'Last Mile Delivery', 
    desc: 'Electric fleet (eDEL) green urban distribution and dispatch',
    icon: Activity, 
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    name: 'Mobility Solutions', 
    desc: 'Corporate employee transportation network and fleet tech',
    icon: Building2, 
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    name: 'Contract Logistics', 
    desc: 'Turnkey Grade-A warehouse automation and inventory management',
    icon: Layers, 
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=600&q=80' 
  }
]

const CASE_STUDIES = [
  {
    title: 'Driving Predictability in Furniture Fittings & Hardware Distribution',
    category: 'Retail & Consumer',
    stat: '100% On-Time'
  },
  {
    title: 'Driving 100% Fulfilment from Warehouse Shelves to Everyday Homes',
    category: 'FMCG E-commerce',
    stat: '99.8% Accuracy'
  },
  {
    title: 'Transforming Warehousing into a Strategic Enabler for German Automotive Company',
    category: 'Automotive & Heavy Eng',
    stat: '-18% Cycle Time'
  },
  {
    title: 'Unlocked 12% Inventory Holding Cost for a Leading Global Steel Manufacturer',
    category: 'Heavy Manufacturing',
    stat: '$1.4M Saved'
  }
]

const Dashboard = ({ onOpenSimulation, onOpenTracking }) => {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchFilter, setSearchFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [storyTab, setStoryTab] = useState('Customers')
  const navigate = useNavigate()

  useEffect(() => {
    fetchCases()
  }, [])

  // Auto-advance hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [])

  const fetchCases = async () => {
    try {
      const res = await axios.get('/api/v1/cases/')
      setCases(res.data)
    } catch (err) {
      console.error('Error fetching cases:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'BOOKING_PENDING': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'PAYMENT_PENDING': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'FOLLOW_UP': return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'ESCALATED': return 'bg-rose-50 text-rose-700 border-rose-200'
      case 'RESOLVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      default: return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      c.case_id?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.live_summary?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.shipment?.container_number?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.shipment?.bl_number?.toLowerCase().includes(searchFilter.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col gap-12 w-full pb-28 animate-fade-in text-slate-800">
      
      {/* 1. HERO CAROUSEL BANNER (Screenshot 1) */}
      <section className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] bg-slate-950 overflow-hidden shadow-2xl">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Dark Vignette Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 transform scale-105"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

            {/* Slide Content */}
            <div className="relative z-20 max-w-7xl mx-auto h-full px-6 sm:px-10 flex flex-col justify-center">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d61f26] text-white text-[11px] font-black uppercase tracking-widest rounded-xs shadow-md">
                  <span>{slide.tag}</span>
                </div>
                
                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
                  {slide.title}
                </h1>
                
                <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed max-w-xl">
                  {slide.subtitle}
                </p>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button 
                    onClick={() => onOpenTracking ? onOpenTracking() : navigate('/search')}
                    className="v-btn-primary px-6 py-3 text-sm flex items-center gap-2 shadow-lg"
                  >
                    <span>Track Your Orders</span>
                    <ArrowRight size={16} />
                  </button>

                  <button 
                    onClick={() => onOpenSimulation ? onOpenSimulation() : navigate('/search')}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xs text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <span>Ingest Carrier Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center items-center gap-2.5">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentSlide 
                  ? 'w-8 h-2.5 bg-[#d61f26]' 
                  : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. PHILOSOPHY & REBRANDING STRIP (Screenshot 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full -mt-6 z-20">
        <div className="bg-white border border-slate-200 shadow-md p-6 sm:p-8 rounded-sm grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-6">
            {/* Red & Charcoal Dual Chevrons */}
            <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded flex items-center justify-center shrink-0">
              <svg className="w-8 h-8" viewBox="0 0 24 20" fill="none">
                <path d="M4 2L12 10L4 18" stroke="#d61f26" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 2L20 10L12 18" stroke="#111827" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 leading-tight">Igniting Success</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Corporate Philosophy</p>
            </div>
          </div>
          
          <div className="md:col-span-3 text-slate-600 text-xs sm:text-sm leading-relaxed">
            Our visual identity reflects the dynamic and innovative spirit of being driven forward. 
            Inspired by our <span className="font-semibold text-slate-900">'Igniting Success'</span> philosophy, XYZ Logistics combines AI-powered telemetry, carrier email parsing, and unified case management to deliver predictable supply chain execution.
          </div>
        </div>
      </section>

      {/* 3. SERVICE VERTICALS CAROUSEL STRIP (Screenshot 3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex items-end justify-between mb-6 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Our Core Logistics Solutions</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Integrated multi-modal services driving efficiency across India & global markets</p>
          </div>
          <span className="text-xs font-bold text-[#d61f26] uppercase tracking-wider hidden sm:block">
            5 Distinct Verticals
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {SERVICE_VERTICALS.map((v, i) => (
            <div
              key={i}
              className="group relative h-72 rounded-sm overflow-hidden border border-slate-200 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${v.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
              
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <div className="p-2 w-fit rounded bg-[#d61f26] mb-3 text-white shadow-sm">
                  <v.icon size={16} />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-red-300 transition-colors leading-snug">
                  {v.name}
                </h3>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TECHNOLOGY & INNOVATION SHOWCASE (Screenshot 2 & 3) */}
      <section id="technology" className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-gradient-to-r from-[#111827] via-slate-900 to-[#1e293b] rounded-sm p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#d61f26]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: LOGIONE Highlight */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-red-400 text-[11px] font-bold uppercase tracking-widest rounded-xs border border-white/10">
                <Sparkles size={13} className="text-[#d61f26]" />
                <span>SUCCESS STORY — LOGIONE AI</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Driving <span className="text-[#d61f26]">99.61%</span> Delivery Performance
              </h2>
              
              <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
                Powered by <strong>LOGIONE</strong>, our proprietary AI ecosystem extracts container, bill of lading, and freight invoices directly from carrier emails, and triggers automated relentless escalations on stranded shipments.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <span className="text-2xl font-black text-white block">99.61%</span>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider">On-Time Fulfilment</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-white block">24h</span>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider">Escalation Worker</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-white block">30,000+</span>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider">Minds At Work</span>
                </div>
              </div>
            </div>

            {/* Right Column: Case Studies List (Screenshot 2) */}
            <div className="lg:col-span-5 bg-white/5 p-6 rounded-sm border border-white/10 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Enterprise Case Studies
              </span>
              
              {CASE_STUDIES.map((study, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded transition-colors border border-white/5 flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <div>
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide block">
                      {study.category}
                    </span>
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors leading-snug">
                      {study.title}
                    </p>
                  </div>
                  <span className="text-xs font-black text-white bg-slate-800 px-2 py-1 rounded shrink-0">
                    {study.stat}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 5. ACTIVE LOGISTICS CASES MANAGEMENT HUB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full space-y-6">
        
        {/* Hub Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Logistics Cases</h2>
              <span className="px-2.5 py-0.5 bg-[#d61f26]/10 text-[#d61f26] text-xs font-bold rounded-xs">
                {cases.length} Total
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Live carrier email threads and shipment lifecycle tracking</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={onOpenSimulation}
              className="v-btn-primary text-xs py-2.5 px-4 shadow-sm"
            >
              <Plus size={15} />
              <span>Simulate Carrier Signal</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="surface-card p-4 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Search by Case ID, Container #, or BL..."
              className="v-input pl-10 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {['ALL', 'NEW', 'BOOKING_PENDING', 'PAYMENT_PENDING', 'FOLLOW_UP', 'ESCALATED', 'RESOLVED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xs text-[11px] font-bold uppercase tracking-wider transition-colors border ${
                  statusFilter === status
                    ? 'bg-[#111827] text-white border-[#111827]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Live Cases Table */}
        <div className="surface-card bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Case Reference</th>
                  <th className="px-6 py-4">Carrier Context & Summary</th>
                  <th className="px-6 py-4 hidden md:table-cell">Shipment / BL</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">
                      Loading carrier cases...
                    </td>
                  </tr>
                ) : filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium italic">
                      No matching cases found. Use "Simulate Carrier Signal" to ingest sample email telemetry.
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((c) => (
                    <tr 
                      key={c.id} 
                      onClick={() => navigate(`/case/${c.id}`)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-900 group-hover:text-[#d61f26] transition-colors">
                            #{c.case_id}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {c.messages?.[0]?.thread_id || 'Thread'}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 max-w-md">
                        <p className="text-slate-700 font-medium truncate">
                          {c.live_summary || c.messages?.[0]?.subject || 'Carrier communication pending analysis'}
                        </p>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {c.messages?.length || 0} messages in thread
                        </span>
                      </td>

                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex flex-col gap-0.5 text-slate-600">
                          <span className="font-semibold text-slate-900">
                            {c.shipment?.container_number || 'No container'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            BL: {c.shipment?.bl_number || 'N/A'}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-xs text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(c.status)}`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right text-slate-500 font-medium">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </section>

      {/* 6. STORIES OF IGNITING SUCCESS (Screenshot 4) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Stories Of Igniting Success</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Real operational outcomes delivered for India and global partners</p>
          </div>

          <div className="flex items-center gap-1 border-b-2 border-transparent">
            {['Customers', 'Employees'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStoryTab(tab)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all relative ${
                  storyTab === tab
                    ? 'text-[#d61f26] border-b-2 border-[#d61f26]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div 
              className="h-44 bg-cover bg-center"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80)' }}
            />
            <div className="p-5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#d61f26]">Performance Metric</span>
              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                Driving 99.61% Delivery Performance with LOGIONE's AI-Powered Technology Ecosystem
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Seamless synchronization of carrier linehaul operations with intelligent predictive arrival milestones.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div 
              className="h-44 bg-cover bg-center"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80)' }}
            />
            <div className="p-5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#d61f26]">On-Time SLA</span>
              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                Engineering Efficiency with 98% On-Time Delivery Rate for an Ayurvedic Brand
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Streamlined multi-city warehousing network delivering within tight customer dispatch SLAs.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div 
              className="h-44 bg-cover bg-center"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=600&q=80)' }}
            />
            <div className="p-5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#d61f26]">Hardware Logistics</span>
              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                Driving Predictability in Furniture Fittings & Hardware Distribution
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Automated freight routing and real-time shipment monitoring across nationwide hubs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-[#111827] text-white border-t border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-slate-400">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white">XYZ</span>
              <span className="text-xs font-bold text-[#d61f26] uppercase">LOGISTICS</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Accelerating progress for customers with AI-powered telemetry and integrated logistics solutions.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Solutions</h4>
            <ul className="space-y-2">
              <li>Freight Forwarding</li>
              <li>B2B Express</li>
              <li>Last Mile Delivery</li>
              <li>Contract Logistics</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Technology</h4>
            <ul className="space-y-2">
              <li>LOGIONE Platform</li>
              <li>AI Carrier NLP</li>
              <li>Relentless Reminders</li>
              <li>API Integration</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">System Registry</h4>
            <p className="leading-relaxed">
              XYZ Logistics Platform v1.4. Operational and synced with Django REST API.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          © {new Date().getFullYear()} XYZ Logistics. Inspired by Mahindra Logistics Enterprise Architecture.
        </div>
      </footer>

    </div>
  )
}

export default Dashboard
