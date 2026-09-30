import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(0,0,0,0.02)] border-t border-surface-container-high mt-auto">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
          <span className="font-semibold text-on-surface">Procurement Engine: Synchronized Live</span>
          <span className="text-outline-variant">•</span>
          <span>Next RFQ cutoff in 3h 42m</span>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <span>Audit Log: Compliant</span>
          <span className="hover:text-on-surface cursor-pointer transition-colors">Procurement Governance</span>
          <span className="hover:text-on-surface cursor-pointer transition-colors">Security Center</span>
          <span className="font-mono text-[11px] text-outline">© 2025 ProcureSource Inc.</span>
        </div>
      </div>
    </footer>
  );
};
