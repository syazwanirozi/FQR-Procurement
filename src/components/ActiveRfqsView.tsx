import React, { useState } from 'react';
import { RFQItem, ProcurementCategory } from '../types';

interface ActiveRfqsViewProps {
  rfqs: RFQItem[];
  onOpenNewRfq: () => void;
  onInspectDrawer: (rfq: RFQItem) => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const ActiveRfqsView: React.FC<ActiveRfqsViewProps> = ({
  rfqs,
  onOpenNewRfq,
  onInspectDrawer,
  onShowToast,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRfqIds, setExpandedRfqIds] = useState<Record<string, boolean>>({
    'rfq-042': true,
    'rfq-044': true,
  });

  const toggleExpand = (id: string) => {
    setExpandedRfqIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredRfqs = rfqs.filter((r) => {
    const matchesCat = filterCategory === 'all' || r.category === filterCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      r.refNumber.toLowerCase().includes(query) ||
      r.title.toLowerCase().includes(query) ||
      r.specification.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  // Calculate totals
  const totalBidsExpected = rfqs.reduce((acc, r) => acc + r.bidsExpectedCount, 0);
  const totalBidsReceived = rfqs.reduce((acc, r) => acc + r.bidsReceivedCount, 0);

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-secondary uppercase tracking-wider font-bold">
                PROCUREMENT CYCLE Q4
              </span>
              <span className="h-1 w-1 rounded-full bg-outline"></span>
              <span className="font-mono text-xs text-on-surface-variant font-medium">
                Live Sourcing Pipeline
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-on-surface tracking-tight mt-0.5">
              Active RFQs &amp; Supplier Quotations
            </h1>
            <p className="text-xs text-on-surface-variant max-w-2xl mt-1 leading-relaxed">
              Track real-time multi-vendor bid parity, log incoming compliance pricing, and broadcast RFQ solicitations to pre-vetted vendor pools.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              className="h-9 px-3.5 bg-surface-container-lowest text-on-surface text-xs font-semibold rounded-lg shadow-xs hover:bg-surface-container-low transition-colors flex items-center gap-1.5 border border-surface-container cursor-pointer"
              onClick={() => onShowToast('Exported Q4 RFQ Pipeline Summary (PDF/Excel)', 'download')}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">file_download</span>
              <span>Export Pipeline</span>
            </button>
            <button
              className="h-9 px-4 bg-primary text-on-primary text-xs font-semibold rounded-lg shadow-sm hover:bg-primary-container transition-all flex items-center gap-1.5 cursor-pointer"
              onClick={onOpenNewRfq}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>New RFQ Spec</span>
            </button>
          </div>
        </div>

        {/* Top 2 KPI Summary Blocks (Image 5 background) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container-high flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                In-Flight RFQs
              </span>
              <span className="p-2 bg-surface-container rounded-lg text-secondary">
                <span className="material-symbols-outlined text-[20px]">layers</span>
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-bold font-mono text-on-surface">14</span>
              <span className="text-xs font-semibold text-on-tertiary-container">
                +1 today
              </span>
            </div>
            <div className="mt-2 text-xs text-on-surface-variant">
              3 awaiting executive baseline sign-off
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container-high flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                Quotations Under Review
              </span>
              <span className="p-2 bg-surface-container rounded-lg text-secondary">
                <span className="material-symbols-outlined text-[20px]">request_quote</span>
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-on-surface">38</span>
              <span className="text-xs font-mono text-on-surface-variant">/ 42 expected</span>
            </div>
            <div className="mt-2 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-surface-container-lowest p-3 rounded-xl shadow-xs border border-surface-container-high flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
              onClick={() => setFilterCategory('all')}
            >
              All Projects ({rfqs.length})
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === 'it'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
              onClick={() => setFilterCategory('it')}
            >
              IT &amp; Cloud ({rfqs.filter((r) => r.category === 'it').length})
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === 'facilities'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
              onClick={() => setFilterCategory('facilities')}
            >
              Facilities ({rfqs.filter((r) => r.category === 'facilities').length})
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === 'set_props'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
              onClick={() => setFilterCategory('set_props')}
            >
              Set &amp; Props ({rfqs.filter((r) => r.category === 'set_props').length})
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === 'catering'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
              onClick={() => setFilterCategory('catering')}
            >
              Catering ({rfqs.filter((r) => r.category === 'catering').length})
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === 'production'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
              onClick={() => setFilterCategory('production')}
            >
              Production ({rfqs.filter((r) => r.category === 'production').length})
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === 'vehicle_rental'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
              onClick={() => setFilterCategory('vehicle_rental')}
            >
              Vehicle Rental ({rfqs.filter((r) => r.category === 'vehicle_rental').length})
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === 'merchandise'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
              onClick={() => setFilterCategory('merchandise')}
            >
              Merchandise ({rfqs.filter((r) => r.category === 'merchandise').length})
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === 'light_sound'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
              onClick={() => setFilterCategory('light_sound')}
            >
              Light &amp; Sound ({rfqs.filter((r) => r.category === 'light_sound').length})
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              className="w-full h-8 pl-8 pr-3 bg-surface-container-low text-xs text-on-surface rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary border border-surface-container"
              placeholder="Filter by RFQ ID or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* RFQ Projects List */}
        <div className="space-y-4">
          {filteredRfqs.map((rfq) => {
            const isExpanded = expandedRfqIds[rfq.id] ?? false;

            return (
              <div
                key={rfq.id}
                className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container-high overflow-hidden transition-all"
              >
                {/* RFQ Card Header Strip */}
                <div
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-surface-container-low/40 transition-colors select-none"
                  onClick={() => toggleExpand(rfq.id)}
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      className="p-1 text-on-surface-variant hover:text-on-surface mt-0.5 rounded cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(rfq.id);
                      }}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">
                          {rfq.refNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            rfq.status === 'urgent'
                              ? 'bg-error-container text-on-error-container animate-pulse'
                              : rfq.status === 'overdue'
                              ? 'bg-error text-on-error'
                              : rfq.status === 'draft'
                              ? 'bg-surface-container-high text-on-surface-variant'
                              : 'bg-surface-container-high text-on-surface'
                          }`}
                        >
                          {rfq.timeRemaining}
                        </span>
                        <span className="text-xs text-on-surface-variant font-medium">
                          • {rfq.categoryLabel}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-on-surface mt-1">
                        {rfq.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1 max-w-3xl">
                        {rfq.specification}
                      </p>
                    </div>
                  </div>

                  {/* Right Header Stats & Actions */}
                  <div className="flex items-center gap-4 flex-shrink-0 self-end md:self-center">
                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-on-surface">
                        {rfq.bidsReceivedCount} of {rfq.bidsExpectedCount} Bids Received
                      </div>
                      <div className="text-[11px] text-on-surface-variant font-mono">
                        Budget: ${rfq.budgetCeiling.toLocaleString()}
                      </div>
                    </div>

                    <button
                      className="h-8 px-3 bg-surface-container text-secondary text-xs font-semibold rounded-lg hover:bg-secondary hover:text-on-secondary transition-colors flex items-center gap-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectDrawer(rfq);
                      }}
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Compare</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Bid Submissions Matrix */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-surface-container bg-surface-container-low/30 space-y-3">
                    <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider pt-2 flex items-center justify-between">
                      <span>Submitted Quotations &amp; Vendor Standings</span>
                      <span className="font-mono text-secondary">
                        Deadline: {rfq.deadlineDisplay}
                      </span>
                    </div>

                    {rfq.bids.length > 0 ? (
                      <div className="space-y-2">
                        {rfq.bids.map((bid) => (
                          <div
                            key={bid.id}
                            className="p-3.5 bg-surface-container-lowest rounded-xl border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-secondary/40 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center font-mono font-bold text-xs">
                                {bid.supplierInitials}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-on-surface flex items-center gap-2">
                                  <span>{bid.supplierName}</span>
                                  {bid.isLowestBid && (
                                    <span className="bg-secondary text-on-secondary text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
                                      Lowest Bid
                                    </span>
                                  )}
                                  {bid.isVerified && (
                                    <span className="bg-on-tertiary-container text-white text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
                                      Verified
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-on-surface-variant mt-0.5 flex items-center gap-2">
                                  <span>Submitted {bid.submittedAt}</span>
                                  <span>• SLA: {bid.sla}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <span className="font-mono text-sm font-bold text-on-surface">
                                  ${bid.netAmount.toLocaleString()}.00
                                </span>
                                <span className="block text-[10px] text-on-surface-variant">
                                  Annualized Net
                                </span>
                              </div>

                              <button
                                className="px-3 py-1.5 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:bg-primary-container transition-colors cursor-pointer"
                                onClick={() => {
                                  onShowToast(`Award draft initialized for ${bid.supplierName}`);
                                  onInspectDrawer(rfq);
                                }}
                              >
                                Draft Award
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-surface-container-lowest rounded-xl border border-dashed border-surface-container-high text-center text-xs text-on-surface-variant">
                        No vendor quotations received yet. Broadcast solicitations were dispatched to {rfq.invitedSuppliers.join(', ')}.
                      </div>
                    )}

                    {/* Pending Vendor reminders strip */}
                    {rfq.invitedSuppliers.filter((s) => !rfq.bids.some((b) => b.supplierName.includes(s) || s.includes(b.supplierName))).length > 0 && (
                      <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-on-surface-variant gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-error font-semibold">Awaiting bids from:</span>
                          <span className="font-mono text-[11px]">
                            {rfq.invitedSuppliers
                              .filter((s) => !rfq.bids.some((b) => b.supplierName.includes(s) || s.includes(b.supplierName)))
                              .join(', ')}
                          </span>
                        </div>
                        <button
                          className="text-secondary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                          onClick={() => onShowToast(`1-Click cutoff reminders dispatched for ${rfq.refNumber}`)}
                        >
                          <span className="material-symbols-outlined text-[14px]">send</span>
                          <span>Broadcast Urgent Nudge</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
