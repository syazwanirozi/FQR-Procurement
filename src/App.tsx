import React, { useState } from 'react';
import { RFQItem, Supplier, CategoryInfo } from './types';
import { INITIAL_RFQS, INITIAL_SUPPLIERS, INITIAL_CATEGORIES } from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DashboardView } from './components/DashboardView';
import { ActiveRfqsView } from './components/ActiveRfqsView';
import { SupplierDirectoryView } from './components/SupplierDirectoryView';
import { CalendarPopover } from './components/CalendarPopover';
import { RfqInspectionDrawer } from './components/RfqInspectionDrawer';
import { NewRfqBroadcastDrawer } from './components/NewRfqBroadcastDrawer';
import { AddSupplierDrawer } from './components/AddSupplierDrawer';
import { ManageCategoriesModal } from './components/ManageCategoriesModal';
import { ImportCsvModal } from './components/ImportCsvModal';
import { Toast, ToastMessage } from './components/Toast';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard-and-calendar' | 'active-rfqs-and-quotes' | 'supplier-directory'>('dashboard-and-calendar');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Core Data State
  const [rfqs, setRfqs] = useState<RFQItem[]>(INITIAL_RFQS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [categories, setCategories] = useState<CategoryInfo[]>(INITIAL_CATEGORIES);

  // Modals & Drawers State
  const [popoverRfq, setPopoverRfq] = useState<RFQItem | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [inspectionRfq, setInspectionRfq] = useState<RFQItem | null>(null);
  const [isInspectionDrawerOpen, setIsInspectionDrawerOpen] = useState(false);

  const [isNewRfqDrawerOpen, setIsNewRfqDrawerOpen] = useState(false);

  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const [isImportCsvOpen, setIsImportCsvOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, icon?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handlers for RFQ inspection and actions
  const handleOpenCalendarPopover = (rfq: RFQItem) => {
    setPopoverRfq(rfq);
    setIsPopoverOpen(true);
  };

  const handleOpenInspectionDrawer = (rfq: RFQItem) => {
    setInspectionRfq(rfq);
    setIsInspectionDrawerOpen(true);
  };

  const handleDraftAward = (rfq: RFQItem, vendorName: string) => {
    showToast(`Award recommendation drafted for ${vendorName} (${rfq.refNumber})! Sent to executive approval queue.`, 'check_circle');
    setIsInspectionDrawerOpen(false);
  };

  const handleExtendCutoff = (rfq: RFQItem, hours: number) => {
    setRfqs((prev) =>
      prev.map((r) =>
        r.id === rfq.id
          ? {
              ...r,
              timeRemaining: `${hours}h added`,
              deadlineDisplay: `Extended by +${hours}h (Dispatched)`,
              status: 'active',
            }
          : r
      )
    );
    showToast(`Cutoff extended by ${hours} hours for ${rfq.refNumber}. Automated broadcast update dispatched.`, 'update');
    setIsInspectionDrawerOpen(false);
  };

  const handleSendNudge = (vendorName: string) => {
    showToast(`Sent 1-click urgent cutoff reminder to ${vendorName} account executive.`, 'send');
  };

  // Handlers for New RFQ Broadcast
  const handleBroadcastRfq = (newRfq: RFQItem) => {
    setRfqs((prev) => [newRfq, ...prev]);
  };

  // Handlers for Suppliers
  const handleSaveSupplier = (supplierData: Partial<Supplier>, addAnother: boolean) => {
    if (editingSupplier) {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === editingSupplier.id ? ({ ...s, ...supplierData } as Supplier) : s))
      );
      showToast(`Supplier record for "${supplierData.name}" updated successfully.`);
      setEditingSupplier(null);
      if (!addAnother) setIsAddSupplierOpen(false);
    } else {
      setSuppliers((prev) => [supplierData as Supplier, ...prev]);
      showToast(`Supplier "${supplierData.name}" added to directory.`);
      if (!addAnother) setIsAddSupplierOpen(false);
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsAddSupplierOpen(true);
  };

  const handleDeleteSupplier = (id: string, name: string) => {
    if (window.confirm(`Remove "${name}" from the supplier directory? All category links will be unmapped.`)) {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      showToast(`Supplier "${name}" removed from directory.`, 'delete');
    }
  };

  const handleSendDirectRfq = (supplier: Supplier) => {
    showToast(`Direct quote solicitation dispatched to ${supplier.contactEmail} (${supplier.name})`, 'send');
  };

  // Category Handlers
  const handleAddCategory = (name: string) => {
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '_') as any;
    setCategories((prev) => [
      ...prev,
      {
        id,
        name,
        count: 0,
        color: 'text-secondary',
        dotColor: 'bg-secondary',
      },
    ]);
    showToast(`Category "${name}" created.`);
  };

  const handleEditCategory = (id: any, newName: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: newName } : c))
    );
    showToast(`Category updated to "${newName}".`);
  };

  const handleImportSuppliers = (newSuppliers: Supplier[]) => {
    setSuppliers((prev) => [...newSuppliers, ...prev]);
  };

  // Export ICS calendar file
  const handleExportIcs = () => {
    let eventsStr = '';
    rfqs.forEach((rfq) => {
      const cleanDate = rfq.deadlineDate.replace(/-/g, '');
      eventsStr += `BEGIN:VEVENT
UID:${rfq.id}@procuresource.com
DTSTAMP:20251014T120000Z
DTSTART;VALUE=DATE:${cleanDate}
SUMMARY:${rfq.refNumber} - ${rfq.title}
DESCRIPTION:${rfq.specification.replace(/\n/g, ' ')} | Budget: $${rfq.budgetCeiling}
STATUS:CONFIRMED
END:VEVENT\n`;
    });

    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ProcureSource//RFQ Precision System//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nX-WR-CALNAME:ProcureSource RFQ Deadlines\n${eventsStr}END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'procure-source-deadlines-oct-2025.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded procure-source-deadlines-oct-2025.ics calendar file!', 'event_available');
  };

  const urgentRfqs = rfqs.filter((r) => r.status === 'urgent');

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-on-surface flex flex-col font-sans">
      {/* Fixed Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewRfq={() => setIsNewRfqDrawerOpen(true)}
        onInspectUrgent={(rfqId) => {
          const target = rfqs.find((r) => r.id === rfqId);
          if (target) handleOpenInspectionDrawer(target);
        }}
        searchQuery={globalSearchQuery}
        setSearchQuery={setGlobalSearchQuery}
        urgentRfqs={urgentRfqs}
      />

      {/* Main Content Area */}
      <main className="w-full pt-16 flex-1 flex flex-col">
        {activeTab === 'dashboard-and-calendar' && (
          <DashboardView
            rfqs={rfqs}
            onOpenNewRfq={() => setIsNewRfqDrawerOpen(true)}
            onOpenAddSupplier={() => {
              setEditingSupplier(null);
              setIsAddSupplierOpen(true);
            }}
            onSelectRfq={handleOpenCalendarPopover}
            onInspectDrawer={handleOpenInspectionDrawer}
            onExportIcs={handleExportIcs}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'active-rfqs-and-quotes' && (
          <ActiveRfqsView
            rfqs={rfqs}
            onOpenNewRfq={() => setIsNewRfqDrawerOpen(true)}
            onInspectDrawer={handleOpenInspectionDrawer}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'supplier-directory' && (
          <SupplierDirectoryView
            suppliers={suppliers}
            categories={categories}
            onOpenAddSupplier={() => {
              setEditingSupplier(null);
              setIsAddSupplierOpen(true);
            }}
            onEditSupplier={handleEditSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            onOpenManageCategories={() => setIsManageCategoriesOpen(true)}
            onOpenImportCsv={() => setIsImportCsvOpen(true)}
            onSendDirectRfq={handleSendDirectRfq}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Sticky Bottom Status Footer */}
      <Footer />

      {/* Modals and Slide-Over Drawers */}
      <CalendarPopover
        rfq={popoverRfq}
        isOpen={isPopoverOpen}
        onClose={() => setIsPopoverOpen(false)}
        onOpenDrawer={handleOpenInspectionDrawer}
      />

      <RfqInspectionDrawer
        rfq={inspectionRfq}
        isOpen={isInspectionDrawerOpen}
        onClose={() => setIsInspectionDrawerOpen(false)}
        onDraftAward={handleDraftAward}
        onExtendCutoff={handleExtendCutoff}
        onSendNudge={handleSendNudge}
      />

      <NewRfqBroadcastDrawer
        isOpen={isNewRfqDrawerOpen}
        onClose={() => setIsNewRfqDrawerOpen(false)}
        onBroadcast={handleBroadcastRfq}
        suppliers={suppliers}
        onShowToast={showToast}
      />

      <AddSupplierDrawer
        isOpen={isAddSupplierOpen}
        onClose={() => {
          setIsAddSupplierOpen(false);
          setEditingSupplier(null);
        }}
        onSave={handleSaveSupplier}
        editingSupplier={editingSupplier}
      />

      <ManageCategoriesModal
        isOpen={isManageCategoriesOpen}
        onClose={() => setIsManageCategoriesOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
      />

      <ImportCsvModal
        isOpen={isImportCsvOpen}
        onClose={() => setIsImportCsvOpen(false)}
        onImport={handleImportSuppliers}
        onShowToast={showToast}
      />

      {/* Global Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
