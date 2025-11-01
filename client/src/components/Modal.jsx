export default function Modal({
  open,
  title,
  message,
  onConfirm,
  confirmText = "OK",
}) {
  if (!open) return null;

  return (
    <div
      className="modal__backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal__panel">
        {title && (
          <h3 id="modal-title" className="modal__title">
            {title}
          </h3>
        )}
        <p className="modal__message">{message}</p>
        <div className="modal__actions">
          <button className="modal__btn" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
