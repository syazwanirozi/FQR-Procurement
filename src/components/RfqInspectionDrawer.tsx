import React, { useState } from 'react';
import { RFQItem } from '../types';

interface RfqInspectionDrawerProps {
  rfq: RFQItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDraftAward: (rfq: RFQItem, vendorName: string) => void;
  onExtendCutoff: (rfq: RFQItem, hours: number) => void;
  onSendNudge: (vendorName: string) => void;
}

export const RfqInspectionDrawer: React.FC<RfqInspectionDrawerProps> = ({
  rfq,
  isOpen,
  onClose,
  onDraftAward,
  onExtendCutoff,
  onSendNudge,
}) => {
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);

  if (!isOpen || !rfq) return null;

  // Calculate pricing delta if at least 2 bids exist
  const validBids = rfq.bids.filter((b) => b.netAmount > 0);
  const lowestBid = validBids.length > 0 ? Math.min(...validBids.map((b) => b.netAmount)) : 0;
  const highestBid = validBids.length > 1 ? Math.max(...validBids.map((b) => b.netAmount)) : 0;
  const delta = highestBid > 0 && lowestBid > 0 ? highestBid - lowestBid : 0;
  const deltaPct = highestBid > 0 ? ((delta / highestBid) * 100).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <aside className="w-screen max-w-xl bg-surface-container-lowest shadow-2xl flex flex-col border-l border-surface-container-high animate-in slide-in-from-right duration-300">
          {/* Drawer Dark Slate Header */}
          <div className="bg-primary-container text-on-primary-container px-6 py-5 flex items-center justify-between border-b border-surface-container-high/30">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-secondary px-2 py-0.5 rounded font-mono text-xs font-bold text-on-secondary">
                  {rfq.refNumber}
                </span>
                <span className="text-error text-xs uppercase font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                  {rfq.timeRemaining} Countdown
                </span>
              </div>
              <h3 className="text-lg font-bold text-on-primary mt-1 leading-snug">
                {rfq.title}
              </h3>
            </div>
            <button
              className="p-1.5 rounded-lg text-on-primary-container hover:text-on-primary hover:bg-white/10 transition-colors"
              onClick={onClose}
              title="Close Drawer"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          {/* Drawer Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Spec Snapshot */}
            <div className="bg-surface-container-low p-4 rounded-xl space-y-2 border border-surface-container">
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                Specifications &amp; Terms
              </span>
              <p className="text-xs text-on-surface leading-relaxed">
                {rfq.specification}
              </p>

              {/* BQ Items Breakdown if present */}
              {rfq.bqItems && rfq.bqItems.length > 0 && (
                <div className="pt-2 border-t border-surface-container/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-secondary text-[14px]">receipt_long</span>
                      Bill of Quantities (BQ Breakdown)
                    </span>
                    <span className="text-[10px] font-semibold text-secondary px-1.5 py-0.5 rounded bg-secondary/10">
                      {rfq.bqItems.length} Items
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-surface-container bg-surface-container-lowest">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-surface-container text-on-surface-variant font-bold uppercase tracking-wider text-[9px]">
                        <tr>
                          <th className="py-1.5 px-2">No</th>
                          <th className="py-1.5 px-2">Item Description</th>
                          <th className="py-1.5 px-2 text-center">Qty</th>
                          <th className="py-1.5 px-2">Unit</th>
                          <th className="py-1.5 px-2 text-right">Total (MYR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container font-mono text-[10px]">
                        {rfq.bqItems.map((item) => (
                          <tr key={item.id} className="hover:bg-surface-container-low/50">
                            <td className="py-1.5 px-2 text-on-surface-variant">{item.itemNo}</td>
                            <td className="py-1.5 px-2 font-sans text-on-surface">{item.description}</td>
                            <td className="py-1.5 px-2 text-center text-on-surface">{item.quantity}</td>
                            <td className="py-1.5 px-2 text-on-surface-variant font-sans">{item.unit}</td>
                            <td className="py-1.5 px-2 text-right text-secondary font-bold">
                              RM {(item.totalEstimated || 0).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-on-surface-variant border-t border-surface-container/60">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                  <span>Cutoff: {rfq.deadlineDisplay}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-on-tertiary-container">account_balance</span>
                  <span>Budget ceiling: ${rfq.budgetCeiling.toLocaleString()} / yr</span>
                </span>
              </div>
            </div>

            {/* Live Vendor Submissions Comparison */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-on-surface">
                  Received Bids ({rfq.bidsReceivedCount} of {rfq.bidsExpectedCount})
                </h4>
                {delta > 0 && (
                  <span className="text-xs font-mono font-bold text-on-tertiary-container">
                    Delta: -${delta.toLocaleString()}.00 ({deltaPct}%)
                  </span>
                )}
              </div>

              {/* Vendor Bids List */}
              {rfq.bids.map((bid) => (
                <div
                  key={bid.id}
                  onClick={() => setSelectedBidId(bid.id)}
                  className={`p-4 rounded-xl space-y-2 transition-all cursor-pointer border ${
                    selectedBidId === bid.id
                      ? 'bg-surface-container border-secondary shadow-sm ring-1 ring-secondary/40'
                      : 'bg-surface-container-low border-surface-container hover:bg-surface-container/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-on-surface">
                          {bid.supplierName}
                        </span>
                        {bid.isLowestBid ? (
                          <span className="bg-secondary text-on-secondary text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                            Lowest Bid
                          </span>
                        ) : bid.isVerified ? (
                          <span className="bg-on-tertiary-container text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                            Verified
                          </span>
                        ) : null}
                      </div>
                      <span className="text-[11px] text-on-surface-variant block mt-0.5">
                        Submitted {bid.submittedAt}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-base font-mono font-bold ${bid.isLowestBid ? 'text-secondary' : 'text-on-surface'}`}>
                        ${bid.netAmount.toLocaleString()}.00
                      </span>
                      <span className="block text-[11px] text-on-surface-variant">Annualized Net</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 text-on-surface-variant border-t border-surface-container/60">
                    <span className="font-medium">SLA: {bid.sla}</span>
                    {bid.migrationCredit ? (
                      <span className="font-mono text-secondary">
                        Migration Credit: ${bid.migrationCredit.toLocaleString()}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}

              {/* Awaiting / Pending Vendors */}
              {rfq.invitedSuppliers
                .filter((s) => !rfq.bids.some((b) => b.supplierName.includes(s) || s.includes(b.supplierName)))
                .map((pendingSup, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-surface-container-low rounded-xl border border-surface-container opacity-70 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-on-surface">{pendingSup}</span>
                        <span className="block text-xs text-error font-semibold mt-0.5">
                          No submission recorded
                        </span>
                      </div>
                      <button
                        className="px-3 py-1.5 bg-surface-container-highest text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                        onClick={() => onSendNudge(pendingSup)}
                      >
                        Send Urgent Nudge
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Quick Action Controls */}
            <div className="bg-surface-container p-4 rounded-xl space-y-3 border border-surface-container-high">
              <span className="text-xs text-on-surface font-bold uppercase tracking-wider block">
                Decision Protocol
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="py-2.5 px-3 bg-primary text-on-primary text-xs font-semibold rounded-lg shadow-sm hover:bg-primary-container text-center transition-colors cursor-pointer"
                  onClick={() => {
                    const winner = rfq.bids.find((b) => b.isLowestBid) || rfq.bids[0];
                    onDraftAward(rfq, winner ? winner.supplierName : 'Vendor');
                  }}
                >
                  Draft Award Choice
                </button>
                <button
                  className="py-2.5 px-3 bg-surface-container-lowest text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container-high text-center border border-surface-container-high transition-colors cursor-pointer"
                  onClick={() => onExtendCutoff(rfq, 24)}
                >
                  Extend Cutoff (+24h)
                </button>
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-surface-container-low border-t border-surface-container flex items-center justify-between text-on-surface-variant text-xs">
            <span className="font-mono text-[11px]">Audit Ref: PS-2025-{rfq.refNumber}-REV1</span>
            <button
              className="font-semibold text-on-surface hover:underline cursor-pointer"
              onClick={onClose}
            >
              Close Drawer
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
