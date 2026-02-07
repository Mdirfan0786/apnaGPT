import { BrowserRouter, Routes, Route } from "react-router-dom";
import { v1 as uuidv1 } from "uuid";
import { useEffect, useState } from "react";

import ChatWindow from "./component/chatwindow/chatWindow";
import Sidebar from "./component/sidebar/sidebar";
import Register from "./component/auth/signUp/register";
import Login from "./component/auth/sign/login";
import { MyContext } from "./myContext";
import styles from "./App.module.css";
import ProtectedRoute from "./component/auth/protectedRoute/protected";

function ChatLayout() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currentThreadId, setCurrentThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [refreshThreads, setRefreshThreads] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("name"));
  }, []);

  return (
    <div className={styles.appContainer}>
      <MyContext.Provider
        value={{
          prompt,
          setPrompt,
          reply,
          setReply,
          currentThreadId,
          setCurrentThreadId,
          newChat,
          setNewChat,
          prevChats,
          setPrevChats,
          allThreads,
          setAllThreads,
          refreshThreads,
          setRefreshThreads,
          isSidebarOpen,
          setIsSidebarOpen,
          name,
          setName,
        }}
      >
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ChatLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
