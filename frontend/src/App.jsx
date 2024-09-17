import Login from "./pages/Login";
import ChatRoom from "./pages/ChatRoom";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/chatroom" element={<ChatRoom />} />
    </Routes>
  );
};

export default App;
