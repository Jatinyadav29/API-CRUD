import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Button from "@/shared/ui/components/Button";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && !loading) onCancel();
    },
    [loading, onCancel],
  );

  const handleBackdropClick = useCallback(() => {
    if (!loading) onCancel();
  }, [loading, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        tabIndex={-1}
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="confirm-title"
          className="text-lg font-semibold text-neutral-900"
        >
          {title}
        </h2>
        {description && (
          <p id="confirm-desc" className="mt-2 text-sm text-neutral-500">
            {description}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            ref={cancelRef}
            variant="secondary"
            disabled={loading}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button variant={variant} loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
