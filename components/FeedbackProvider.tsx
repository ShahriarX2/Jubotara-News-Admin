"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

type ToastVariant = "success" | "error" | "info";
type ConfirmVariant = "danger" | "default";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
}

interface ToastItem extends ToastOptions {
  id: number;
}

interface ConfirmState extends Required<ConfirmOptions> {
  open: boolean;
}

interface FeedbackContextValue {
  showToast: (options: ToastOptions) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

const toastStyles: Record<ToastVariant, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-blue-200 bg-blue-50 text-blue-900",
};

const toastIcons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const confirmButtonStyles: Record<ConfirmVariant, string> = {
  default: "bg-blue-600 hover:bg-blue-700",
  danger: "bg-red-600 hover:bg-red-700",
};

export function FeedbackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    open: false,
    title: "",
    description: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "default",
  });
  const confirmResolver = useRef<((value: boolean) => void) | null>(null);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, description, variant = "info" }: ToastOptions) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((current) => [...current, { id, title, description, variant }]);
      window.setTimeout(() => {
        dismissToast(id);
      }, 3500);
    },
    [dismissToast],
  );

  const confirm = useCallback((options: ConfirmOptions) => {
    setConfirmState({
      open: true,
      title: options.title,
      description: options.description || "",
      confirmText: options.confirmText || "Confirm",
      cancelText: options.cancelText || "Cancel",
      variant: options.variant || "default",
    });

    return new Promise<boolean>((resolve) => {
      confirmResolver.current = resolve;
    });
  }, []);

  const handleConfirmClose = useCallback((confirmed: boolean) => {
    setConfirmState((current) => ({ ...current, open: false }));
    confirmResolver.current?.(confirmed);
    confirmResolver.current = null;
  }, []);

  const value = useMemo(
    () => ({
      showToast,
      confirm,
    }),
    [showToast, confirm],
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-3 px-4 sm:px-0">
        {toasts.map((toast) => {
          const Icon = toastIcons[toast.variant || "info"];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-xl border p-4 shadow-lg ${toastStyles[toast.variant || "info"]}`}
            >
              <div className="flex items-start gap-3">
                <Icon size={18} className="mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{toast.title}</p>
                  {toast.description ? (
                    <p className="mt-1 text-sm opacity-80">{toast.description}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  title="Dismiss notification"
                  onClick={() => dismissToast(toast.id)}
                  className="rounded-md p-1 opacity-70 transition hover:bg-white/50 hover:opacity-100"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {confirmState.open ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-full bg-amber-100 p-2 text-amber-700">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {confirmState.title}
                </h2>
                {confirmState.description ? (
                  <p className="mt-1 text-sm text-gray-600">
                    {confirmState.description}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => handleConfirmClose(false)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                {confirmState.cancelText}
              </button>
              <button
                type="button"
                onClick={() => handleConfirmClose(true)}
                className={`rounded-xl px-4 py-2.5 font-semibold text-white transition ${confirmButtonStyles[confirmState.variant]}`}
              >
                {confirmState.confirmText}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error("useFeedback must be used within FeedbackProvider");
  }

  return context;
}
