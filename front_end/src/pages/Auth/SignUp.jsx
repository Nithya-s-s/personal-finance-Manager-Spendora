import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/register", { fullName, email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Signup failed. Please check your details."
      );
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.logo}>Spendora</h1>
        <h2>Create an Account</h2>
        <p style={styles.subtitle}>Join us today by entering your details below.</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.col}>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="John"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.col}>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>
          </div>
          <label>Password</label>
          <input
            type="password"
            placeholder="Min 8 Characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            style={styles.input}
          />
          {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
          <button type="submit" style={styles.button}>SIGN UP</button>
        </form>
        <p style={styles.footerText}>
          Already have an account? <a href="/login" style={styles.link}>Login</a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f4f0ff",
    padding: "1rem",
  },
  card: {
    background: "white",
    padding: "2.5rem 3rem",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 0 30px rgba(0, 0, 0, 0.05)",
    textAlign: "center",
  },
  logo: {
    color: "#7b2cbf",
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  subtitle: {
    color: "#666",
    marginBottom: "1.5rem",
  },
  avatarWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1.5rem",
  },
  avatarPlaceholder: {
    position: "relative",
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "#eee4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  avatarIcon: {
    fontSize: "2rem",
    color: "#7b2cbf",
  },
  avatarPlus: {
    position: "absolute",
    bottom: "6px",
    right: "6px",
    background: "#7b2cbf",
    color: "#fff",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
  },
  form: {
    textAlign: "left",
  },
  row: {
    display: "flex",
    gap: "1rem",
  },
  col: {
    flex: 1,
  },
  input: {
    width: "100%",
    padding: "0.7rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "1rem",
    marginTop: "0.3rem",
  },
  button: {
    marginTop: "1.5rem",
    width: "100%",
    padding: "0.75rem",
    background: "#7b2cbf",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  footerText: {
    marginTop: "1rem",
    fontSize: "0.9rem",
  },
  link: {
    color: "#7b2cbf",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default SignUp;
