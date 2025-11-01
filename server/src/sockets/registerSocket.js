import CodeBlock from "../models/CodeBlock.js";
import {
  getOrCreateRoom,
  clearRoom,
  studentsCount,
  isMentor,
} from "../services/roomState.js";

//check whether the current mentor socket is still connected
function isMentorAlive(io, room) {
  return !!(room.mentorId && io.sockets.sockets.get(room.mentorId));
}

// normalize code so we can compare student code with solution
function normalizeCode(s) {
  return (s || "")
    .replace(/\r\n/g, "\n")
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "")
    .replace(/\s+/g, "")
    .trim();
}

async function handleJoinRoom(io, socket, { blockId }) {
  try {
    const block = await CodeBlock.findById(blockId);

    if (!block) {
      socket.emit("error", { message: "Room not found" });
      return;
    }
    const room = getOrCreateRoom(blockId);
    const mentorAlive = isMentorAlive(io, room);
    const isSameSocketMentor = room.mentorId === socket.id;

    let role;
    if (!mentorAlive || isSameSocketMentor || !room.mentorId) {
      room.mentorId = socket.id;

      if (room.code == null || room.code === "") {
        room.code = block.initialCode || "";
      }
      role = "mentor";
    } else {
      room.students.add(socket.id);
      role = "student";
    }

    socket.join(blockId);

    socket.emit("role-assigned", {
      role,
      title: block.title,
      code: room.code,
      studentsCount: studentsCount(blockId),
    });

    io.to(blockId).emit("room-count", {
      studentsCount: studentsCount(blockId),
    });
  } catch (e) {
    socket.emit("error", { message: "Join failed" });
  }
}

async function handleCodeChange(socket, { blockId, code }) {
  const room = getOrCreateRoom(blockId);

  if (isMentor(blockId, socket.id)) return;

  room.code = code ?? "";
  socket.to(blockId).emit("code-update", { code: room.code });

  // Try to check solution
  try {
    const block = await CodeBlock.findById(blockId, { solution: 1 });

    const studentCode = normalizeCode(room.code);
    const correctSolution = normalizeCode(block?.solution);

    if (block && studentCode === correctSolution) {
      socket.emit("solved");
      socket.to(blockId).emit("solved");
    }
  } catch (e) {
    console.error("Error in code-change handler:", e);
  }
}

function handleLeaveRoom(io, socket, { blockId }) {
  handleDisconnectFromRoom(io, socket, blockId);
}

function handleDisconnecting(io, socket) {
  // Iterate all rooms this socket belongs to and leave them cleanly
  const rooms = [...socket.rooms];
  rooms.forEach((rid) => {
    if (rid !== socket.id) {
      handleDisconnectFromRoom(io, socket, rid);
    }
  });
}

function handleDisconnectFromRoom(io, socket, blockId) {
  const room = getOrCreateRoom(blockId);
  if (!room) return;

  // if Tom gets out of the room - the room closes and the code is being deleted
  if (room.mentorId === socket.id) {
    io.to(blockId).emit("mentor-left");
    clearRoom(blockId);
    return;
  }

  // if a student leaves: update student count
  if (room.students.has(socket.id)) {
    room.students.delete(socket.id);
    io.to(blockId).emit("room-count", { studentsCount: room.students.size });
  }
}

export function registerSocket(io) {
  io.on("connection", (socket) => {
    socket.on("join-room", (payload) => handleJoinRoom(io, socket, payload));

    socket.on("code-change", (payload) => handleCodeChange(socket, payload));

    socket.on("leave-room", (payload) => handleLeaveRoom(io, socket, payload));

    socket.on("disconnecting", () => handleDisconnecting(io, socket));
  });
}
