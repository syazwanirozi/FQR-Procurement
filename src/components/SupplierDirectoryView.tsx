import React, { useState } from 'react';
import { Supplier, ProcurementCategory, CategoryInfo } from '../types';

interface SupplierDirectoryViewProps {
  suppliers: Supplier[];
  categories: CategoryInfo[];
  onOpenAddSupplier: () => void;
  onEditSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (id: string, name: string) => void;
  onOpenManageCategories: () => void;
  onOpenImportCsv: () => void;
  onSendDirectRfq: (supplier: Supplier) => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const SupplierDirectoryView: React.FC<SupplierDirectoryViewProps> = ({
  suppliers,
  categories,
  onOpenAddSupplier,
  onEditSupplier,
  onDeleteSupplier,
  onOpenManageCategories,
  onOpenImportCsv,
  onSendDirectRfq,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'recent' | 'response' | 'active' | 'name'>('recent');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Filter logic
  const filteredSuppliers = suppliers.filter((sup) => {
    const matchesCategory =
      selectedCategory === 'all' ? true : sup.category === selectedCategory;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      sup.name.toLowerCase().includes(query) ||
      sup.primaryContact.toLowerCase().includes(query) ||
      sup.contactEmail.toLowerCase().includes(query) ||
      sup.phone.toLowerCase().includes(query) ||
      sup.location.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  // Sort logic
  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortOption === 'response') {
      return b.performanceScore - a.performanceScore;
    }
    if (sortOption === 'active') {
      return b.activeRfqs - a.activeRfqs;
    }
    return 0; // recent
  });

  const totalFiltered = sortedSuppliers.length;
  const paginatedSuppliers = sortedSuppliers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Top Section: Header & Quick Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-secondary uppercase tracking-wider font-bold">
                F01 Catalog Engine
              </span>
              <span className="h-1 w-1 rounded-full bg-outline"></span>
              <span className="font-mono text-xs text-on-surface-variant font-medium">
                SYNC_ID #SUP-8891
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-on-surface tracking-tight mt-0.5">
              Supplier Directory
            </h1>
            <p className="text-xs text-on-surface-variant max-w-2xl mt-1 leading-relaxed">
              Organize and manage verified vendor contacts mapped to procurement categories for automated broadcasting and instant quote comparisons.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              className="h-9 px-3.5 bg-surface-container-lowest text-on-surface text-xs font-semibold rounded-lg shadow-xs hover:bg-surface-container-low transition-colors flex items-center gap-1.5 border border-surface-container cursor-pointer"
              onClick={onOpenManageCategories}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
              <span>Manage Categories</span>
            </button>
            <button
              className="h-9 px-3.5 bg-surface-container-lowest text-on-surface text-xs font-semibold rounded-lg shadow-xs hover:bg-surface-container-low transition-colors flex items-center gap-1.5 border border-surface-container cursor-pointer"
              onClick={onOpenImportCsv}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">upload_file</span>
              <span>Import CSV</span>
            </button>
            <button
              className="h-9 px-4 bg-primary text-on-primary text-xs font-semibold rounded-lg shadow-sm hover:bg-primary-container transition-all flex items-center gap-1.5 group cursor-pointer"
              onClick={onOpenAddSupplier}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:rotate-90 transition-transform">
                add
              </span>
              <span>Add New Supplier</span>
            </button>
          </div>
        </div>

        {/* Directory Summary Metrics Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Metric 1 */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container-high flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase text-on-surface-variant tracking-wider font-semibold">
                Total Suppliers
              </span>
              <span className="material-symbols-outlined text-secondary text-[20px]">
                corporate_fare
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-on-surface">
                {suppliers.length}
              </span>
              <span className="font-mono text-xs text-on-tertiary-container bg-surface-container-high px-2 py-0.5 rounded-full font-semibold">
                +4 this month
              </span>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '82%' }}></div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container-high flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase text-on-surface-variant tracking-wider font-semibold">
                Active Categories
              </span>
              <span className="material-symbols-outlined text-secondary text-[20px]">
                category
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-on-surface">6</span>
              <span className="font-mono text-xs text-on-surface-variant">100% Coverage</span>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-on-tertiary-container h-full rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container-high flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase text-on-surface-variant tracking-wider font-semibold">
                Verified Contacts
              </span>
              <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">
                verified
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-on-surface">100%</span>
              <span className="font-mono text-xs text-on-tertiary-container font-semibold">
                25 Certified
              </span>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-on-tertiary-container h-full rounded-full" style={{ width: '96%' }}></div>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container-high flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase text-on-surface-variant tracking-wider font-semibold">
                Pending Verification
              </span>
              <span className="material-symbols-outlined text-error text-[20px]">
                pending_actions
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-error">3</span>
              <span className="font-mono text-xs text-on-surface-variant">Awaiting W-9</span>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-error h-full rounded-full" style={{ width: '15%' }}></div>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs & Search Control Strip */}
        <div className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-surface-container-high flex flex-col gap-3">
          {/* Scrollable Category Tabs Bar */}
          <div className="flex items-center justify-between gap-2 border-b border-surface-container-high pb-2">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
                onClick={() => {
                  setSelectedCategory('all');
                  setCurrentPage(1);
                }}
                type="button"
              >
                <span>All</span>
                <span className={`font-mono text-[11px] px-1.5 py-0.2 rounded-full ${selectedCategory === 'all' ? 'bg-on-primary/20' : 'bg-surface-container'}`}>
                  {suppliers.length}
                </span>
              </button>

