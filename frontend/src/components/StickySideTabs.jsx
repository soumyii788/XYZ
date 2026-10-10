import React from 'react'
import { Search, Radio } from 'lucide-react'

const StickySideTabs = ({ onOpenTracking, onOpenSimulation }) => {
  return (
    <aside className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-1 select-none">
      {/* Red Tab: Track Your Orders */}
      <button
        onClick={onOpenTracking}
        className="group relative flex items-center bg-[#d61f26] hover:bg-[#b91c1c] text-white py-4 px-2.5 rounded-l-md shadow-xl transition-all duration-200 hover:-translate-x-1 cursor-pointer"
        title="Track Your Orders"
      >
        <span className="vertical-tab-text text-[11px] font-bold uppercase tracking-wider">
          Track Your Orders
        </span>
      </button>

      {/* Blue Tab: Carrier Signal Ingest / Simulation */}
      <button
        onClick={onOpenSimulation}
        className="group relative flex items-center bg-[#0284c7] hover:bg-[#0369a1] text-white py-4 px-2.5 rounded-l-md shadow-xl transition-all duration-200 hover:-translate-x-1 cursor-pointer"
        title="Simulate Carrier Signal"
      >
        <span className="vertical-tab-text text-[11px] font-bold uppercase tracking-wider">
          Carrier Ingestion
        </span>
      </button>
    </aside>
  )
}

export default StickySideTabs
