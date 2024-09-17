import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Chatroom() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const username = location.state?.username;

  useEffect(() => {
    socket.emit("register", username);

    socket.on("registration success", () => {
      // Load messages when connected
      socket.on("load messages", (loadedMessages) => {
        setMessages(loadedMessages);
      });

      // Load current users when connected
      socket.on("current users", (currentUsers) => {
        setUsers(currentUsers);
      });
    });

    // user coming online
    socket.on("user online", (user) => {
      setUsers((prevUsers) => [
        ...new Map(
          [...prevUsers, user].map((item) => [item.username, item])
        ).values(),
      ]);
    });

    // user going offline
    socket.on("user offline", (user) => {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.username === user.username ? user : u))
      );
    });

    // new chat message
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("registration success");
      socket.off("load messages");
      socket.off("current users");
      socket.off("user online");
      socket.off("user offline");
      socket.off("chat message");
    };
  }, [username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("chat message", { content: message });
      setMessage("");
    }
  };

  return (
    <div className="chatroom">
      <aside>
        <ul>
          {users.map((user) => (
            <li key={user.username}>
              {user.username}{" "}
              <span style={{ color: user.online ? "green" : "red" }}>●</span>
            </li>
          ))}
        </ul>
      </aside>
      <main>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              {msg.username}: {msg.content}
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit">Send</button>
        </form>
      </main>
    </div>
  );
}

export default Chatroom;
