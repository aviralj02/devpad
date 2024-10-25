import express, { Express, Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import next, { NextApiHandler } from "next";
import dotenv from "dotenv";
dotenv.config();

const dev: boolean = process.env.NODE_ENV !== "production";
const port: number = parseInt(process.env.PORT || "5000", 10);

const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app: Express = express();
  const server = http.createServer(app);

  const io = new Server(server);

  app.get("/hello", async (_: Request, res: Response) => {
    res.send("Hello World");
  });

  io.on("connection", (socket: Socket) => {
    console.log("connection");
    socket.emit("status", "Hello from Socket.io");

    socket.on("disconnect", () => {
      console.log("client disconnected");
    });
  });

  app.all("*", (req: any, res: any): any => nextHandler(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
