import express, { Express, Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import next, { NextApiHandler } from "next";
import dotenv from "dotenv";
import { Action } from "@/types/enums";

dotenv.config();

const dev: boolean = process.env.NODE_ENV !== "production";
const port: number = parseInt(process.env.PORT || "5000", 10);

const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

const userSocketMap: Record<string, string> = {};

nextApp.prepare().then(async () => {
  const app: Express = express();
  const server = http.createServer(app);

  const io = new Server(server);

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

    socket.on(Action.JOIN, ({ roomId, username }) => {
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

  app.all("*", (req: any, res: any): any => nextHandler(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
