import React, { useContext, useEffect, useState } from "react";
import styles from "./chatWindow.module.css";
import Chat from "../chat/chat.jsx";
import { MyContext } from "../../myContext.jsx";
import { clientServer } from "../../config/clientServer.jsx";
import { ScaleLoader } from "react-spinners";

const ChatWindow = () => {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currentThreadId,
    setCurrentThreadId,
    prevChats,
    setPrevChats,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);

  // sending request to API
  const getReply = async () => {
    setLoading(true);
    try {
      const response = await clientServer.post("/chat", {
        message: prompt,
        threadId: currentThreadId,
      });
      console.log(response.data.reply);
      setReply(response.data.reply);
    } catch (err) {
      console.error(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!prompt || !reply) return;

    setPrevChats((prev) => [
      ...prev,
      { role: "User", content: prompt },
      { role: "assistant", content: reply },
    ]);

    setPrompt("");
  }, [reply]);

  return (
    <div className={styles.chatWindow_Container}>
      {/* Chat Window Nav */}
      <div className={styles.chatWindow_nav}>
        <div className={styles.chatWindow_nav_left}>
          <span className={styles.navLogo}>
            ApnaGPT
            <span className={styles.dropDown}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </span>
          </span>
        </div>

        <div className={styles.chatWindow_nav_right}>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Chat Window Main */}
      <div className={styles.chatWindow_body}>
        <Chat></Chat>

        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <ScaleLoader color="#fff" />
          </div>
        )}
      </div>

      {/* Chat Window Nav */}
      <div className={styles.chatWindow_foot}>
        <div className={styles.inputBox}>
          <input
            type="text"
            placeholder="Ask Anything!"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          />

          <div onClick={getReply} className={styles.submit}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <p className={styles.info}>
          ApnaGPT can make mistakes. Check important info. See Cookie
          Preferences.
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
