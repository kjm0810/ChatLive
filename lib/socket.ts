// lib/socket.js
import { io } from "socket.io-client";

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

const socket = io(socketUrl, {
  transports: ["websocket"],
  autoConnect: false, // import 시 자동 연결 방지
});

export default socket;