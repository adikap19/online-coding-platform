const rooms = new Map();

export function getOrCreateRoom(blockId) {
  if (!rooms.has(blockId)) {
    rooms.set(blockId, {
      mentorId: null,
      students: new Set(),
      code: "",
      blockId,
    });
  }
  return rooms.get(blockId);
}

export function clearRoom(blockId) {
  rooms.delete(blockId);
}

export function studentsCount(blockId) {
  const r = rooms.get(blockId);
  return r ? r.students.size : 0;
}

export function isMentor(blockId, socketId) {
  const r = rooms.get(blockId);
  return r && r.mentorId === socketId;
}
