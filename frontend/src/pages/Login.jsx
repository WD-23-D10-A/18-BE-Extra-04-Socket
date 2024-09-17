import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const Login = () => {
  const [username, setUsername] = useState("");
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("registration success", (user) => {
      console.log("activated");
      navigate("/chatroom", { state: { username: user.username } });
    });

    newSocket.on("registration failed", (message) => {
      alert(message);
      console.log(message);
    });

    return () => newSocket.close();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    socket.emit("register", username);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">UserName: </label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Enter Chat</button>
      </form>
    </div>
  );
};

export default Login;
