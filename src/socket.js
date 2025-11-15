import { io } from "socket.io-client";

// ✅ Dùng biến môi trường cho Vite
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

const socket = io(SOCKET_URL, {
  transports: ["websocket"], 
  autoConnect: true,
});

export default socket;