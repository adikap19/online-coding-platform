import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./CodeBlock.css";

import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import RoomHeader from "../../components/RoomHeader";
import EditorWrapper from "../../components/EditorWrapper";
import HintsPanel from "../../components/HintsPanel";

// Ensure socket instance exists and connected.
function ensureSocket(socketRef) {
  if (!socketRef.current) {
    socketRef.current = io(import.meta.env.VITE_API_BASE, {
      transports: ["websocket"],
    });
  }
  if (socketRef.current.disconnected) {
    socketRef.current.connect();
  }
  return socketRef.current;
}

// Emit the initial join event for a given room id
function joinRoom(socket, blockId) {
  socket.emit("join-room", { blockId });
}

//  Register all socket event handlers.
// Returns a cleanup function that removes listeners, emits leave, and disconnects.
function registerSocketHandlers(socket, blockId, navigate, setters) {
  const {
    setRole,
    setTitle,
    setCode,
    setStudentsCount,
    setSolved,
    setIsLoading,
    setErrorMsg,
    setHints,
  } = setters;

  const onRoleAssigned = (data) => {
    setRole(data.role);
    setTitle(data.title);
    setCode(data.code);
    setStudentsCount(data.studentsCount);
    setHints(Array.isArray(data.hints) ? data.hints : []);
    setIsLoading(false);
  };

  const onCodeUpdate = ({ code }) => setCode(code);
  const onRoomCount = ({ studentsCount }) => setStudentsCount(studentsCount);

  const onMentorLeft = () => {
    navigate("/", { state: { mentorLeft: true } });
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
    socket.emit("leave-room", { blockId });
    socket.off("role-assigned", onRoleAssigned);
    socket.off("code-update", onCodeUpdate);
    socket.off("room-count", onRoomCount);
    socket.off("mentor-left", onMentorLeft);
    socket.off("solved", onSolved);
    socket.off("error", onError);

    socket.disconnect();
  };
}

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
  const [hints, setHints] = useState([]);

  useEffect(() => {
    const socket = ensureSocket(socketRef);

    joinRoom(socket, id);

    const cleanup = registerSocketHandlers(socket, id, navigate, {
      setRole,
      setTitle,
      setCode,
      setStudentsCount,
      setSolved,
      setIsLoading,
      setErrorMsg,
      setHints,
    });

    return cleanup;
  }, [id, navigate]);

  const handleChange = (value) => {
    if (role === "student" && socketRef.current) {
      setCode(value ?? "");
      socketRef.current.emit("code-change", { blockId: id, code: value ?? "" });
    }
  };

  if (isLoading) return <LoadingState />;
  if (errorMsg)
    return <ErrorState message={errorMsg} onBack={() => navigate("/")} />;

  return (
    <div className="cb">
      <RoomHeader
        title={title}
        role={role}
        studentsCount={studentsCount}
        onBack={() => navigate("/")}
      />

      <div className="cb__content">
        <div className="cb__contentMain">
          <EditorWrapper code={code} onChange={handleChange} role={role} />
        </div>
        <aside className="cb__side">
          <HintsPanel hints={hints} role={role} />
        </aside>
      </div>

      {solved && (
        <div className="cb__solvedOverlay">
          <span role="img" aria-label="smile">
            😎
          </span>
        </div>
      )}
    </div>
  );
}
