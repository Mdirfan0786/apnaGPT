import React, { useContext, useEffect, useState } from "react";
import styles from "./chat.module.css";
import { MyContext } from "../../myContext";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import ReactMarkdown from "react-markdown";

const Chat = () => {
  const { prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (!prevChats.length || reply === null) {
      setLatestReply(null);
      return;
    }

    const content = reply.split(" ");
    let idx = 0;

    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));
      idx++;

      if (idx >= content.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [prevChats, reply]);

  if (!prevChats.length) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <h2>Start a new chat!</h2>
      </div>
    );
  }

  return (
    <div className={styles.chats}>
      {prevChats.slice(0, -1).map((chat, index) => (
        <div
          key={index}
          className={chat.role === "user" ? styles.userDiv : styles.gptDiv}
        >
          <div
            className={
              chat.role === "user" ? styles.user_message : styles.gpt_message
            }
          >
            {chat.role === "assistant" ? (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            ) : (
              chat.content
            )}
          </div>
        </div>
      ))}

      {/* Typing / last message */}
      <div className={styles.gptDiv}>
        <div className={styles.gpt_message}>
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {latestReply ?? prevChats[prevChats.length - 1].content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Chat;
