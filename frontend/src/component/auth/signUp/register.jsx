import React from "react";
import styles from "./register.module.css";

const Register = () => {
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
            <input type="text" placeholder="Name" />
            <input type="text" placeholder="Username" />
          </div>

          <div className={styles.container_Login_input}>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
          </div>

          <button>Submit</button>
        </div>

        <div className={styles.container_foot}>
          <span>Already have an account? Login</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
