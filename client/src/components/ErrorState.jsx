export default function ErrorState({ message, onBack }) {
  return (
    <div className="cb cb--center">
      <h2 className="cb__title">Unable to join room</h2>
      <p className="error">{message}</p>
      <button className="cb__back" onClick={onBack}>
        Back to Lobby
      </button>
    </div>
  );
}
