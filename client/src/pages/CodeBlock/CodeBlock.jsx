import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import "./CodeBlock.css";

const socket = io(import.meta.env.VITE_API_BASE, {
  transports: ["websocket"],
});

export default function CodeBlock() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [studentsCount, setStudentsCount] = useState(0);
  const [solved, setSolved] = useState(false);

  // conecting to a room
  useEffect(() => {
    socket.emit("join-room", { blockId: id });

    socket.on("role-assigned", (data) => {
      setRole(data.role);
      setTitle(data.title);
      setCode(data.code);
      setStudentsCount(data.studentsCount);
    });

    socket.on("code-update", ({ code }) => {
      setCode(code);
    });

    socket.on("room-count", ({ studentsCount }) => {
      setStudentsCount(studentsCount);
    });

    socket.on("mentor-left", () => {
      alert("The mentor has left the session. Returning to lobby...");
      navigate("/");
    });

    socket.on("solved", () => {
      setSolved(true);
      setTimeout(() => setSolved(false), 3000);
    });

    return () => {
      socket.emit("leave-room", { blockId: id });
      socket.off();
    };
  }, [id, navigate]);

  // sendind code changed to sever - if it's student
  const handleChange = (value) => {
    if (role === "student") {
      setCode(value);
      socket.emit("code-change", { blockId: id, code: value });
    }
  };

  return (
    <div className="cb">
      <div className="cb__header">
        <h1 className="cb__title">{title}</h1>
        {role && (
          <p className="cb__role">
            You are the <strong>{role}</strong>
          </p>
        )}
        <p className="cb__count">{studentsCount} student(s) in room</p>
        <button className="cb__back" onClick={() => navigate("/")}>
          ← Back to Lobby
        </button>
      </div>

      <div className="cb__editorWrap">
        <Editor
          height="70vh"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={handleChange}
          options={{
            readOnly: role === "mentor",
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      {solved && (
        <div className="cb__solvedOverlay">
          <span role="img" aria-label="smile">
            😄
          </span>
        </div>
      )}
    </div>
  );
}
