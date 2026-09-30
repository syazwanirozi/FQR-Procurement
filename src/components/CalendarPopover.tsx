import React from 'react';
import { RFQItem } from '../types';

interface CalendarPopoverProps {
  rfq: RFQItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDrawer: (rfq: RFQItem) => void;
}

export const CalendarPopover: React.FC<CalendarPopoverProps> = ({
  rfq,
  isOpen,
  onClose,
  onOpenDrawer,
}) => {
  if (!isOpen || !rfq) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest max-w-lg w-full rounded-xl shadow-2xl overflow-hidden border border-surface-container-high animate-in fade-in zoom-in-95 duration-150">
        {/* Popover Header */}
        <div className="bg-primary-container text-on-primary-container px-6 py-4 flex items-center justify-between">
          <div>
            <span className="font-mono text-xs text-secondary font-bold tracking-wide">
              {rfq.refNumber}
            </span>
            <h3 className="text-base font-bold text-on-primary mt-0.5">
              {rfq.title}
            </h3>
          </div>
          <button
            className="text-on-primary-container hover:text-on-primary p-1 rounded-lg hover:bg-white/10 transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 bg-surface-container-low p-3.5 rounded-lg border border-surface-container">
            <div>
              <span className="text-[11px] font-semibold text-on-surface-variant block uppercase tracking-wider">
                Cutoff Status
              </span>
              <span className={`text-xs font-bold mt-0.5 block ${rfq.status === 'overdue' ? 'text-error' : rfq.status === 'urgent' ? 'text-secondary' : 'text-on-surface'}`}>
                {rfq.deadlineDisplay}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-on-surface-variant block uppercase tracking-wider">
                Responses
              </span>
              <span className="text-xs font-mono font-bold text-on-surface mt-0.5 block">
                {rfq.bidsReceivedCount} of {rfq.bidsExpectedCount} Submitted
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
              Invited Suppliers Progress
            </h4>
            <div className="space-y-2">
              {rfq.bids.length > 0 ? (
                rfq.bids.map((bid) => (
                  <div
                    key={bid.id}
                    className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-lg border border-surface-container"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-on-tertiary-container text-[18px]">
                        check_circle
                      </span>
                      <span className="text-xs font-semibold text-on-surface">
                        {bid.supplierName}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-on-tertiary-container">
                      ${bid.netAmount.toLocaleString()} / yr
                    </span>
                  </div>
                ))
              ) : null}

              {rfq.invitedSuppliers
                .filter((s) => !rfq.bids.some((b) => b.supplierName.includes(s) || s.includes(b.supplierName)))
                .map((pendingSup, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-lg border border-surface-container"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-outline text-[18px]">
                        pending
                      </span>
                      <span className="text-xs text-on-surface">
                        {pendingSup}
                      </span>
                    </div>
                    <span className="text-[11px] text-error font-semibold">
                      Pending Response
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              className="px-4 py-2 bg-surface-container-low text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container transition-all"
              onClick={onClose}
            >
              Close
            </button>
            <button
              className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg shadow-sm hover:bg-primary-container transition-all flex items-center gap-1.5"
              onClick={() => {
                onClose();
                onOpenDrawer(rfq);
              }}
            >
              <span>Open Comparison Matrix</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
