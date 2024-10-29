import express, { Express, Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import { Action } from "./enums";

dotenv.config();

const app: Express = express();

app.use(
  cors({
    origin: ["http://localhost:3000/", "https://devpad-inky.vercel.app/"],
    credentials: true,
  })
);

const server = http.createServer(app);
const io = new Server(server);

const userSocketMap: Record<string, string> = {};

function getAllConnectedClients(roomId: string) {
  const socketsIdsInRoom: string[] = Array.from(
    io.sockets.adapter.rooms.get(roomId) || []
  );

  return socketsIdsInRoom.map((socketId) => {
    return {
      socketId,
      username: userSocketMap[socketId],
    };
  });
}

app.get("/test", async (_: Request, res: Response) => {
  res.send("Devpad server running...");
});

io.on("connection", (socket: Socket) => {
  console.log("connection");
  socket.emit("status", "Hello from Socket.io");

  socket.on("join", ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);

    // will notify other clients on same room that a new client has joined - aviral
    clients.forEach(({ socketId: id }) => {
      io.to(id).emit(Action.JOINED, {
        clients,
        username, // new client username
        socketId: socket.id, // new client socketId
      });
    });
  });

  socket.on(Action.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(Action.CODE_CHANGE, { code });
  });

  socket.on(Action.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(Action.SYNC_CODE, { code });
  });

  socket.on(Action.LANG_CHANGE, ({ roomId, lang }) => {
    socket.in(roomId).emit(Action.LANG_CHANGE, { lang });
  });

  socket.on(Action.SYNC_LANG, ({ socketId, lang }) => {
    io.to(socketId).emit(Action.SYNC_LANG, { lang });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      // will notify that someone has left/disconnected - aviral
      socket.in(roomId).emit(Action.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
  });

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});

const port: number = parseInt(process.env.PORT || "5000", 10);

server.listen(port, () => {
  console.log(`> Server running on http://localhost:${port}`);
});

// 🧠 Brain dump #1:
// io.to(room) broadcasts a message to everyone in a specific room, including the socket that triggered the event (as io is global server variable)
// socket.in(room) sends a message to everyone else in the specified room, EXCLUDING the socket that triggered the event
// socket.to(room) doesnt broadcast but sends including the sender
