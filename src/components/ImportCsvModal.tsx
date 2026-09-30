import React, { useState } from 'react';
import { Supplier, ProcurementCategory } from '../types';

interface ImportCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (suppliers: Supplier[]) => void;
  onShowToast: (message: string) => void;
}

export const ImportCsvModal: React.FC<ImportCsvModalProps> = ({
  isOpen,
  onClose,
  onImport,
  onShowToast,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [previewCount, setPreviewCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const sampleCsv = `Company Name,Primary Contact,Contact Email,Phone,Category
Global Cloud Networks,Michael Adams,m.adams@globalcloud.net,+1 (415) 800-9911,it
Hudson River Catering,Chef Chloe Dubois,c.dubois@hudsoncatering.com,+1 (212) 690-1122,catering
Apex Industrial Filtration,Robert Vance,r.vance@apexindustrial.com,+1 (312) 441-2090,facilities`;

  const parseCsv = (text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length <= 1) return [];

    const parsed: Supplier[] = [];
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim());
      if (parts.length >= 3 && parts[0] && parts[2]) {
        const name = parts[0];
        const contact = parts[1] || 'Lead Representative';
        const email = parts[2];
        const phone = parts[3] || '+1 (555) 019-2831';
        const category = (parts[4] || 'it') as ProcurementCategory;
        const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

        parsed.push({
          id: `sup-import-${Date.now()}-${i}`,
          name,
          initials,
          ein: `${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000000 + Math.random() * 8999999)}`,
          location: 'United States',
          primaryContact: contact,
          contactRole: 'Imported Vendor Rep',
          contactEmail: email,
          phone,
          category,
          categoryLabel: category === 'it' ? 'IT Hardware & Services' : category === 'facilities' ? 'Office Facilities & HVAC' : 'Catering & Events',
          performanceScore: 95,
          quotesSubmitted: 0,
          totalQuotesInvited: 0,
          activeRfqs: 0,
          isVerified: true,
          statusTag: 'verified',
        });
      }
    }
    return parsed;
  };

  const handleProcess = () => {
    const data = parseCsv(csvText);
    if (data.length === 0) {
      onShowToast('No valid supplier rows detected in CSV.');
      return;
    }
    onImport(data);
    onShowToast(`Successfully imported ${data.length} vendor profiles into directory!`);
    onClose();
  };

  const loadSample = () => {
    setCsvText(sampleCsv);
    const count = parseCsv(sampleCsv).length;
    setPreviewCount(count);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-primary/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="inline-block w-full max-w-lg p-6 text-left align-middle bg-surface-container-lowest rounded-xl shadow-2xl relative z-10 border border-surface-container-high transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">upload_file</span>
            <h3 className="text-base font-bold text-on-surface">Import Supplier CSV Manifest</h3>
          </div>
          <button
            className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="py-4 space-y-4">
          <p className="text-xs text-on-surface-variant">
            Upload or paste standard comma-separated vendor rosters with columns: <code className="bg-surface-container-low px-1 py-0.5 rounded font-mono text-[11px]">Company Name, Primary Contact, Email, Phone, Category</code>.
          </p>

          {/* Drag & drop simulation zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
              dragActive
                ? 'border-secondary bg-surface-container-low'
                : 'border-surface-container-high hover:border-secondary/60 bg-surface-container-low/40'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              loadSample();
            }}
            onClick={loadSample}
          >
            <span className="material-symbols-outlined text-secondary text-[36px] block mx-auto mb-1">
              cloud_upload
            </span>
            <span className="text-xs font-bold text-on-surface block">
              Drag &amp; drop vendor CSV file here
            </span>
            <span className="text-[11px] text-on-surface-variant block mt-0.5">
              or click here to load sample manifest (3 verified suppliers)
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-on-surface">
                Raw CSV Data
              </label>
              {previewCount !== null && (
                <span className="text-[11px] font-mono text-on-tertiary-container font-semibold">
                  {previewCount} rows ready for import
                </span>
              )}
            </div>
            <textarea
              className="w-full h-32 p-3 bg-surface-container-low text-on-surface font-mono text-xs rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary border border-surface-container placeholder:text-outline"
              placeholder={sampleCsv}
              value={csvText}
              onChange={(e) => {
                setCsvText(e.target.value);
                setPreviewCount(parseCsv(e.target.value).length);
              }}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-surface-container flex items-center justify-between">
          <button
            className="text-xs text-secondary hover:underline font-semibold cursor-pointer"
            onClick={loadSample}
            type="button"
          >
            Paste Sample CSV
          </button>

          <div className="flex items-center gap-2">
            <button
              className="h-9 px-4 bg-surface-container text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="h-9 px-4 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:bg-primary-container transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              disabled={!csvText.trim()}
              onClick={handleProcess}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">file_download_done</span>
              <span>Import Suppliers</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
