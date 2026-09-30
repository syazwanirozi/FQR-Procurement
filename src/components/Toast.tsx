import React from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  icon?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-primary text-on-primary px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200 border border-surface-container-high/20 max-w-md"
        >
          <span className="material-symbols-outlined text-tertiary-fixed text-[20px] flex-shrink-0">
            {toast.icon || (toast.type === 'error' ? 'error' : toast.type === 'warning' ? 'warning' : 'check_circle')}
          </span>
          <span className="text-xs font-semibold text-on-primary flex-1 leading-snug">
            {toast.message}
          </span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-on-primary/60 hover:text-on-primary p-0.5"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
