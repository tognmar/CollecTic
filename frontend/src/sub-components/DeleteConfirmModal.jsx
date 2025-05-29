import React from "react";
import { X } from "lucide-react";

export function DeleteConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
  isDeleting = false,
  error = null,
  title = "Delete Ticket?",
  message = "Are you sure you want to delete this ticket? This action cannot be undone.",
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        {/* optional top‑right close button */}
        <button
          type="button"
          className="absolute top-3 right-3 icon-btn-delete"
          aria-label="Close modal"
          onClick={onCancel}
        >
          <X className="icon-btn-icon" />
        </button>

        <h3 className="modal-header mb-2 pt-2 pr-10">{title}</h3>
        <p className="modal-body mb-4">{message}</p>

        {error && <div className="modal-error mb-4">{error}</div>}

        <div className="modal-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn-delete"
            onClick={() => onConfirm()}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}