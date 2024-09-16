const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1/chat")
  .then(() => console.log("mongo connected"))
  .catch((err) => console.log(err));

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("someone connected");
  // register
  socket.on("register", async (username) => {
    try {
      let user = await User.findOneAndUpdate(
        { username },
        { online: true },
        { new: true, upsert: true }
      );

      if (user) {
        socket.username = username;
        onlineUsers.set(username, { username, online: true });

        io.emit("user online", { username, online: true });

        const users = await User.find({}, { messages: 1, username: 1 });

        const allmessages = [];

        users.forEach((user) => {
          allmessages.message.forEach((msg) => {
            allmessages.push({
              username: user.username,
              content: msg.content,
              timestamp: msg.timestamp,
            });
          });
        });
        allmessages.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        socket.emit("load messages", allmessages);
        socket.emit("current users", Array.from(onlineUsers.values()));

        socket.emit("registration succes", user);
      } else {
        socket.emit("registration failed", "Username exists");
      }
    } catch (err) {
      socket.emit("registration failed", err.message);
    }
  });
  // chat message

  socket.on("chat message", async (msg) => {
    try {
      let user = await User.findOneAndUpdate(
        { username: socket.username },
        {
          $push: { messages: { content: msg.content, timestamp: new Date() } },
        },
        { new: true }
      );
      if (user) {
        io.emit("chat message", {
          username: socket.username,
          content: msg.conent,
        });
      }
    } catch (err) {
      console.log("Error sending message", err);
    }
  });
  // user discconection
  socket.on("disconnect", async () => {
    if (socket.username) {
      await User.findOneAndUpdate(
        { username: socket.username },
        { online: false }
      );
      onlineUsers.delete(socket.username);
      io.emit("user offline", { username: socket.username, online: false });
    }
  });
});

const port = 5000;

server.listen(port, () => console.log("server running on port 5k"));
