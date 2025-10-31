export default function RoomHeader({ title, role, studentsCount, onBack }) {
  return (
    <div className="cb__header">
      <h1 className="cb__title">
        Code Session: <span className="session-title">{title}</span>
      </h1>
      {role && (
        <p className="cb__role">
          Role:{" "}
          <strong>{role === "mentor" ? "Mentor (Tom)" : "Student"}</strong>
          {role === "mentor" && (
            <p className="cb__readonly-note">
              <span>(read-only)</span>
            </p>
          )}
        </p>
      )}
      <p className="cb__count">
        👥 {studentsCount} student{studentsCount !== 1 && "s"} in room
      </p>
      <button className="cb__back" onClick={onBack}>
        ← Back to Lobby
      </button>
    </div>
  );
}
