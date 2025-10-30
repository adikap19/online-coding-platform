import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import "./CodeBlock.css";

const handleEditorWillMount = (monaco) => {
  // Keep syntax highlighting; show only basic syntax errors
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true, 
    noSyntaxValidation: false, 
  });
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    allowNonTsExtensions: true,
    checkJs: false,
  });
};

export default function CodeBlock() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [role, setRole] = useState(null);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [studentsCount, setStudentsCount] = useState(0);
  const [solved, setSolved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_BASE, {
        transports: ["websocket"],
      });
    }
    const socket = socketRef.current;

    socket.emit("join-room", { blockId: id });

    const onRoleAssigned = (data) => {
      setRole(data.role);
      setTitle(data.title);
      setCode(data.code);
      setStudentsCount(data.studentsCount);
      setIsLoading(false);
    };

    const onCodeUpdate = ({ code }) => setCode(code);
    const onRoomCount = ({ studentsCount }) => setStudentsCount(studentsCount);

    const onMentorLeft = () => {
      alert("The mentor has left the session. Returning to lobby...");
      navigate("/");
    };

    const onSolved = () => {
      setSolved(true);
      setTimeout(() => setSolved(false), 3000);
    };

    const onError = ({ message }) => {
      setErrorMsg(message || "Something went wrong");
      setIsLoading(false);
    };

    socket.on("role-assigned", onRoleAssigned);
    socket.on("code-update", onCodeUpdate);
    socket.on("room-count", onRoomCount);
    socket.on("mentor-left", onMentorLeft);
    socket.on("solved", onSolved);
    socket.on("error", onError);

    return () => {
      socket.emit("leave-room", { blockId: id });
      socket.off("role-assigned", onRoleAssigned);
      socket.off("code-update", onCodeUpdate);
      socket.off("room-count", onRoomCount);
      socket.off("mentor-left", onMentorLeft);
      socket.off("solved", onSolved);
      socket.off("error", onError);
    };
  }, [id, navigate]);

  const handleChange = (value) => {
    if (role === "student" && socketRef.current) {
      setCode(value ?? "");
      socketRef.current.emit("code-change", { blockId: id, code: value ?? "" });
    }
  };

  if (isLoading) {
    return (
      <div className="cb cb--center">
        <div className="spinner" aria-label="Loading" />
        <p className="muted">Joining room…</p>
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--editor" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="cb cb--center">
        <h2 className="cb__title">Unable to join room</h2>
        <p className="error">{errorMsg}</p>
        <button className="cb__back" onClick={() => navigate("/")}>
          Back to Lobby
        </button>
      </div>
    );
  }

  return (
    <div className="cb">
      <div className="cb__header">
        <h1 className="cb__title">
          Code Session: <span className="session-title">{title}</span>
        </h1>
        {role && (
          <p className="cb__role">
            Role:{" "}
            <strong>{role === "mentor" ? "Mentor (Tom)" : "Student"}</strong>
          </p>
        )}
        <p className="cb__count">
          👥 {studentsCount} student{studentsCount !== 1 && "s"} in room
        </p>
        <button className="cb__back" onClick={() => navigate("/")}>
          ← Back to Lobby
        </button>
      </div>

      <div className="cb__editorWrap">
        <Editor
          height="60vh"
          language="javascript"
          path="script.js"
          theme="vs-dark"
          value={code}
          onChange={handleChange}
          beforeMount={handleEditorWillMount}
          options={{
            readOnly: role === "mentor",
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: true,
            padding: { top: 16, bottom: 12 },
            fixedOverflowWidgets: true,
            overviewRulerBorder: false,
            roundedSelection: true,
            cursorSmoothCaretAnimation: "on",
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
