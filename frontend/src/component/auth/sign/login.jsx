import { useState } from "react";
import styles from "./login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { clientServer } from "../../../config/clientServer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await clientServer.post("/login", {
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.name);

      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.main_container}>
      <div className={styles.nav_logo}>ApnaGPT</div>
      <div className={styles.container}>
        <div className={styles.container_nav}>
          <h1>Welcome back 👋</h1>
          <p>
            Good to see you again on <b>apnaGPT</b>
          </p>
        </div>

        <div className={styles.container_body}>
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

          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <div className={styles.container_foot}>
          <span>
            Don't have an account? <Link to={"/register"}> Sign up</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
