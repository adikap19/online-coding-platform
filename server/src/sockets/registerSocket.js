import CodeBlock from "../models/CodeBlock.js";
import {
  getOrCreateRoom,
  clearRoom,
  studentsCount,
  isMentor,
} from "../services/roomState.js";

export function registerSocket(io) {
  io.on("connection", (socket) => {
    socket.on("join-room", async ({ blockId }) => {
      try {
        const block = await CodeBlock.findById(blockId);
        if (!block) return socket.emit("error", { message: "Room not found" });

        const room = getOrCreateRoom(blockId);

        // If there is no mentor, the first one enters the room is the mentor
        let role;
        if (!room.mentorId) {
          room.mentorId = socket.id;
          room.code = block.initialCode || "";
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
    });

    socket.on("code-change", async ({ blockId, code }) => {
      const room = getOrCreateRoom(blockId);
      if (isMentor(blockId, socket.id)) return;

      room.code = code ?? "";
      socket.to(blockId).emit("code-update", { code: room.code });

      try {
        const block = await CodeBlock.findById(blockId, { solution: 1 });

        const normalize = (s) =>
          (s || "")
            .replace(/\r\n/g, "\n")
            .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "")
            .replace(/\s+/g, "")
            .trim();

        const studentCode = normalize(room.code);
        const correctSolution = normalize(block?.solution);

        if (block && studentCode === correctSolution) {
          socket.emit("solved");
          socket.to(blockId).emit("solved");
        }
      } catch (e) {
        console.error("Error in code-change handler:", e);
      }
    });

    socket.on("leave-room", ({ blockId }) => {
      handleDisconnectFromRoom(io, socket, blockId);
    });

    socket.on("disconnecting", () => {
      const rooms = [...socket.rooms];
      rooms.forEach((rid) => {
        if (rid !== socket.id) {
          handleDisconnectFromRoom(io, socket, rid);
        }
      });
    });
  });
}

function handleDisconnectFromRoom(io, socket, blockId) {
  const room = getOrCreateRoom(blockId);
  if (!room) return;

  //if Tom got out of the room-the room closes and the code deletes
  if (room.mentorId === socket.id) {
    io.to(blockId).emit("mentor-left");
    clearRoom(blockId);
    return;
  }

  //if it's a student we update the amount of students
  if (room.students.has(socket.id)) {
    room.students.delete(socket.id);
    io.to(blockId).emit("room-count", { studentsCount: room.students.size });
  }
}
