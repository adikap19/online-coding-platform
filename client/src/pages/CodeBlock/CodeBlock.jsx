import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./CodeBlock.css";

import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import RoomHeader from "../../components/RoomHeader";
import EditorWrapper from "../../components/EditorWrapper";

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

    if (!socketRef.current?.connected) {
      socketRef.current.connect();
    }

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
      socket.disconnect();
    };
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

      <EditorWrapper code={code} onChange={handleChange} role={role} />

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
