import React, { useState } from 'react';
import { CategoryInfo, ProcurementCategory } from '../types';

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryInfo[];
  onAddCategory: (name: string) => void;
  onEditCategory: (id: ProcurementCategory, newName: string) => void;
}

export const ManageCategoriesModal: React.FC<ManageCategoriesModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onEditCategory,
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState<ProcurementCategory | null>(null);
  const [editingName, setEditingName] = useState('');

  if (!isOpen) return null;

  const handleAddNew = () => {
    if (newCatName.trim()) {
      onAddCategory(newCatName.trim());
      setNewCatName('');
    }
  };

  const handleSaveEdit = (id: ProcurementCategory) => {
    if (editingName.trim()) {
      onEditCategory(id, editingName.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-primary/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="inline-block w-full max-w-xl p-6 text-left align-middle bg-surface-container-lowest rounded-xl shadow-2xl relative z-10 border border-surface-container-high transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">tune</span>
            <h3 className="text-base font-bold text-on-surface">Category Taxonomies</h3>
          </div>
          <button
            className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="py-4 flex flex-col gap-3">
          <p className="text-xs text-on-surface-variant">
            Categories auto-tag outgoing line-item requests to designated supplier contact pools.
          </p>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-lg border border-surface-container"
              >
                <div className="flex items-center gap-2.5 flex-1 mr-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${cat.dotColor}`}></span>
                  {editingId === cat.id ? (
                    <input
                      className="text-xs font-semibold text-on-surface bg-surface-container-lowest px-2 py-1 rounded border border-secondary focus:outline-none flex-1"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <span className="text-xs font-semibold text-on-surface">
                      {cat.name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className={`font-mono text-xs ${cat.count === 0 ? 'text-error font-medium' : 'text-outline'}`}>
                    {cat.count} Suppliers
                  </span>
                  {editingId === cat.id ? (
                    <button
                      className="text-secondary hover:underline text-xs font-bold cursor-pointer"
                      onClick={() => handleSaveEdit(cat.id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="text-outline hover:text-secondary p-1 rounded cursor-pointer"
                      type="button"
                      onClick={() => {
                        setEditingId(cat.id);
                        setEditingName(cat.name);
                      }}
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              className="flex-1 h-9 px-3 bg-surface-container-low text-on-surface text-xs rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary border border-surface-container placeholder:text-outline"
              placeholder="New category name..."
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddNew();
              }}
            />
            <button
              className="h-9 px-3.5 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:bg-primary-container transition-colors cursor-pointer"
              type="button"
              onClick={handleAddNew}
            >
              Add Category
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-surface-container flex justify-end">
          <button
            className="h-9 px-4 bg-surface-container text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
            onClick={onClose}
            type="button"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
