"use client";

import { io } from "socket.io-client";

export const socket = io("/", {
  forceNew: true,
  reconnectionAttempts: Infinity,
  timeout: 10000,
  transports: ["websocket"],
});
