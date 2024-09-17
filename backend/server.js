const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const User = require("./models/User");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1/chatroom")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

const onlineUsers = new Map(); // Map to hold online status
// Map object: A collection type for storing key-value pairs with keys of any type, maintaining insertion order.
// .map() method: An array method used to create a new array from an existing one by applying a function to each element.

console.log(
  "Server starting, onlineUsers map initialized:",
  Array.from(onlineUsers.values())
);

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle user registration
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

        // Notify all clients of the new user
        io.emit("user online", { username, online: true });

        // Emit the current users and the messages to the newly connected client **after registration**
        const users = await User.find({}, { messages: 1, username: 1 });

        const allMessages = [];
        users.forEach((user) => {
          user.messages.forEach((msg) => {
            allMessages.push({
              username: user.username,
              content: msg.content,
              timestamp: msg.timestamp,
            });
          });
        });

        // Sort messages by timestamp
        allMessages.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        // Emit current messages and users after registration is successful
        socket.emit("load messages", allMessages);
        socket.emit("current users", Array.from(onlineUsers.values()));

        socket.emit("registration success", user);
      } else {
        socket.emit("registration failed", "Username already exists");
      }
    } catch (error) {
      socket.emit("registration failed", error.message);
    }
  });

  // Handle chat messages
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
          content: msg.content,
        });
      }
    } catch (error) {
      console.log("Error saving message:", error);
    }
  });

  // Handle user disconnection
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
