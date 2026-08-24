import { AnimatePresence, motion } from 'framer-motion';
import { CircleAlert, CircleCheckBig, Info, X } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastItem extends ToastInput {
  id: number;
  variant: ToastVariant;
}

interface ToastApi {
  push: (toast: ToastInput) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const styles: Record<ToastVariant, { border: string; icon: ReactNode }> = {
  success: {
    border: 'border-brand-cyan/40',
    icon: <CircleCheckBig aria-hidden="true" className="size-5 text-brand-cyan" />,
  },
  error: {
    border: 'border-brand-magenta/40',
    icon: <CircleAlert aria-hidden="true" className="size-5 text-[#e879f9]" />,
  },
  info: {
    border: 'border-white/15',
    icon: <Info aria-hidden="true" className="size-5 text-[#b07bff]" />,
  },
};

/** Announces transient feedback (form results, unconfigured links). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    ({ title, description, variant = 'info' }: ToastInput) => {
      const id = nextId.current++;
      setToasts((current) => [...current.slice(-2), { id, title, description, variant }]);
      timers.current.set(
        id,
        window.setTimeout(() => dismiss(id), 6500),
      );
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[120] flex flex-col items-end gap-3 sm:inset-x-auto sm:right-6 sm:bottom-6"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'glass pointer-events-auto flex w-full items-start gap-3 rounded-xl p-4 pr-3 sm:w-[22rem]',
                styles[toast.variant].border,
              )}
            >
              <span className="mt-0.5 shrink-0">{styles[toast.variant].icon}</span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold text-paper">{toast.title}</p>
                {toast.description && (
                  <p className="mt-1 text-[0.8rem] leading-relaxed break-words text-muted">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="-mt-0.5 shrink-0 rounded-md p-1 text-faint transition-colors hover:bg-white/5 hover:text-paper"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>');
  return context;
}
