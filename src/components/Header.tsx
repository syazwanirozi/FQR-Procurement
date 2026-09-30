import React, { useState } from 'react';
import { RFQItem } from '../types';
import profileAvatarImg from '../assets/images/hijab_blazer_executive_1790732046708.jpg';

interface HeaderProps {
  activeTab: 'dashboard-and-calendar' | 'active-rfqs-and-quotes' | 'supplier-directory';
  setActiveTab: (tab: 'dashboard-and-calendar' | 'active-rfqs-and-quotes' | 'supplier-directory') => void;
  onOpenNewRfq: () => void;
  onInspectUrgent: (rfqId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  urgentRfqs: RFQItem[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewRfq,
  onInspectUrgent,
  searchQuery,
  setSearchQuery,
  urgentRfqs,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high">
      <div className="h-16 w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand & Search & Navigation */}
        <div className="flex items-center gap-6 xl:gap-8 flex-shrink-0">
          {/* Logo Lockup */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => setActiveTab('dashboard-and-calendar')}
          >
            <img
              alt="ProcureSource Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XjWb5UBhqYhKTY1me8jz5HEX2ePoarfNiyPvLAur6r7dh-BatG-0t67tcxf-icIweqMDkKgYTDEyOQmjFbdCcd-oo4zEZlIXNFOVCwb2TUvwhoL-YnwLK3YDJ-FJAvJD1WBXkpfjkmCS-BLK6bipJBU29DLeKmBV-lG1GbPlqKM-mO6OkkG80s37cJljHTGYIjOPPzvjWXH_z9rUlAzTsyqKiR85G2Gv9_pjghZdMUZ4ADwF_QtgW5NmI"
              onError={(e) => {
                // High-polish SVG fallback if blocked
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-base font-bold text-on-surface tracking-tight leading-none">
                Media Prima Berhad
              </span>
              <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mt-0.5">
                Procurement Unit
              </span>
            </div>
          </div>

          {/* Quick Search Input */}
          <div className="relative hidden xl:block w-72">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              className="w-full h-9 pl-9 pr-3 bg-surface-container-low text-xs text-on-surface rounded-lg placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary transition-all"
              placeholder="Search RFQ, SKU, or Supplier..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>

          {/* Main Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-surface-container-low rounded-lg">
            <button
              onClick={() => setActiveTab('dashboard-and-calendar')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'dashboard-and-calendar'
                  ? 'bg-surface-container-high text-on-surface shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              Dashboard &amp; Calendar
            </button>
            <button
              onClick={() => setActiveTab('active-rfqs-and-quotes')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'active-rfqs-and-quotes'
                  ? 'bg-surface-container-high text-on-surface shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              Active RFQs &amp; Quotes
            </button>
            <button
              onClick={() => setActiveTab('supplier-directory')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'supplier-directory'
                  ? 'bg-surface-container-high text-on-surface shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              Supplier Directory
            </button>
          </nav>
        </div>

        {/* Right Side Actions & Profile */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* New RFQ Button */}
          <button
            onClick={onOpenNewRfq}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 bg-primary text-on-primary text-xs font-semibold rounded-lg shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New RFQ</span>
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              aria-label="Urgent Deadlines"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors relative"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-error text-[10px] font-bold text-on-error animate-pulse">
                {urgentRfqs.length}
              </span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container-high p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setShowNotifications(false)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-surface-container mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-error flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                    Urgent Quotation Cutoffs
                  </span>
                  <span className="text-[11px] text-on-surface-variant font-mono">2 Critical</span>
                </div>
                <div className="space-y-2">
                  {urgentRfqs.map((rfq) => (
                    <div 
                      key={rfq.id}
                      onClick={() => {
                        onInspectUrgent(rfq.id);
                        setShowNotifications(false);
                      }}
                      className="p-2.5 bg-surface-container-low hover:bg-surface-container rounded-lg cursor-pointer transition-colors text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-secondary">{rfq.refNumber}</span>
                        <span className="text-[10px] font-bold text-error bg-error-container px-1.5 py-0.5 rounded">
                          {rfq.timeRemaining}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-on-surface mt-1 line-clamp-1">
                        {rfq.title}
                      </div>
                      <div className="text-[10px] text-on-surface-variant mt-0.5">
                        {rfq.bidsReceivedCount}/{rfq.bidsExpectedCount} bids received • Click to inspect
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-outline-variant hidden sm:block"></div>

          {/* User Profile */}
          <div className="relative">
            <div 
              className="flex items-center gap-2 pl-1 cursor-pointer select-none"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-xs font-bold text-on-surface leading-tight">
                  Syazwani Che Rozi
                </span>
                <span className="text-[11px] font-medium text-secondary leading-tight">
                  Procurement Executive
                </span>
              </div>
              <img
                alt="Profile Syazwani"
                className="w-8 h-8 rounded-full object-cover border border-surface-container ring-1 ring-secondary/20 shadow-xs"
                src={profileAvatarImg}
              />
            </div>

            {showProfileMenu && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container-high p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <div className="p-2 border-b border-surface-container mb-2 flex items-center gap-2.5">
                  <img
                    alt="Syazwani Profile"
                    className="w-9 h-9 rounded-full object-cover border border-surface-container ring-1 ring-secondary/20"
                    src={profileAvatarImg}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-on-surface truncate">Syazwani Che Rozi</div>
                    <div className="text-[10px] text-on-surface-variant font-mono truncate">syazwani.rozi@mediaprima.com.my</div>
                    <div className="text-[10px] text-secondary font-semibold">Tier 1 Enterprise Authority</div>
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="px-2 py-1.5 rounded hover:bg-surface-container-low text-on-surface cursor-pointer flex items-center justify-between">
                    <span>Audit Trail Log</span>
                    <span className="text-[10px] font-mono text-on-tertiary-container">Compliant</span>
                  </div>
                  <div className="px-2 py-1.5 rounded hover:bg-surface-container-low text-on-surface cursor-pointer flex items-center justify-between">
                    <span>Delegated Signing Limit</span>
                    <span className="text-[10px] font-mono font-bold">$250,000</span>
                  </div>
                  <div className="px-2 py-1.5 rounded hover:bg-surface-container-low text-on-surface cursor-pointer flex items-center justify-between">
                    <span>Active Vendor Directory</span>
                    <span className="text-[10px] font-mono">28 Entities</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
