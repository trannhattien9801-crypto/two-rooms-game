const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

let players = [];

io.on("connection", (socket) => {

  socket.on("join", (name) => {
    players.push({ id: socket.id, name });
    io.emit("players", players);
  });

  socket.on("start", () => {

    const roles = [
      "President",
      "Bomber",
      "Blue",
      "Blue",
      "Red",
      "Red"
    ];

    players.forEach((p, i) => {
      io.to(p.id).emit("role", roles[i % roles.length]);
    });

  });

  socket.on("disconnect", () => {
    players = players.filter(p => p.id !== socket.id);
    io.emit("players", players);
  });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running");
});