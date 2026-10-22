"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

import { cn } from "../../lib/utils";

export default function Toast({
  open,
  type = "success",
  message,
  onClose,
  duration = 4500,
}) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => onCloseRef.current(), duration);
    return () => clearTimeout(timer);
  }, [open, duration]);

  if (!open) return null;

  const isError = type === "error";

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 top-24 z-[60] w-[calc(100%-2rem)] max-w-sm"
    >
      <div
        className={cn(
          "flex items-start gap-3 rounded-xl border bg-paper p-4 shadow-lg",
          isError
            ? "border-danger/30 shadow-danger/10"
            : "border-success/30 shadow-success/10"
        )}
      >
        {isError ? (
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
        ) : (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
        )}

        <p className="flex-1 text-sm font-medium leading-snug">{message}</p>

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar aviso"
          className="-mr-1 -mt-1 rounded-lg p-1 text-muted transition-colors hover:bg-bone hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
