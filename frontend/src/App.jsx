import styles from "./App.module.css";
import ChatWindow from "./component/chatwindow/chatWindow";
import Sidebar from "./component/sidebar/sidebar";
import { MyContext } from "./myContext";

function App() {
  const providerValues = "";
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
