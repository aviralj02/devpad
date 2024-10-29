"use client";

import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const socket = io(URL, {
  forceNew: true,
  reconnectionAttempts: Infinity,
  timeout: 10000,
  transports: ["websocket"],
});
