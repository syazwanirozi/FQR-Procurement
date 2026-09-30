import React, { useState, useEffect } from 'react';
import { Supplier, ProcurementCategory } from '../types';

interface AddSupplierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplier: Partial<Supplier>, addAnother: boolean) => void;
  editingSupplier: Supplier | null;
}

export const AddSupplierDrawer: React.FC<AddSupplierDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSupplier,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<ProcurementCategory>('it');
  const [isPreVerified, setIsPreVerified] = useState(true);

  // Errors
  const [companyError, setCompanyError] = useState(false);
  const [contactError, setContactError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailValidBadge, setEmailValidBadge] = useState(false);
  const [showBannerError, setShowBannerError] = useState(false);

  useEffect(() => {
    if (editingSupplier) {
      setCompanyName(editingSupplier.name);
      setContactPerson(editingSupplier.primaryContact);
      setContactRole(editingSupplier.contactRole);
      setEmail(editingSupplier.contactEmail);
      setPhone(editingSupplier.phone);
      setCategory(editingSupplier.category);
      setIsPreVerified(editingSupplier.isVerified);
      setEmailValidBadge(true);
    } else {
      setCompanyName('');
      setContactPerson('');
      setContactRole('');
      setEmail('');
      setPhone('');
      setCategory('it');
      setIsPreVerified(true);
      setEmailValidBadge(false);
    }
    setCompanyError(false);
    setContactError(false);
    setEmailError(false);
    setShowBannerError(false);
  }, [editingSupplier, isOpen]);

  const validateEmail = (val: string) => {
    setEmail(val);
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (re.test(val)) {
      setEmailValidBadge(true);
      setEmailError(false);
    } else {
      setEmailValidBadge(false);
    }
  };

  const handleSubmit = (addAnother: boolean) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let hasErr = false;

    if (!companyName.trim()) {
      setCompanyError(true);
      hasErr = true;
    } else {
      setCompanyError(false);
    }

    if (!contactPerson.trim()) {
      setContactError(true);
      hasErr = true;
    } else {
      setContactError(false);
    }

    if (!email.trim() || !re.test(email.trim())) {
      setEmailError(true);
      hasErr = true;
    } else {
      setEmailError(false);
    }

    if (hasErr) {
      setShowBannerError(true);
      return;
    }

    setShowBannerError(false);
    const categoryLabels: Record<ProcurementCategory, string> = {
      set_props: 'Set & Props Services',
      light_sound: 'Light & Sound Services',
      catering: 'Catering Services',
      production: 'Production Services',
      merchandise: 'Merchandise',
      genset: 'Genset Rental Services',
      vehicle_rental: 'Vehicle Rental Services',
      special_effects: 'Special Effect Services',
      it: 'IT Hardware & Services',
      facilities: 'Office Facilities & HVAC',
      logistics: 'Logistics & Fleet',
      legal: 'Professional Legal / Consulting',
      security: 'Security, Surveillance & Biometrics',
      empty_category: 'Other Category',
    };

    const initials = companyName
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'SP';

    const newSup: Partial<Supplier> = {
      id: editingSupplier ? editingSupplier.id : `sup-${Date.now()}`,
      name: companyName.trim(),
      initials,
      ein: editingSupplier ? editingSupplier.ein : `${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000000 + Math.random() * 8999999)}`,
      location: editingSupplier ? editingSupplier.location : 'Austin, TX',
      primaryContact: contactPerson.trim(),
      contactRole: contactRole.trim() || 'Primary Procurement Contact',
      contactEmail: email.trim(),
      phone: phone.trim() || '+1 (555) 012-9988',
      category,
      categoryLabel: categoryLabels[category] || 'General Procurement',
      performanceScore: editingSupplier ? editingSupplier.performanceScore : 100,
      quotesSubmitted: editingSupplier ? editingSupplier.quotesSubmitted : 0,
      totalQuotesInvited: editingSupplier ? editingSupplier.totalQuotesInvited : 0,
      activeRfqs: editingSupplier ? editingSupplier.activeRfqs : 0,
      isVerified: isPreVerified,
      statusTag: isPreVerified ? 'verified' : 'pending-w9',
    };

    onSave(newSup, addAnother);

    if (addAnother) {
      setCompanyName('');
      setContactPerson('');
      setContactRole('');
      setEmail('');
      setPhone('');
      setEmailValidBadge(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-primary/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md md:max-w-xl bg-surface-container-lowest shadow-2xl flex flex-col border-l border-surface-container-high animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-5 bg-primary text-on-primary flex items-center justify-between border-b border-surface-container-high/20">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">
                  person_add
                </span>
                <span className="text-[11px] uppercase tracking-wider text-outline-variant font-semibold">
                  TC-01 Validation Active
                </span>
              </div>
              <h2 className="text-lg font-bold text-on-primary mt-0.5">
                {editingSupplier ? 'Edit Supplier Profile' : 'Add New Supplier'}
              </h2>
              <p className="text-xs text-on-primary/70 mt-0.5">
                Contact will be immediately eligible for RFQ broadcast dispatches.
              </p>
            </div>
            <button
              className="w-8 h-8 rounded-lg bg-on-primary/10 text-on-primary hover:bg-on-primary/20 flex items-center justify-center transition-colors cursor-pointer"
              onClick={onClose}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Form */}
          <form
            className="flex-1 overflow-y-auto p-6 flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(false);
            }}
          >
            {/* Error Banner */}
            {showBannerError && (
              <div className="p-3.5 bg-error-container text-on-error-container rounded-lg flex items-start gap-2.5 border border-error/20">
                <span className="material-symbols-outlined text-[20px] text-error flex-shrink-0 mt-0.5">
                  error
                </span>
                <div className="flex-1">
                  <div className="text-xs font-bold">Incomplete or Invalid Submission</div>
                  <div className="text-[11px] mt-0.5">
                    Please provide a valid company name and verified RFC-compliant email address.
                  </div>
                </div>
              </div>
            )}

            {/* Company Legal Name */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Company Legal Name <span className="text-error font-bold">*</span>
              </label>
              <input
                className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-xs rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary placeholder:text-outline border border-surface-container transition-all"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  if (e.target.value.trim()) setCompanyError(false);
                }}
                placeholder="e.g., OmniCore Data Systems, LLC"
                type="text"
              />
              {companyError && (
                <p className="text-xs text-error mt-1 flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[14px]">warning</span> Company legal name is required.
                </p>
              )}
            </div>

            {/* Primary Contact Person & Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Primary Contact Person <span className="text-error font-bold">*</span>
                </label>
                <input
                  className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-xs rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary placeholder:text-outline border border-surface-container transition-all"
                  value={contactPerson}
                  onChange={(e) => {
                    setContactPerson(e.target.value);
                    if (e.target.value.trim()) setContactError(false);
                  }}
                  placeholder="e.g., Sarah Chen"
                  type="text"
                />
                {contactError && (
                  <p className="text-xs text-error mt-1 flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[14px]">warning</span> Contact name is required.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Role / Title
                </label>
                <input
                  className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-xs rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary placeholder:text-outline border border-surface-container transition-all"
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value)}
                  placeholder="e.g., Director of Sales"
                  type="text"
                />
              </div>
            </div>

            {/* Email with validation */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-on-surface">
                  Business Email Address <span className="text-error font-bold">*</span>
                </label>
                {emailValidBadge && (
                  <span className="text-[11px] font-semibold text-on-tertiary-container flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Valid Syntax
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  mail
                </span>
                <input
                  className="w-full h-10 pl-9 pr-3 bg-surface-container-low text-on-surface text-xs rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary placeholder:text-outline border border-surface-container transition-all"
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                  placeholder="s.chen@omnicore.com"
                  type="email"
                />
              </div>
              {emailError && (
                <p className="text-xs text-error mt-1 flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Please enter a valid RFC-standard email address (e.g., name@domain.com).
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Direct Phone Number
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  call
                </span>
                <input
                  className="w-full h-10 pl-9 pr-3 bg-surface-container-low text-on-surface text-xs rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary placeholder:text-outline border border-surface-container transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Assigned Procurement Category <span className="text-error font-bold">*</span>
              </label>
              <select
                className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-xs rounded-lg focus:outline-none focus:bg-surface-container-lowest cursor-pointer border border-surface-container transition-all"
                value={category}
                onChange={(e) => setCategory(e.target.value as ProcurementCategory)}
              >
                <option value="set_props">Set &amp; Props Services</option>
                <option value="light_sound">Light &amp; Sound Services</option>
                <option value="catering">Catering Services</option>
                <option value="production">Production Services</option>
                <option value="merchandise">Merchandise</option>
                <option value="genset">Genset Rental Services</option>
                <option value="vehicle_rental">Vehicle Rental Services</option>
                <option value="special_effects">Special Effect Services</option>
                <option value="it">IT Hardware &amp; Cloud Services</option>
                <option value="facilities">Office Facilities &amp; HVAC</option>
                <option value="logistics">Logistics &amp; Fleet Transportation</option>
                <option value="legal">Professional Legal &amp; Strategic Advisory</option>
                <option value="security">Security, Surveillance &amp; Biometrics</option>
              </select>
              <p className="text-[11px] text-outline mt-1">
                Vendors receive automatic invitations when RFQs matching this category are published.
              </p>
            </div>

            {/* Pre-Verified Checkbox */}
            <div className="p-3.5 bg-surface-container-low rounded-lg flex items-start gap-2.5 border border-surface-container">
              <input
                checked={isPreVerified}
                onChange={(e) => setIsPreVerified(e.target.checked)}
                className="mt-0.5 rounded text-secondary focus:ring-0 cursor-pointer"
                id="w9Check"
                type="checkbox"
              />
              <label className="text-xs text-on-surface cursor-pointer select-none" htmlFor="w9Check">
                Mark contact as <span className="font-semibold text-on-surface">Pre-Verified</span> (W-9 on file &amp; standard Net-30 payment terms accepted).
              </label>
            </div>
          </form>

          {/* Drawer Footer */}
          <div className="p-4 bg-surface-container-low border-t border-surface-container flex items-center justify-between gap-2">
            <button
              className="h-10 px-4 bg-surface-container-lowest text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container border border-surface-container transition-colors cursor-pointer"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2">
              {!editingSupplier && (
                <button
                  className="h-10 px-3.5 bg-surface-container-lowest text-secondary text-xs font-semibold rounded-lg hover:bg-surface-container-high border border-secondary/30 transition-colors cursor-pointer"
                  onClick={() => handleSubmit(true)}
                  type="button"
                >
                  Save &amp; Add Another
                </button>
              )}
              <button
                className="h-10 px-4 bg-primary text-on-primary text-xs font-semibold rounded-lg shadow-sm hover:bg-primary-container transition-all flex items-center gap-1.5 cursor-pointer"
                onClick={() => handleSubmit(false)}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>{editingSupplier ? 'Update Supplier' : 'Save Supplier'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
