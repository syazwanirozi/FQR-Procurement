import React, { useState } from 'react';
import { RFQItem, ProcurementCategory } from '../types';

interface DashboardViewProps {
  rfqs: RFQItem[];
  onOpenNewRfq: () => void;
  onOpenAddSupplier: () => void;
  onSelectRfq: (rfq: RFQItem) => void;
  onInspectDrawer: (rfq: RFQItem) => void;
  onExportIcs: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  rfqs,
  onOpenNewRfq,
  onOpenAddSupplier,
  onSelectRfq,
  onInspectDrawer,
  onExportIcs,
  onShowToast,
}) => {
  const [showTicker, setShowTicker] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'timeline'>('month');
  const [autoPingEnabled, setAutoPingEnabled] = useState(true);

  // Filter category helper
  const isCellHighlighted = (cat: ProcurementCategory) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'it' && cat === 'it') return true;
    if (selectedCategory === 'facilities' && cat === 'facilities') return true;
    if (selectedCategory === 'catering' && cat === 'catering') return true;
    if (selectedCategory === 'logistics' && cat === 'logistics') return true;
    if (selectedCategory === 'vehicle_rental' && cat === 'vehicle_rental') return true;
    if (selectedCategory === 'merchandise' && cat === 'merchandise') return true;
    if (selectedCategory === 'production' && cat === 'production') return true;
    if (selectedCategory === 'set_props' && cat === 'set_props') return true;
    if (selectedCategory === 'light_sound' && cat === 'light_sound') return true;
    return false;
  };

  // Find specific RFQs for fast access
  const rfq038 = rfqs.find((r) => r.id === 'rfq-038');
  const rfq042 = rfqs.find((r) => r.id === 'rfq-042');
  const rfq044 = rfqs.find((r) => r.id === 'rfq-044');
  const rfq045 = rfqs.find((r) => r.id === 'rfq-045');
  const rfq046 = rfqs.find((r) => r.id === 'rfq-046');
  const rfq047 = rfqs.find((r) => r.id === 'rfq-047');
  const rfq050 = rfqs.find((r) => r.id === 'rfq-050');
  const rfq051 = rfqs.find((r) => r.id === 'rfq-051');

  const urgentRfqs = rfqs.filter((r) => r.status === 'urgent');

  return (
    <div className="flex flex-col w-full">
      {/* Top Urgency Alert Ticker Banner */}
      {showTicker && (
        <div className="w-full bg-error-container text-on-error-container px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs border-b border-error/20">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error"></span>
            </span>
            <span className="material-symbols-outlined text-[18px] text-error flex-shrink-0">
              notification_important
            </span>
            <span className="text-xs tracking-tight font-bold">
              2 Quotation deadlines approaching within 48 hours:
            </span>
            <span className="text-xs text-on-error-container">
              RFQ-2025-042 (Cloud Infrastructure) &amp; RFQ-2025-044 (Office Facilities).
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="text-xs uppercase tracking-wider font-bold text-error hover:underline flex items-center gap-1 cursor-pointer"
              onClick={() => {
                if (rfq042) onInspectDrawer(rfq042);
              }}
            >
              <span>Inspect Deadlines</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
            <button
              className="text-on-error-container hover:opacity-75 p-0.5 cursor-pointer"
              onClick={() => setShowTicker(false)}
              title="Dismiss banner"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Canvas Container */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Metric Summary Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* KPI 1: Active RFQs */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Active RFQs
              </span>
              <span className="p-1.5 bg-surface-container rounded-lg text-secondary">
                <span className="material-symbols-outlined text-[18px]">broadcast_on_personal</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-bold text-on-surface font-mono">4</span>
              <span className="text-xs font-semibold text-on-tertiary-container">
                +1 broadcasted today
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-on-surface-variant text-xs">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span>100% procurement compliance</span>
            </div>
          </div>

          {/* KPI 2: Pending Quotes */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Pending Quotes
              </span>
              <span className="p-1.5 bg-surface-container rounded-lg text-secondary">
                <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-bold text-on-surface font-mono">9</span>
              <span className="text-xs text-on-surface-variant">Awaiting vendor quotes</span>
            </div>
            <div className="mt-3 w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
              <div className="bg-secondary h-1.5 rounded-full" style={{ width: '61%' }}></div>
            </div>
          </div>

          {/* KPI 3: Urgent Deadlines */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-error uppercase tracking-wider">
                Urgent (&lt;48h)
              </span>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-bold text-error font-mono">
                {urgentRfqs.length}
              </span>
              <span className="text-xs text-on-surface-variant">Projects critical</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-error font-semibold">
              <span className="truncate">RFQ-042 • RFQ-044</span>
              <button
                className="underline hover:text-on-error-container cursor-pointer ml-1"
                onClick={() => {
                  if (rfq042) onInspectDrawer(rfq042);
                }}
              >
                View
              </button>
            </div>
          </div>

          {/* KPI 4: Overdue Cutoffs */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-error uppercase tracking-wider">
                Overdue Cutoffs
              </span>
              <span className="p-1.5 bg-error-container rounded-lg text-error">
                <span className="material-symbols-outlined text-[18px]">warning</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-bold text-error font-mono">1</span>
              <span className="text-xs text-on-surface-variant">Action required</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant truncate mr-1">RFQ-038 Fleet Vans</span>
              <button
                className="text-secondary font-semibold hover:underline cursor-pointer flex-shrink-0"
                onClick={() => {
                  onShowToast('Extended submission cutoff deadline by 72 hours for RFQ-038 Fleet Vans.', 'update');
                }}
              >
                Re-broadcast
              </button>
            </div>
          </div>

          {/* KPI 5: Quotes Received */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Received MTD
              </span>
              <span className="p-1.5 bg-surface-container rounded-lg text-on-tertiary-container">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-bold text-on-surface font-mono">14</span>
              <span className="text-xs font-semibold text-on-tertiary-container">
                82% Quote rate
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-on-surface-variant">
              <span>Est. Savings: $42,850</span>
              <span className="font-mono text-on-surface font-semibold">3 Finalized</span>
            </div>
          </div>
        </section>

        {/* Quick Actions Toolbar & Status Pills */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-on-surface-variant pr-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">filter_alt</span> Quick Filter:
            </span>
            <button
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
              onClick={() => setSelectedCategory('all')}
            >
              All Categories ({rfqs.length})
            </button>
            <button
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                selectedCategory === 'it'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
              onClick={() => setSelectedCategory('it')}
            >
              IT &amp; Cloud ({rfqs.filter((r) => r.category === 'it').length})
            </button>
            <button
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                selectedCategory === 'set_props'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
              onClick={() => setSelectedCategory('set_props')}
            >
              Set &amp; Props ({rfqs.filter((r) => r.category === 'set_props').length})
            </button>
            <button
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                selectedCategory === 'catering'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
              onClick={() => setSelectedCategory('catering')}
            >
              Events &amp; Catering ({rfqs.filter((r) => r.category === 'catering').length})
            </button>
            <button
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                selectedCategory === 'production'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
              onClick={() => setSelectedCategory('production')}
            >
              Production ({rfqs.filter((r) => r.category === 'production').length})
            </button>
            <button
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                selectedCategory === 'vehicle_rental'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
              onClick={() => setSelectedCategory('vehicle_rental')}
            >
              Vehicle Rental ({rfqs.filter((r) => r.category === 'vehicle_rental').length})
            </button>
            <button
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                selectedCategory === 'merchandise'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
              onClick={() => setSelectedCategory('merchandise')}
            >
              Merchandise ({rfqs.filter((r) => r.category === 'merchandise').length})
            </button>
            <button
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                selectedCategory === 'light_sound'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
              onClick={() => setSelectedCategory('light_sound')}
            >
              Light &amp; Sound ({rfqs.filter((r) => r.category === 'light_sound').length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="h-9 px-3.5 bg-primary text-on-primary text-xs font-semibold rounded-lg shadow-sm hover:bg-primary-container transition-all flex items-center gap-1.5 cursor-pointer"
              onClick={onOpenNewRfq}
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>New RFQ</span>
            </button>
            <button
              className="h-9 px-3 bg-surface-container-low text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container transition-all flex items-center gap-1.5 cursor-pointer border border-surface-container"
              onClick={onOpenAddSupplier}
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">person_add</span>
              <span className="hidden sm:inline">Add Supplier</span>
            </button>
            <button
              className="h-9 px-3 bg-surface-container-low text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container transition-all flex items-center gap-1.5 cursor-pointer border border-surface-container"
              onClick={onExportIcs}
              title="Export Deadlines to Outlook/Google Calendar"
            >
              <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">calendar_add_on</span>
              <span className="hidden sm:inline">Export ICS</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid: 8 Cols Calendar & 4 Cols Quotation Stream */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Calendar Container (8 Cols on XL) */}
          <section className="xl:col-span-8 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container-high p-5 flex flex-col">
            {/* Calendar Header & Navigation Controls */}
            <div className="flex flex-wrap items-center justify-between pb-4 gap-4 border-b border-surface-container/60 mb-2">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-on-surface tracking-tight">October 2025</h2>
                <span className="bg-surface-container px-2.5 py-0.5 rounded-full font-mono text-[11px] text-secondary font-bold">
                  Q4 Fiscal Cycle
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* View Selector */}
                <div className="flex bg-surface-container-low p-1 rounded-lg border border-surface-container">
                  <button
                    onClick={() => setCalendarView('month')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      calendarView === 'month'
                        ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Month View
                  </button>
                  <button
                    onClick={() => {
                      setCalendarView('week');
                      onShowToast('Switched to 7-Day Tactical Agenda View');
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      calendarView === 'week'
                        ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Week Agenda
                  </button>
                  <button
                    onClick={() => {
                      setCalendarView('timeline');
                      onShowToast('Switched to Gantt Urgency Timeline');
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      calendarView === 'timeline'
                        ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Urgency Timeline
                  </button>
                </div>

                {/* Month Prev / Today / Next buttons */}
                <div className="flex items-center bg-surface-container-low rounded-lg p-0.5 border border-surface-container">
                  <button
                    className="p-1 text-on-surface-variant hover:text-on-surface rounded cursor-pointer"
                    title="Previous Month"
                    onClick={() => onShowToast('Navigating previous month: September 2025')}
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <button
                    className="px-2.5 py-1 text-xs font-bold text-on-surface hover:bg-surface-container-lowest rounded cursor-pointer"
                    onClick={() => onShowToast('Centered on current date: Oct 14, 2025')}
                  >
                    Today
                  </button>
                  <button
                    className="p-1 text-on-surface-variant hover:text-on-surface rounded cursor-pointer"
                    title="Next Month"
                    onClick={() => onShowToast('Navigating next month: November 2025')}
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center py-2 bg-surface-container-low rounded-lg text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>

            {/* 35-Cell Month Grid (October 2025 Exact Match) */}
            <div className="grid grid-cols-7 gap-1 mt-1 flex-1 min-h-[580px]">
              {/* 29 Sep (Prev Month) */}
              <div className="bg-surface-container-lowest p-2 opacity-40 rounded flex flex-col justify-between min-h-[96px] border border-surface-container/50">
                <span className="font-mono text-xs text-on-surface-variant">29</span>
              </div>
              {/* 30 Sep */}
              <div className="bg-surface-container-lowest p-2 opacity-40 rounded flex flex-col justify-between min-h-[96px] border border-surface-container/50">
                <span className="font-mono text-xs text-on-surface-variant">30</span>
              </div>
              {/* 1 Oct */}
              <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] hover:bg-surface-container transition-colors border border-surface-container/60">
                <span className="font-mono text-xs font-semibold">1</span>
              </div>
              {/* 2 Oct */}
              <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] hover:bg-surface-container transition-colors border border-surface-container/60">
                <span className="font-mono text-xs font-semibold">2</span>
              </div>
              {/* 3 Oct */}
              <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] hover:bg-surface-container transition-colors border border-surface-container/60">
                <span className="font-mono text-xs font-semibold">3</span>
              </div>
              {/* 4 Oct (Weekend) */}
              <div className="bg-surface-container-lowest p-2 rounded flex flex-col justify-between min-h-[96px] opacity-75 border border-surface-container/50">
                <span className="font-mono text-xs text-on-surface-variant">4</span>
              </div>
              {/* 5 Oct (Weekend) */}
              <div className="bg-surface-container-lowest p-2 rounded flex flex-col justify-between min-h-[96px] opacity-75 border border-surface-container/50">
                <span className="font-mono text-xs text-on-surface-variant">5</span>
              </div>

              {/* 6 Oct */}
              <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] hover:bg-surface-container transition-colors border border-surface-container/60">
                <span className="font-mono text-xs font-semibold">6</span>
              </div>

              {/* 7 Oct: Overdue Date Cell (RFQ-038 Light & Sound) */}
              <div
                className={`bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] relative group cursor-pointer hover:bg-surface-container border border-surface-container transition-all ${
                  isCellHighlighted('light_sound') ? 'opacity-100' : 'opacity-25'
                }`}
                onClick={() => rfq038 && onSelectRfq(rfq038)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-error">7</span>
                  <span className="material-symbols-outlined text-error text-[16px]">warning</span>
                </div>
                <div className="bg-error-container text-on-error-container p-1.5 rounded text-[10px] leading-tight font-semibold flex flex-col shadow-xs border border-error/20">
                  <div className="flex items-center justify-between">
                    <span className="font-mono">RFQ-038</span>
                    <span className="uppercase text-[9px] bg-error text-on-error px-1 rounded font-bold">
                       OVERDUE
                    </span>
                  </div>
                  <span className="truncate mt-0.5">Stage Light &amp; Sound</span>
                </div>
              </div>

              {/* 8 Oct */}
              <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] hover:bg-surface-container transition-colors border border-surface-container/60">
                <span className="font-mono text-xs font-semibold">8</span>
              </div>
              {/* 9 Oct */}
              <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] hover:bg-surface-container transition-colors border border-surface-container/60">
                <span className="font-mono text-xs font-semibold">9</span>
              </div>
              {/* 10 Oct */}
              <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] hover:bg-surface-container transition-colors border border-surface-container/60">
                <span className="font-mono text-xs font-semibold">10</span>
              </div>
              {/* 11 Oct */}
              <div className="bg-surface-container-lowest p-2 rounded flex flex-col justify-between min-h-[96px] opacity-75 border border-surface-container/50">
                <span className="font-mono text-xs text-on-surface-variant">11</span>
              </div>
              {/* 12 Oct */}
              <div className="bg-surface-container-lowest p-2 rounded flex flex-col justify-between min-h-[96px] opacity-75 border border-surface-container/50">
                <span className="font-mono text-xs text-on-surface-variant">12</span>
              </div>

              {/* 13 Oct */}
              <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] hover:bg-surface-container transition-colors border border-surface-container/60">
                <span className="font-mono text-xs font-semibold">13</span>
              </div>

              {/* 14 Oct: TODAY (Urgent Deadline 1 - RFQ-042 Cloud Infra) */}
              <div
                className={`bg-surface-container-high p-2 rounded flex flex-col justify-between min-h-[96px] relative shadow-inner cursor-pointer hover:bg-surface-variant border border-secondary/40 transition-all ${
                  isCellHighlighted('it') ? 'opacity-100 ring-1 ring-secondary/30' : 'opacity-25'
                }`}
                onClick={() => rfq042 && onSelectRfq(rfq042)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <span>14</span>
                    <span className="bg-secondary text-on-secondary text-[9px] px-1 py-0.2 rounded uppercase font-bold">
                      TODAY
                    </span>
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
                </div>
                <div className="bg-surface-container-lowest text-on-surface p-1.5 rounded text-[10px] leading-tight font-semibold shadow-xs border border-surface-container mt-1">
                  <div className="flex items-center justify-between text-secondary">
                    <span className="font-mono font-bold">RFQ-042</span>
                    <span className="text-error font-bold">6h left</span>
                  </div>
                  <span className="truncate block text-on-surface mt-0.5">
                    Cloud Infra (AWS/Azure)
                  </span>
                  <span className="text-[9px] text-on-surface-variant block mt-0.5">
                    2/3 bids received
                  </span>
                </div>
              </div>

              {/* 15 Oct: TOMORROW (Urgent Deadline 2 - RFQ-044 Facilities) */}
              <div
                className={`bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] cursor-pointer hover:bg-surface-container border border-surface-container transition-all ${
                  isCellHighlighted('facilities') ? 'opacity-100' : 'opacity-25'
                }`}
                onClick={() => rfq044 && onSelectRfq(rfq044)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold">15</span>
                  <span className="text-[10px] text-on-surface-variant font-semibold">Tomw</span>
                </div>
                <div className="bg-surface-container-lowest text-on-surface p-1.5 rounded text-[10px] leading-tight font-semibold shadow-xs border border-surface-container mt-1">
                  <div className="flex items-center justify-between text-secondary">
                    <span className="font-mono font-bold">RFQ-044</span>
                    <span className="text-secondary font-bold">28h left</span>
                  </div>
                  <span className="truncate block text-on-surface mt-0.5">
                    Facilities HVAC Spec
                  </span>
                  <span className="text-[9px] text-on-surface-variant block mt-0.5">
                    3/4 bids received
                  </span>
                </div>
              </div>

              {/* 16 Oct */}
              <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] hover:bg-surface-container transition-colors border border-surface-container/60">
                <span className="font-mono text-xs font-semibold">16</span>
              </div>
              {/* 17 Oct */}
              <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] hover:bg-surface-container transition-colors border border-surface-container/60">
                <span className="font-mono text-xs font-semibold">17</span>
              </div>
              {/* 18 Oct */}
              <div className="bg-surface-container-lowest p-2 rounded flex flex-col justify-between min-h-[96px] opacity-75 border border-surface-container/50">
                <span className="font-mono text-xs text-on-surface-variant">18</span>
              </div>
              {/* 19 Oct */}
              <div className="bg-surface-container-lowest p-2 rounded flex flex-col justify-between min-h-[96px] opacity-75 border border-surface-container/50">
                <span className="font-mono text-xs text-on-surface-variant">19</span>
              </div>

              {/* 20 Oct */}
              <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] hover:bg-surface-container transition-colors border border-surface-container/60">
                <span className="font-mono text-xs font-semibold">20</span>
              </div>
              {/* 21 Oct */}
              <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] hover:bg-surface-container transition-colors border border-surface-container/60">
                <span className="font-mono text-xs font-semibold">21</span>
              </div>

              {/* 22 Oct: Normal Milestone (RFQ-045 Catering) */}
              <div
                className={`bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] cursor-pointer hover:bg-surface-container border border-surface-container transition-all ${
                  isCellHighlighted('catering') ? 'opacity-100' : 'opacity-25'
                }`}
                onClick={() => rfq045 && onSelectRfq(rfq045)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold">22</span>
                </div>
                <div className="bg-surface-container text-on-surface p-1.5 rounded text-[10px] leading-tight font-semibold shadow-xs border border-surface-container mt-1">
                  <span className="text-secondary font-mono font-bold block">RFQ-045</span>
                  <span className="truncate block text-on-surface mt-0.5">Exec Q4 Catering</span>
                  <span className="text-[9px] text-on-surface-variant block mt-0.5">
                    1/4 proposals in
                  </span>
                </div>
              </div>

              {/* 23 Oct */}
              <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] hover:bg-surface-container transition-colors border border-surface-container/60">
                <span className="font-mono text-xs font-semibold">23</span>
              </div>

              {/* 24 Oct: Stage Set & Props Construction (RFQ-046) */}
              <div
                className={`bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] cursor-pointer hover:bg-surface-container border border-surface-container transition-all ${
                  isCellHighlighted('set_props') ? 'opacity-100' : 'opacity-25'
                }`}
                onClick={() => rfq046 && onSelectRfq(rfq046)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold">24</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-700"></span>
                </div>
                <div className="bg-surface-container text-on-surface p-1.5 rounded text-[10px] leading-tight font-semibold shadow-xs border border-surface-container mt-1">
                  <span className="text-secondary font-mono font-bold block">RFQ-046</span>
                  <span className="truncate block text-on-surface mt-0.5">Stage Set &amp; Props</span>
                  <span className="text-[9px] text-on-surface-variant block mt-0.5">
                    2/4 bids in
                  </span>
                </div>
              </div>

              {/* 25 Oct: Vehicle Rental (RFQ-050) */}
              <div 
                className={`bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] cursor-pointer hover:bg-surface-container border border-surface-container transition-all ${
                  isCellHighlighted('vehicle_rental') ? 'opacity-100' : 'opacity-25'
                }`}
                onClick={() => rfq050 && onSelectRfq(rfq050)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold">25</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                </div>
                <div className="bg-surface-container text-on-surface p-1.5 rounded text-[10px] leading-tight font-semibold shadow-xs border border-surface-container mt-1">
                  <span className="text-secondary font-mono font-bold block">RFQ-050</span>
                  <span className="truncate block text-on-surface mt-0.5">VIP MPV Fleet</span>
                  <span className="text-[9px] text-on-surface-variant block mt-0.5">
                    2/3 bids in
                  </span>
                </div>
              </div>
              {/* 26 Oct */}
              <div className="bg-surface-container-lowest p-2 rounded flex flex-col justify-between min-h-[96px] opacity-75 border border-surface-container/50">
                <span className="font-mono text-xs text-on-surface-variant">26</span>
              </div>

              {/* 27 Oct: Merchandise (RFQ-051) */}
              <div 
                className={`bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] cursor-pointer hover:bg-surface-container transition-colors border border-surface-container/60 ${
                  isCellHighlighted('merchandise') ? 'opacity-100' : 'opacity-25'
                }`}
                onClick={() => rfq051 && onSelectRfq(rfq051)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold">27</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-600"></span>
                </div>
                <div className="bg-surface-container text-on-surface p-1.5 rounded text-[10px] leading-tight font-semibold shadow-xs border border-surface-container mt-1">
                  <span className="text-secondary font-mono font-bold block">RFQ-051</span>
                  <span className="truncate block text-on-surface mt-0.5">VIP Merch &amp; Gifts</span>
                  <span className="text-[9px] text-on-surface-variant block mt-0.5">
                    2/3 bids in
                  </span>
                </div>
              </div>

              {/* 28 Oct: IT Security Audit (RFQ-047) */}
              <div
                className={`bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] cursor-pointer hover:bg-surface-container border border-surface-container transition-all ${
                  isCellHighlighted('it') ? 'opacity-100' : 'opacity-25'
                }`}
                onClick={() => rfq047 && onSelectRfq(rfq047)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold">28</span>
                </div>
                <div className="bg-surface-container text-on-surface p-1.5 rounded text-[10px] leading-tight font-semibold shadow-xs border border-surface-container mt-1">
                  <span className="text-secondary font-mono font-bold block">RFQ-047</span>
                  <span className="truncate block text-on-surface mt-0.5">SOC2 Pen Testing</span>
                  <span className="text-[9px] text-on-surface-variant block mt-0.5">
                    0/3 - Just sent
                  </span>
                </div>
              </div>

              {/* 29 Oct */}
              <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] hover:bg-surface-container transition-colors border border-surface-container/60">
                <span className="font-mono text-xs font-semibold">29</span>
              </div>
              {/* 30 Oct */}
              <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] hover:bg-surface-container transition-colors border border-surface-container/60">
                <span className="font-mono text-xs font-semibold">30</span>
              </div>
              {/* 31 Oct */}
              <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between min-h-[96px] hover:bg-surface-container transition-colors border border-surface-container/60">
                <span className="font-mono text-xs font-semibold">31</span>
              </div>

              {/* 1 Nov */}
              <div className="bg-surface-container-lowest p-2 rounded flex flex-col justify-between min-h-[96px] opacity-40 border border-surface-container/50">
                <span className="font-mono text-xs text-on-surface-variant">1</span>
              </div>
              {/* 2 Nov */}
              <div className="bg-surface-container-lowest p-2 rounded flex flex-col justify-between min-h-[96px] opacity-40 border border-surface-container/50">
                <span className="font-mono text-xs text-on-surface-variant">2</span>
              </div>
            </div>

            {/* Legend and Synchronized Timestamp */}
            <div className="mt-4 pt-3 border-t border-surface-container/60 flex flex-wrap items-center justify-between text-on-surface-variant text-xs gap-3">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-error"></span>
                  <span>Overdue Deadline</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-secondary"></span>
                  <span>Urgent (&lt; 48 hours)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-surface-container-highest"></span>
                  <span>Active Scheduled</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-on-tertiary-container font-medium">
                <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                <span>Live Bid Sync: Real-time webhooks active</span>
              </div>
            </div>
          </section>

          {/* Quotation Tracking Stream & Action Panel (4 Cols on XL) */}
          <section className="xl:col-span-4 space-y-4">
            {/* Approaching Cutoffs Card */}
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-surface-container-high space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[22px]">timer</span>
                  <h3 className="text-sm font-bold text-on-surface">Approaching Cutoffs</h3>
                </div>
                <span className="bg-surface-container text-secondary px-2.5 py-0.5 rounded-full font-mono text-xs font-bold">
                  4 Pending
                </span>
              </div>

              <p className="text-xs text-on-surface-variant">
                Proposals submitted after exact deadline timestamps are automatically held in compliance escrow.
              </p>

              {/* List of Cutoffs */}
              <div className="space-y-3">
                {/* Item 1: Overdue (RFQ-038) */}
                <div className="p-3.5 bg-surface-container-low rounded-lg transition-transform hover:-translate-y-0.5 shadow-xs border border-surface-container space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-error font-bold uppercase tracking-wider">
                          Overdue (-4h)
                        </span>
                        <span className="font-mono text-xs text-on-surface-variant">RFQ-038</span>
                      </div>
                      <h4 className="text-xs font-semibold text-on-surface mt-0.5">
                        Fleet Logistics Vans Lease
                      </h4>
                    </div>
                    <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded text-[10px] font-bold">
                      1/3 Quotes
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-1.5 text-on-surface-variant">
                      <span className="material-symbols-outlined text-error text-[16px]">cancel</span>
                      <span className="truncate max-w-[150px]">Missing: Hertz Enterprise Fleet</span>
                    </div>
                    <button
                      className="text-secondary font-semibold hover:underline cursor-pointer flex-shrink-0"
                      onClick={() => rfq038 && onInspectDrawer(rfq038)}
                    >
                      Manage Status &rarr;
                    </button>
                  </div>
                </div>

                {/* Item 2: Cloud Infra (RFQ-042) */}
                <div className="p-3.5 bg-surface-container-low rounded-lg transition-transform hover:-translate-y-0.5 shadow-xs border border-surface-container space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-secondary font-bold uppercase tracking-wider flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                          Due in 6 Hours
                        </span>
                        <span className="font-mono text-xs text-on-surface-variant">RFQ-042</span>
                      </div>
                      <h4 className="text-xs font-semibold text-on-surface mt-0.5">
                        Cloud Infra AWS vs GCP Core
                      </h4>
                    </div>
                    <span className="bg-surface-container-high text-on-surface px-2 py-0.5 rounded text-[10px] font-bold">
                      2/3 Quotes
                    </span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-1.5">
                    <div className="bg-secondary h-1.5 rounded-full" style={{ width: '66%' }}></div>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-on-surface-variant truncate max-w-[150px]">
                      Awaiting: Rackspace Dedicated
                    </span>
                    <button
                      className="text-secondary font-semibold hover:underline cursor-pointer flex-shrink-0"
                      onClick={() => rfq042 && onInspectDrawer(rfq042)}
                    >
                      Review &rarr;
                    </button>
                  </div>
                </div>

                {/* Item 3: HVAC Facility (RFQ-044) */}
                <div className="p-3.5 bg-surface-container-low rounded-lg transition-transform hover:-translate-y-0.5 shadow-xs border border-surface-container space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
                          Due in 28 Hours
                        </span>
                        <span className="font-mono text-xs text-on-surface-variant">RFQ-044</span>
                      </div>
                      <h4 className="text-xs font-semibold text-on-surface mt-0.5">
                        HQ Facility HVAC Filtration
                      </h4>
                    </div>
                    <span className="bg-surface-container-high text-on-surface px-2 py-0.5 rounded text-[10px] font-bold">
                      3/4 Quotes
                    </span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-1.5">
                    <div className="bg-on-tertiary-container h-1.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-on-surface-variant">Ready for bid variance check</span>
                    <button
                      className="text-secondary font-semibold hover:underline cursor-pointer"
                      onClick={() => rfq044 && onInspectDrawer(rfq044)}
                    >
                      Review &rarr;
                    </button>
                  </div>
                </div>

                {/* Item 4: Catering (RFQ-045) */}
                <div className="p-3.5 bg-surface-container-low rounded-lg transition-transform hover:-translate-y-0.5 shadow-xs border border-surface-container space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-on-surface-variant uppercase tracking-wider">
                          Due in 8 Days
                        </span>
                        <span className="font-mono text-xs text-on-surface-variant">RFQ-045</span>
                      </div>
                      <h4 className="text-xs font-semibold text-on-surface mt-0.5">
                        Exec Q4 Summit Catering
                      </h4>
                    </div>
                    <span className="bg-surface-container-high text-on-surface px-2 py-0.5 rounded text-[10px] font-bold">
                      1/4 Quotes
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-on-surface-variant">Invited: 4 local vendors</span>
                    <button
                      className="text-secondary font-semibold hover:underline cursor-pointer"
                      onClick={() => rfq045 && onInspectDrawer(rfq045)}
                    >
                      View Spec &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Solo Procurement Helper / Direct Automation Box */}
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-surface-container-high space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  smart_toy
                </span>
                <h4 className="text-sm font-semibold text-on-surface">Vendor Deadline Chaser</h4>
              </div>
              <p className="text-xs text-on-surface-variant">
                Automated ping reminders are scheduled 24 hours prior to deadline cutoff for all unanswered RFQ invitations.
              </p>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <input
                    checked={autoPingEnabled}
                    onChange={(e) => {
                      setAutoPingEnabled(e.target.checked);
                      onShowToast(
                        e.target.checked
                          ? 'Vendor automated ping reminders activated.'
                          : 'Vendor automated reminders paused.'
                      );
                    }}
                    className="w-4 h-4 accent-secondary cursor-pointer"
                    id="auto-remind"
                    type="checkbox"
                  />
                  <label className="text-xs text-on-surface cursor-pointer select-none font-medium" htmlFor="auto-remind">
                    Auto-SMS/Email 12h cutoff alert
                  </label>
                </div>
                <span className="font-mono text-xs text-on-tertiary-container font-semibold">
                  {autoPingEnabled ? 'Active' : 'Paused'}
                </span>
              </div>
            </div>

            {/* Visual Mini Benchmark Card */}
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-surface-container-high space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  RFQ Delivery Distribution
                </span>
                <span className="font-mono text-xs text-secondary font-bold">
                  96.4% Compliance
                </span>
              </div>

              {/* Inline Visual Metric Representation */}
              <div className="space-y-2.5 pt-1">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded bg-on-tertiary-container"></span>
                      <span>On-Time Response</span>
                    </span>
                    <span className="font-mono font-semibold">82%</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                    <div className="bg-on-tertiary-container h-1.5 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded bg-secondary"></span>
                      <span>Negotiation Escrow</span>
                    </span>
                    <span className="font-mono font-semibold">14%</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                    <div className="bg-secondary h-1.5 rounded-full" style={{ width: '14%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded bg-error"></span>
                      <span>Overdue / Delinquent</span>
                    </span>
                    <span className="font-mono font-semibold">4%</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                    <div className="bg-error h-1.5 rounded-full" style={{ width: '4%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
