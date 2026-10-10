import React from 'react'

const BrandLogo = ({ variant = 'dark', className = '' }) => {
  const isDark = variant === 'dark' // dark theme (white text on dark navbar)
  
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            XYZ
          </span>
          <span className="text-xs font-bold tracking-widest text-[#d61f26] uppercase">
            LOGISTICS
          </span>
        </div>
      </div>
      {/* Dual Forward Chevron Mark */}
      <svg className="w-6 h-5" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 2L12 10L4 18" stroke="#d61f26" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 2L20 10L12 18" stroke="#111827" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={isDark ? "stroke-white" : "stroke-slate-900"} />
      </svg>
    </div>
  )
}

export default BrandLogo
