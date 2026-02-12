import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./chat.module.css";
import { MyContext } from "../../myContext";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import ReactMarkdown from "react-markdown";

const Chat = () => {
  const { prevChats } = useContext(MyContext);
  const [animatedText, setAnimatedText] = useState("");

  const chatEndRef = useRef(null);
  const lastMessage = prevChats[prevChats.length - 1];

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prevChats, animatedText]);

  // Typing effect only for last assistant message
  useEffect(() => {
    if (!lastMessage || lastMessage.role !== "assistant") {
      setAnimatedText("");
      return;
    }

    const words = lastMessage.content.split(" ");
    let index = 0;

    setAnimatedText("");

    const interval = setInterval(() => {
      setAnimatedText(words.slice(0, index + 1).join(" "));
      index++;

      if (index >= words.length) {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [lastMessage]);

  if (!prevChats.length) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2>Start a new chat!</h2>
      </div>
    );
  }

  return (
    <div className={styles.chats}>
      {prevChats.map((chat, index) => {
        const isUser = chat.role === "user";
        const isLast = index === prevChats.length - 1;

        return (
          <div key={index} className={isUser ? styles.userDiv : styles.gptDiv}>
            <div className={isUser ? styles.user_message : styles.gpt_message}>
              {chat.role === "assistant" ? (
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {isLast ? animatedText : chat.content}
                </ReactMarkdown>
              ) : (
                chat.content
              )}
            </div>
          </div>
        );
      })}

      <div ref={chatEndRef} />
    </div>
  );
};

export default Chat;
