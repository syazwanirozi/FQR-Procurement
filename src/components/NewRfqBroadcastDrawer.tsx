import React, { useState } from 'react';
import { RFQItem, ProcurementCategory, Supplier, BQItem } from '../types';

interface NewRfqBroadcastDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcast: (newRfq: RFQItem) => void;
  suppliers: Supplier[];
  onShowToast: (message: string, icon?: string) => void;
}

export const NewRfqBroadcastDrawer: React.FC<NewRfqBroadcastDrawerProps> = ({
  isOpen,
  onClose,
  onBroadcast,
  suppliers,
  onShowToast,
}) => {
  const [projectId, setProjectId] = useState('RFQ-2025-049');
  const [projectTitle, setProjectTitle] = useState('Production services for Anugerah Melodi Terhangat');
  const [category, setCategory] = useState<string>('production');
  const [scope, setScope] = useState(
    'Comprehensive broadcast multi-camera OB truck setup, digital stage audio reinforcement, 4K broadcast switching, motorized robotic camera heads, intercom comms network, and technical director production crew for Anugerah Melodi Terhangat live broadcast event at Dewan Filharmonik Petronas / Sri Pentas.'
  );
  const [deadline, setDeadline] = useState('2025-10-30');
  const [budgetMin, setBudgetMin] = useState('120000');
  const [budgetMax, setBudgetMax] = useState('185000');
  const [attachmentName, setAttachmentName] = useState('RFQ_Spec_Sheet_Production_MelodiTerhangat.pdf');
  const [attachmentSize, setAttachmentSize] = useState('3.8 MB • Upload complete');
  const [hasAttachment, setHasAttachment] = useState(true);

  // Bill of Quantities (BQ) state - Production Services for Live Event Broadcast
  const [bqItems, setBqItems] = useState<BQItem[]>([
    {
      id: 'bq-1',
      itemNo: '1.0',
      description: 'Multi-Camera HD/4K Production OB Van Setup (8x Studio Cameras with SMPTE Fiber & Heavy-Duty Pedestals)',
      quantity: 1,
      unit: 'Package',
      estimatedRate: 58000,
      totalEstimated: 58000,
    },
    {
      id: 'bq-2',
      itemNo: '2.0',
      description: 'Concert Grade Digital Audio Consoles, Line Array PA Sound Reinforcement & Wireless IEM Microphone Systems',
      quantity: 1,
      unit: 'Lump Sum',
      estimatedRate: 42000,
      totalEstimated: 42000,
    },
    {
      id: 'bq-3',
      itemNo: '3.0',
      description: 'Motorized Camera Jib Crane (12-meter reach) & 3-Axis Stabilized Steadicam Operator with Wireless Video Link',
      quantity: 2,
      unit: 'Sets',
      estimatedRate: 14000,
      totalEstimated: 28000,
    },
    {
      id: 'bq-4',
      itemNo: '4.0',
      description: 'Multi-Channel Matrix Intercom Comms Network (Riedel Bolero Wireless Beltpacks for Director, Floor Managers & Audio)',
      quantity: 24,
      unit: 'Units',
      estimatedRate: 650,
      totalEstimated: 15600,
    },
    {
      id: 'bq-5',
      itemNo: '5.0',
      description: 'Technical Broadcast Engineering Crew (Vision Mixer, Sound Engineers, Camera Operators & Cable Handlers for Full Rehearsals & Live Broadcast)',
      quantity: 1,
      unit: 'Lump Sum',
      estimatedRate: 35000,
      totalEstimated: 35000,
    },
  ]);

  if (!isOpen) return null;

  // Filter suppliers in this category
  const matchingSuppliers = suppliers
    .filter((s) => s.category === category)
    .slice(0, 3);

  const getFallbackVendors = (cat: string) => {
    switch (cat) {
      case 'catering':
        return ['Chill Out Oriental Cafe', 'Casa Dyla Sdn Bhd', 'Embun Catering'];
      case 'production':
        return ['Media Prima Production House', 'Astro Digital Stage & Audio', 'Encore Broadcast Solutions'];
      case 'merchandise':
        return ['MerchAsia Global', 'BrandCraft Apparel & Gifts', 'Apex Promo Merchandising'];
      case 'genset':
        return ['MegaPower Heavy Genset Rental', 'SilentGen Malaysia Services', 'PrimeVolts Energy Rentals'];
      case 'vehicle_rental':
        return ['TransContinental Fleet Lease', 'Hertz Enterprise Fleet', 'Sime Darby Mobility Rentals'];
      case 'special_effects':
        return ['Pyrotech FX Studios', 'Illusion Dynamic Special Effects', 'StageAtmosphere FX Malaysia'];
      case 'facilities':
        return ['Kodiak HVAC & Facility Tech', 'Trane Commercial', 'Carrier Global Systems'];
      default:
        return ['Apex Tech Solutions', 'Nova Digital Systems', 'Vertex Micro'];
    }
  };

  const supplierNames = matchingSuppliers.length > 0 
    ? matchingSuppliers.map((s) => s.name)
    : getFallbackVendors(category);

  const handleBroadcastSubmit = (asDraft: boolean) => {
    if (!projectTitle.trim()) {
      onShowToast('Please provide a project scope title.');
      return;
    }

    const getCategoryLabel = (cat: string) => {
      switch (cat) {
        case 'catering': return 'Catering Services';
        case 'production': return 'Production Services';
        case 'merchandise': return 'Merchandise';
        case 'genset': return 'Genset Rental Services';
        case 'vehicle_rental': return 'Vehicle Rental Services';
        case 'special_effects': return 'Special Effect Services';
        case 'it': return 'IT Hardware & Workstations';
        case 'facilities': return 'Office Facilities & HVAC';
        case 'logistics': return 'Logistics & Fleet';
        case 'legal': return 'Professional Legal / Consulting';
        default: return 'General Procurement';
      }
    };

    const newRfq: RFQItem = {
      id: `rfq-${Date.now()}`,
      refNumber: projectId.trim() || `RFQ-2025-0${Math.floor(50 + Math.random() * 40)}`,
      title: projectTitle.trim(),
      category: category as ProcurementCategory,
      categoryLabel: getCategoryLabel(category),
      status: asDraft ? 'draft' : 'active',
      deadlineDate: deadline,
      deadlineDisplay: 'Due in 4 days',
      timeRemaining: asDraft ? 'Draft Mode' : 'Due in 4 days',
      urgencyHours: 96,
      budgetCeiling: parseFloat(budgetMax) || 145000,
      budgetMin: parseFloat(budgetMin) || 80000,
      budgetMax: parseFloat(budgetMax) || 145000,
      bidsReceivedCount: 0,
      bidsExpectedCount: supplierNames.length,
      specification: scope,
      bqItems: bqItems,
      attachments: hasAttachment && attachmentName ? [attachmentName] : [],
      invitedSuppliers: supplierNames,
      bids: [],
    };

    onBroadcast(newRfq);
    onShowToast(
      asDraft
        ? `Draft specifications for ${projectId} saved.`
        : `Broadcast dispatched for ${projectId} to ${supplierNames.length} verified category suppliers!`,
      asDraft ? 'save' : 'send'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-primary/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <aside className="w-screen max-w-2xl bg-surface-container-lowest shadow-2xl flex flex-col border-l border-surface-container-high animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 bg-primary-container text-on-primary-container flex items-start justify-between border-b border-surface-container-high/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-secondary px-2 py-0.5 rounded font-mono text-[11px] font-bold text-on-secondary uppercase">
                  NEW RFQ SPEC
                </span>
                <span className="font-mono text-xs text-on-primary-container/80">
                  Ref: {projectId}
                </span>
              </div>
              <h2 className="text-xl font-bold text-on-primary mt-1.5 leading-snug">
                RFQ Creator
              </h2>
              <p className="text-xs text-on-primary-container/80 mt-1">
                Specify requirements and instantly broadcast to pre-qualified category vendors.
              </p>
            </div>
            <button
              className="w-8 h-8 rounded-lg bg-white/10 text-on-primary hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              onClick={onClose}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Automation Callout Box */}
            <div className="p-3.5 bg-surface-container-low rounded-xl border border-secondary/20 flex items-start gap-3">
              <span className="p-2 bg-secondary/10 rounded-lg text-secondary flex-shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </span>
              <div>
                <h4 className="text-xs font-bold text-on-surface">Category Broadcast Automation</h4>
                <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                  Category Broadcast will automatically generate pending quotation tracking records and simulate secure email solicitation dispatches with encrypted submission links to all matching vendors.
                </p>
              </div>
            </div>

            {/* Project ID & Title Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-4">
                <label className="block text-[11px] font-bold text-on-surface uppercase tracking-wider mb-1">
                  Project ID
                </label>
                <input
                  className="w-full h-10 px-3 bg-surface-container-low font-mono text-xs text-on-surface rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary border border-surface-container"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  type="text"
                />
              </div>
              <div className="md:col-span-8">
                <label className="block text-[11px] font-bold text-on-surface uppercase tracking-wider mb-1">
                  Project Scope Title
                </label>
                <input
                  className="w-full h-10 px-3 bg-surface-container-low text-xs text-on-surface font-semibold rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary border border-surface-container"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Enterprise Laptop & Docking Stations Refresh"
                  type="text"
                />
              </div>
            </div>

            {/* Service / Product Category */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface uppercase tracking-wider mb-1">
                Service / Product Category
              </label>
              <select
                className="w-full h-10 px-3 bg-surface-container-low text-xs text-on-surface rounded-lg focus:outline-none focus:bg-surface-container-lowest cursor-pointer border border-surface-container"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="set_props">Set &amp; Props Services</option>
                <option value="light_sound">Light &amp; Sound Services</option>
                <option value="catering">Catering Services</option>
                <option value="production">Production Services</option>
                <option value="merchandise">Merchandise</option>
                <option value="genset">Genset Rental Services</option>
                <option value="vehicle_rental">Vehicle Rental Services</option>
                <option value="special_effects">Special Effect Services</option>
                <option value="it">IT Hardware &amp; Workstations</option>
                <option value="facilities">Office Facilities &amp; HVAC</option>
                <option value="legal">Professional Legal / Consulting</option>
              </select>
            </div>

            {/* Verified Category Suppliers Match Pill Strip (Exact match to Image 5) */}
            <div className="p-3.5 bg-surface-container-low rounded-xl border border-surface-container space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                  <span className="material-symbols-outlined text-on-tertiary-container text-[18px]">
                    verified
                  </span>
                  <span>{supplierNames.length} Verified Suppliers available in this category</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-secondary">
                  100% SLA Qualified
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {supplierNames.map((name, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-lowest rounded-full text-xs font-medium text-on-surface border border-surface-container shadow-xs"
                  >
                    <span className="w-2 h-2 rounded-full bg-on-tertiary-container"></span>
                    <span>{name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* BQ - Scope Details (Bill of Quantities & Scope Breakdown) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]">receipt_long</span>
                  BQ - Scope Details (Bill of Quantities &amp; Deliverables)
                </label>
                <span className="text-[10px] text-outline">Markdown supported</span>
              </div>
              <textarea
                className="w-full h-24 p-3 bg-surface-container-low text-xs text-on-surface rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary border border-surface-container leading-relaxed"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="Overall scope summary and deliverables description..."
              />

              {/* BQ Line Items Table */}
              <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface">Bill of Quantities (BQ) Production Services Breakdown</span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold">
                      {bqItems.length} Line Items
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newId = `bq-${Date.now()}`;
                      const nextNo = `${bqItems.length + 1}.0`;
                      setBqItems([
                        ...bqItems,
                        {
                          id: newId,
                          itemNo: nextNo,
                          description: 'Additional Wireless RF Camera & Teleprompter Unit',
                          quantity: 1,
                          unit: 'Set',
                          estimatedRate: 7500,
                          totalEstimated: 7500,
                        },
                      ]);
                    }}
                    className="text-xs font-bold text-secondary flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                    Add Production Item
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-surface-container-high bg-surface-container-lowest">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-container text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">
                      <tr>
                        <th className="py-2 px-2.5 w-12 text-center">No.</th>
                        <th className="py-2 px-2.5">Item Scope Description</th>
                        <th className="py-2 px-2 w-20 text-center">Qty</th>
                        <th className="py-2 px-2 w-24">Unit</th>
                        <th className="py-2 px-2.5 w-28 text-right">Est. Rate (MYR)</th>
                        <th className="py-2 px-2.5 w-28 text-right">Total (MYR)</th>
                        <th className="py-2 px-1 w-8 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      {bqItems.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-surface-container-low/50 group">
                          <td className="py-2 px-2.5 text-center font-mono text-[11px] text-on-surface-variant">
                            {item.itemNo}
                          </td>
                          <td className="py-2 px-2.5">
                            <input
                              className="w-full bg-transparent text-xs text-on-surface focus:outline-none focus:bg-surface-container-low px-1.5 py-1 rounded"
                              value={item.description}
                              onChange={(e) => {
                                const newDesc = e.target.value;
                                setBqItems((prev) =>
                                  prev.map((b) => (b.id === item.id ? { ...b, description: newDesc } : b))
                                );
                              }}
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              className="w-16 bg-surface-container-low text-center font-mono text-xs text-on-surface rounded py-1 px-1 focus:outline-none focus:ring-1 focus:ring-secondary border border-surface-container"
                              value={item.quantity}
                              onChange={(e) => {
                                const q = parseFloat(e.target.value) || 0;
                                setBqItems((prev) =>
                                  prev.map((b) =>
                                    b.id === item.id
                                      ? {
                                          ...b,
                                          quantity: q,
                                          totalEstimated: q * (b.estimatedRate || 0),
                                        }
                                      : b
                                  )
                                );
                              }}
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              className="w-20 bg-surface-container-low text-xs text-on-surface rounded py-1 px-1.5 focus:outline-none border border-surface-container"
                              value={item.unit}
                              onChange={(e) => {
                                const u = e.target.value;
                                setBqItems((prev) =>
                                  prev.map((b) => (b.id === item.id ? { ...b, unit: u } : b))
                                );
                              }}
                            />
                          </td>
                          <td className="py-2 px-2.5 text-right">
                            <input
                              type="number"
                              className="w-24 text-right bg-surface-container-low font-mono text-xs text-on-surface rounded py-1 px-1.5 focus:outline-none focus:ring-1 focus:ring-secondary border border-surface-container"
                              value={item.estimatedRate || 0}
                              onChange={(e) => {
                                const rate = parseFloat(e.target.value) || 0;
                                setBqItems((prev) =>
                                  prev.map((b) =>
                                    b.id === item.id
                                      ? {
                                          ...b,
                                          estimatedRate: rate,
                                          totalEstimated: b.quantity * rate,
                                        }
                                      : b
                                  )
                                );
                              }}
                            />
                          </td>
                          <td className="py-2 px-2.5 text-right font-mono font-bold text-on-surface">
                            {(item.totalEstimated || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2 px-1 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setBqItems((prev) => prev.filter((b) => b.id !== item.id));
                              }}
                              className="opacity-40 group-hover:opacity-100 text-error hover:text-error/80 cursor-pointer"
                              title="Delete BQ line item"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-surface-container/60 border-t border-surface-container-high font-bold">
                      <tr>
                        <td colSpan={5} className="py-2 px-3 text-right text-[11px] uppercase tracking-wider text-on-surface-variant">
                          Total Estimated BQ (MYR)
                        </td>
                        <td className="py-2 px-2.5 text-right font-mono text-xs text-secondary">
                          RM{' '}
                          {bqItems
                            .reduce((acc, curr) => acc + (curr.totalEstimated || 0), 0)
                            .toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Submission Deadline & Target Resolution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-on-surface uppercase tracking-wider mb-1">
                  Submission Deadline
                </label>
                <input
                  className="w-full h-10 px-3 bg-surface-container-low text-xs font-mono text-on-surface rounded-lg focus:outline-none border border-surface-container cursor-pointer"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface uppercase tracking-wider mb-1">
                  Target Resolution
                </label>
                <div className="w-full h-10 px-3 bg-surface-container text-secondary font-mono text-xs font-bold rounded-lg flex items-center justify-between border border-secondary/20">
                  <span>Due in 4 days</span>
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                </div>
              </div>
            </div>

            {/* Range Budget */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-on-surface uppercase tracking-wider">
                  Range Budget (MYR)
                </label>
                <span className="font-mono text-[11px] text-secondary font-semibold">
                  RM {parseInt(budgetMin || '0', 10).toLocaleString()} – RM {parseInt(budgetMax || '0', 10).toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">
                    arrow_downward
                  </span>
                  <input
                    className="w-full h-10 pl-8 pr-3 bg-surface-container-low font-mono text-xs text-on-surface rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary border border-surface-container"
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    placeholder="Min Budget (e.g. 80000)"
                  />
                  <span className="text-[10px] text-outline absolute right-2.5 top-1/2 -translate-y-1/2 font-semibold">
                    MIN
                  </span>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">
                    arrow_upward
                  </span>
                  <input
                    className="w-full h-10 pl-8 pr-3 bg-surface-container-low font-mono text-xs text-on-surface rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary border border-surface-container"
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    placeholder="Max Budget (e.g. 145000)"
                  />
                  <span className="text-[10px] text-outline absolute right-2.5 top-1/2 -translate-y-1/2 font-semibold">
                    MAX
                  </span>
                </div>
              </div>
            </div>

            {/* Attachment Box (Image 5) */}
            {hasAttachment ? (
              <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-surface-container-high rounded-lg text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">attach_file</span>
                  </span>
                  <div>
                    <div className="text-xs font-bold text-on-surface font-mono">
                      {attachmentName}
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      {attachmentSize}
                    </div>
                  </div>
                </div>
                <button
                  className="text-xs text-error font-semibold hover:underline cursor-pointer"
                  onClick={() => setHasAttachment(false)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                className="w-full py-3 border-2 border-dashed border-surface-container-high rounded-xl text-xs text-secondary font-semibold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                onClick={() => {
                  setAttachmentName('Technical_RFP_Specification_Doc.pdf');
                  setAttachmentSize('1.8 MB • Upload complete');
                  setHasAttachment(true);
                  onShowToast('Uploaded specification document attachment.');
                }}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">upload</span>
                <span>Attach RFQ Specification Document</span>
              </button>
            )}
          </div>

          {/* Footer Action Bar (Image 5) */}
          <div className="p-4 bg-surface-container-low border-t border-surface-container flex items-center justify-between gap-3">
            <button
              className="h-10 px-4 bg-surface-container-lowest text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container border border-surface-container transition-colors cursor-pointer"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2.5">
              <button
                className="h-10 px-4 bg-surface-container-lowest text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container-high border border-surface-container transition-colors cursor-pointer"
                onClick={() => handleBroadcastSubmit(true)}
                type="button"
              >
                Save as Draft
              </button>

              <button
                className="h-10 px-5 bg-secondary text-on-secondary text-xs font-bold rounded-lg shadow-sm hover:bg-secondary-container transition-all flex items-center gap-1.5 cursor-pointer"
                onClick={() => handleBroadcastSubmit(false)}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Broadcast RFQ to Category ({supplierNames.length} Suppliers)</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
