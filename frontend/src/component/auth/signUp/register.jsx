import React, { useState } from "react";
import styles from "./register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { clientServer } from "../../../config/clientServer";

const Register = () => {
  // login credentials state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const data = {
      name: name,
      username: username,
      email: email,
      password: password,
    };

    try {
      const res = await clientServer.post("/register", data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);

      navigate("/");
    } catch (err) {
      console.error("Error while register new user!", err.message);
    }

    console.log(data);
  };
  return (
    <div className={styles.main_container}>
      <div className={styles.nav_logo}>ApnaGPT</div>
      <div className={styles.container}>
        <div className={styles.container_nav}>
          <h1>Create an account</h1>
          <p>Welcome to apnaGPT</p>
        </div>

        <div className={styles.container_body}>
          <div className={styles.container_name_input}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
            />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Username"
            />
          </div>

          <div className={styles.container_Login_input}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
          </div>

          <button onClick={handleRegister}>Submit</button>
        </div>

        <div className={styles.container_foot}>
          <span>
            Already have an account? <Link>Login</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
