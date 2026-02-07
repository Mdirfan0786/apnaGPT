import React, { useState } from "react";
import styles from "./register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { clientServer } from "../../../config/clientServer";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !username || !email || !password) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await clientServer.post("/register", {
        name,
        username,
        email,
        password,
      });

      // if backend sends token on register
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("name", res.data.user.name);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.main_container}>
      <div className={styles.nav_logo}>ApnaGPT</div>

      <div className={styles.container}>
        <div className={styles.container_nav}>
          <h1>Create an account</h1>
          <p>
            Get started with <b>apnaGPT</b>
          </p>
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

          <button onClick={handleRegister} disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </div>

        <div className={styles.container_foot}>
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
