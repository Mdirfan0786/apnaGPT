import React, { useContext, useEffect } from "react";
import { MyContext } from "../../myContext";
import styles from "./sidebar.module.css";
import { clientServer } from "../../config/clientServer.jsx";
import { v1 as uuidv1 } from "uuid";

const sidebar = () => {
  const {
    allThreads,
    setAllThreads,
    currentThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrentThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await clientServer.get("/threads");
      const filteredData = response.data.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (err) {
      console.log("Error while fetching threads", err.message);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currentThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrentThreadId(uuidv1());
    setPrevChats([]);
  };

  // setting Words limit
  const truncateWords = (text, limit = 5) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  // getting and changing thread
  const changeTread = async (newThreadId) => {
    setCurrentThreadId(newThreadId);

    const userId = localStorage.getItem("userId");

    try {
      const response = await clientServer.get(`/threads/${newThreadId}`, {
        userId,
      });
      console.log(response.data);
      setPrevChats(response.data);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.error("error while fetching thread", err.message);
    }
  };

  // deleting thread
  const deleteThread = async (newThreadId) => {
    setCurrentThreadId(newThreadId);

    try {
      const response = await clientServer.delete(`/threads/${newThreadId}`);

      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== newThreadId),
      );

      if (newThreadId === currentThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.error("error while deleting thread", err.message);
    }
  };

  return (
    <div className={styles.sidebarContainer}>
      {/* Sidebar Nav - rendering apnaGPT logo and new Chat */}
      <div className={styles.sidebar_nav}>
        <div className={styles.sidebar_nav_img}>
          <img src="src/assets/apnaGPT_logo.png" alt="apnaGPT_logo" />
        </div>

        <div onClick={createNewChat} className={styles.sidebar_nav_svg}>
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
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </div>
      </div>

      {/* sidebar main - rendring Chat rendering */}
      <div className={styles.sidebar_main}>
        <p
          style={{
            color: "#afafaf",
            paddingInline: "0.5rem",
            fontSize: "1rem",
          }}
        >
          Your Chats!
        </p>

        <ul className={styles.chat_history}>
          {allThreads.length === 0 ? (
            <p
              style={{
                color: "#aaa",
                padding: "0.5rem",
                fontStyle: "italic",
                fontSize: "0.8rem",
                textAlign: "center",
              }}
            >
              No chats yet
            </p>
          ) : (
            allThreads.map((thread) => (
              <li
                key={thread.threadId}
                onClick={(e) => changeTread(thread.threadId)}
              >
                <span>{truncateWords(thread.title, 5)}</span>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteThread(thread.threadId);
                  }}
                  className={styles.delete_chat}
                >
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
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* sidebar foot */}
      <div className={styles.sidebar_foot}>
        <p>By Md Irfan &hearts;</p>
      </div>
    </div>
  );
};

export default sidebar;
