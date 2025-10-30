import http from "http";
import dotenv from "dotenv";
import { Server as SocketIOServer } from "socket.io";
import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";
import { registerSocket } from "./sockets/registerSocket.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

(async function start() {
  await connectDB(process.env.MONGODB_URI);

  const app = createApp({ clientOrigin: CLIENT_ORIGIN });
  const server = http.createServer(app);

  const io = new SocketIOServer(server, {
    cors: { origin: CLIENT_ORIGIN },
  });

  registerSocket(io);

  server.listen(PORT, () => {
    console.log(`Server on :${PORT}`);
  });
})();
