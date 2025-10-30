export default function LoadingState() {
  return (
    <div className="cb cb--center">
      <div className="spinner" aria-label="Loading" />
      <p className="muted">Joining room…</p>
      <div className="skeleton skeleton--title" />
      <div className="skeleton skeleton--editor" />
    </div>
  );
}
