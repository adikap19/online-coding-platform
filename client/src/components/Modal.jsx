import ReactDOM from "react-dom";

export default function Modal({
  open,
  title = "Notice",
  message,
  confirmText = "OK",
  onConfirm,
}) {
  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h3 className="modal__title">{title}</h3>
        {message && <p className="modal__message">{message}</p>}
        <div className="modal__actions">
          <button className="modal__btn" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