              {categories.map((cat) => {
                const count = suppliers.filter((s) => s.category === cat.id).length;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-primary text-on-primary'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                    }`}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentPage(1);
                    }}
                    type="button"
                  >
                    <span>{cat.name}</span>
                    <span className={`font-mono text-[11px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-on-primary/20' : 'bg-surface-container text-on-surface-variant'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search & Filters Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-lg">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                search
              </span>
              <input
                className="w-full h-9 pl-9 pr-8 bg-surface-container-low text-on-surface text-xs rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary placeholder:text-outline border border-surface-container transition-all"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by company name, contact, email or phone..."
                type="text"
              />
              {searchQuery && (
                <button
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
                  onClick={() => setSearchQuery('')}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1 rounded-lg border border-surface-container">
                <span className="text-[11px] font-semibold text-on-surface-variant">Sort:</span>
                <select
                  className="bg-transparent text-on-surface text-xs font-semibold focus:outline-none cursor-pointer"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                >
                  <option value="recent">Recently Added</option>
                  <option value="response">Response Rate (High to Low)</option>
                  <option value="active">Active RFQ Count</option>
                  <option value="name">Alphabetical (A-Z)</option>
                </select>
              </div>

              <div className="flex items-center p-0.5 bg-surface-container-low rounded-lg border border-surface-container">
                <button
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  onClick={() => setViewMode('table')}
                  title="Table View"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                </button>
                <button
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    viewMode === 'cards'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  onClick={() => setViewMode('cards')}
                  title="Cards View"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Suppliers Content Area */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container-high overflow-hidden flex flex-col">
          {totalFiltered === 0 ? (
            /* Empty State / Demo TC-03 Handling */
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-secondary mb-4 border border-surface-container">
                <span className="material-symbols-outlined text-[32px]">folder_off</span>
              </div>
              <h3 className="text-base font-bold text-on-surface">
                No suppliers mapped to this category
              </h3>
              <p className="text-xs text-on-surface-variant max-w-md mt-1 mb-6 leading-relaxed">
                This category has 0 verified vendor profiles. Add verified suppliers now to enable automatic quote broadcasting when launching new RFQs in this domain.
              </p>
              <div className="flex items-center gap-3">
                <button
                  className="h-9 px-4 bg-primary text-on-primary text-xs font-semibold rounded-lg shadow-sm hover:bg-primary-container flex items-center gap-1.5 transition-colors cursor-pointer"
                  onClick={onOpenAddSupplier}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Add Supplier to Category</span>
                </button>
                <button
                  className="h-9 px-3.5 bg-surface-container-low text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container transition-colors cursor-pointer border border-surface-container"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  type="button"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          ) : viewMode === 'table' ? (
            /* High-Density Table View */
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider font-bold h-10 select-none border-b border-surface-container">
                    <th className="px-4 py-2">Company Name</th>
                    <th className="px-4 py-2">Primary Contact</th>
                    <th className="px-4 py-2">Contact Email</th>
                    <th className="px-4 py-2">Phone Number</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2 text-right">Performance &amp; SLA</th>
                    <th className="px-4 py-2 text-center">Active RFQs</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {paginatedSuppliers.map((supplier) => (
                    <tr
                      key={supplier.id}
                      className="hover:bg-surface-container-low/60 transition-colors group"
                    >
                      {/* Company Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center font-bold text-xs tracking-tight shadow-xs border border-surface-container flex-shrink-0">
                            {supplier.initials}
                          </div>
                          <div>
                            <div className="text-xs text-on-surface font-bold flex items-center gap-1.5">
                              <span>{supplier.name}</span>
                              {supplier.isVerified ? (
                                <span
                                  className="material-symbols-outlined text-[15px] text-on-tertiary-container"
                                  title="Fully Verified Vendor"
                                >
                                  verified
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-surface-container-high text-secondary uppercase">
                                  Pending W-9
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-[11px] text-outline">
                              EIN: {supplier.ein} • {supplier.location}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Primary Contact */}
                      <td className="px-4 py-3">
                        <div className="text-xs text-on-surface font-semibold">
                          {supplier.primaryContact}
                        </div>
                        <div className="text-[11px] text-on-surface-variant">
                          {supplier.contactRole}
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3">
                        <a
                          className="font-mono text-xs text-secondary hover:underline flex items-center gap-1 group/link"
                          href={`mailto:${supplier.contactEmail}`}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <span>{supplier.contactEmail}</span>
                          <span className="material-symbols-outlined text-[14px] opacity-0 group-hover/link:opacity-100 transition-opacity">
                            open_in_new
                          </span>
                        </a>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3 font-mono text-xs text-on-surface">
                        {supplier.phone}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-surface-container text-on-surface border border-surface-container-high">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              supplier.category === 'it'
                                ? 'bg-secondary'
                                : supplier.category === 'catering'
                                ? 'bg-on-tertiary-container'
                                : supplier.category === 'facilities'
                                ? 'bg-slate-600'
                                : supplier.category === 'logistics'
                                ? 'bg-secondary'
                                : 'bg-primary'
                            }`}
                          ></span>
                          <span>{supplier.categoryLabel}</span>
                        </span>
                      </td>

                      {/* Performance & SLA */}
                      <td className="px-4 py-3 text-right">
                        {supplier.quotesSubmitted > 0 ? (
                          <>
                            <div className="font-mono text-xs font-bold text-on-tertiary-container">
                              {supplier.performanceScore}% On-time
                            </div>
                            <div className="text-[11px] text-outline">
                              {supplier.quotesSubmitted}/{supplier.totalQuotesInvited || supplier.quotesSubmitted} quotes submitted
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="font-mono text-xs font-semibold text-secondary">
                              New Partner
                            </div>
                            <div className="text-[11px] text-outline">0 quotes submitted</div>
                          </>
                        )}
                      </td>

                      {/* Active RFQs */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono ${
                            supplier.activeRfqs > 0
                              ? 'bg-surface-container-high text-on-surface'
                              : 'bg-surface-container text-outline'
                          }`}
                        >
                          {supplier.activeRfqs} Active
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className="px-2.5 py-1 rounded bg-surface-container text-secondary hover:bg-secondary hover:text-on-secondary text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            onClick={() => onSendDirectRfq(supplier)}
                            title="Direct Broadcast RFQ"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[14px]">send</span>
                            <span>Quote</span>
                          </button>
                          <button
                            className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container cursor-pointer"
                            onClick={() => onEditSupplier(supplier)}
                            title="Edit Contact"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            className="p-1 rounded text-outline hover:text-error hover:bg-error-container cursor-pointer"
                            onClick={() => onDeleteSupplier(supplier.id, supplier.name)}
                            title="Remove Supplier"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Cards View */
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedSuppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="bg-surface-container-low p-4 rounded-xl border border-surface-container hover:border-secondary/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center font-bold text-xs tracking-tight">
                          {supplier.initials}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-on-surface flex items-center gap-1">
                            <span>{supplier.name}</span>
                            {supplier.isVerified && (
                              <span className="material-symbols-outlined text-[14px] text-on-tertiary-container">
                                verified
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[10px] text-outline">
                            {supplier.location}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] font-bold bg-surface-container px-2 py-0.5 rounded-full text-secondary">
                        {supplier.activeRfqs} Active
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-on-surface-variant">
                        <span>Contact:</span>
                        <span className="font-semibold text-on-surface">{supplier.primaryContact}</span>
                      </div>
                      <div className="flex items-center justify-between text-on-surface-variant">
                        <span>Email:</span>
                        <span className="font-mono text-secondary truncate max-w-[160px]">
                          {supplier.contactEmail}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-on-surface-variant">
                        <span>Category:</span>
                        <span className="text-[11px] font-semibold text-on-surface">
                          {supplier.categoryLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-on-tertiary-container">
                      {supplier.performanceScore > 0 ? `${supplier.performanceScore}% On-time` : 'New Vendor'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        className="px-2.5 py-1 bg-primary text-on-primary text-xs font-semibold rounded hover:bg-primary-container transition-colors cursor-pointer"
                        onClick={() => onSendDirectRfq(supplier)}
                      >
                        Quote
                      </button>
                      <button
                        className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container cursor-pointer"
                        onClick={() => onEditSupplier(supplier)}
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button
                        className="p-1 rounded text-outline hover:text-error hover:bg-error-container cursor-pointer"
                        onClick={() => onDeleteSupplier(supplier.id, supplier.name)}
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table Footer / Pagination */}
          <div className="px-4 py-3 bg-surface-container-lowest border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-xs text-on-surface-variant flex items-center gap-1.5">
              <span>Showing</span>
              <span className="font-mono font-bold text-on-surface">
                {paginatedSuppliers.length}
              </span>
              <span>of</span>
              <span className="font-mono font-bold text-on-surface">
                {totalFiltered}
              </span>
              <span>suppliers across 6 categories</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                className="p-1.5 rounded text-outline hover:text-on-surface disabled:opacity-40 transition-colors cursor-pointer"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>

              <button
                className={`px-2 py-0.5 rounded font-mono text-xs font-bold cursor-pointer ${
                  currentPage === 1
                    ? 'bg-surface-container text-on-surface'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
                onClick={() => setCurrentPage(1)}
                type="button"
              >
                1
              </button>
              {totalFiltered > pageSize && (
                <button
                  className={`px-2 py-0.5 rounded font-mono text-xs font-bold cursor-pointer ${
                    currentPage === 2
                      ? 'bg-surface-container text-on-surface'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                  onClick={() => setCurrentPage(2)}
                  type="button"
                >
                  2
                </button>
              )}
              {totalFiltered > pageSize * 2 && (
                <button
                  className={`px-2 py-0.5 rounded font-mono text-xs font-bold cursor-pointer ${
                    currentPage === 3
                      ? 'bg-surface-container text-on-surface'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                  onClick={() => setCurrentPage(3)}
                  type="button"
                >
                  3
                </button>
              )}

              <button
                className="p-1.5 rounded text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer disabled:opacity-40"
                disabled={currentPage * pageSize >= totalFiltered}
                onClick={() => setCurrentPage((p) => p + 1)}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
