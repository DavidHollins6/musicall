require("dotenv").config();

import { Server } from "http";
import express from "express";
import { Server as IoServer } from "socket.io";

const app = express();
const server = new Server(app);
const io = new IoServer(server, {
  cors: {
    origin: process.env.APP_ENDPOINT,
    methods: ["GET", "POST"],
  },
});

const DEFAULT_PEER_COUNT = 5;
app.use(express.static(__dirname));

app.get("/health-check", (req, res) => {
  res.send(process.env);
});

io.on("connection", function (socket) {
  console.log("Connection with ID:", socket.id);
  socket.on("join-room", async function ({ roomId }) {
    socket.join(roomId);

    const sockets = await io.in(roomId).fetchSockets();
    const peersInRoomExceptSender = sockets.filter((s) => s.id !== socket.id);

    console.log("advertising peers");
    peersInRoomExceptSender.forEach(function (socket2) {
      console.log(
        "Advertising peer %s to %s in room %s",
        socket.id,
        socket2.id,
        roomId
      );
      socket2.emit("peer", {
        peerId: socket.id,
        initiator: true,
      });

      socket.emit("peer", {
        peerId: socket2.id,
        initiator: false,
      });
    });

    socket.on("signal", function (data) {
      var socket2 = io.sockets.sockets.get(data.peerId);
      if (!socket2) {
        return;
      }
      console.log("Proxying signal from peer %s to %s", socket.id, socket2.id);

      socket2.emit("signal", {
        signal: data.signal,
        peerId: socket.id,
      });
    });
  });
});

server.listen(process.env.PORT || "3000");
