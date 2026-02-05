import { useState } from "react";
import styles from "./App.module.css";
import { v1 as uuidv1 } from "uuid";
import ChatWindow from "./component/chatwindow/chatWindow";
import Sidebar from "./component/sidebar/sidebar";
import { MyContext } from "./myContext";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currentThreadId, setCurrentThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
  const [newChat, setNewChat] = useState(true);

  const providerValues = {
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
  };

  return (
    <div className={styles.appContainer}>
      <MyContext.Provider value={providerValues}>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
  );
}

export default App;
