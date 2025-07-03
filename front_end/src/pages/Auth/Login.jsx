// src/pages/Auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Chart from "../../Chart.jsx";   // adjust if your path is different
import API from "../../utils/api";

const Login = () => {
  const navigate = useNavigate();          // ✅ get the navigate function

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed. Please check your credentials.");
    }
  };

  const goToSignUp = () => navigate("/signup");   // ✅ programmatic nav

  return (
    <div className="login-wrapper">
      {/* ───── Left side ───── */}
      <div className="login-left">
        <h1 className="logo">Spendora</h1>

        <div className="login-form">
          <h2>Welcome Back</h2>
          <p>Please enter your details to log in</p>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <label>Email Address</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password */}
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 Characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <span
                className="toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <button type="submit" className="login-btn">LOGIN</button>
          </form>

          <p className="signup-text">
            Don't have an account?{" "}
            <span
              onClick={goToSignUp}
              style={{ color: "#7b2cbf", cursor: "pointer" }}
            >
              SignUp
            </span>
          </p>
        </div>
      </div>

      {/* ───── Right side ───── */}
      <div className="login-right">
        <div className="stats-box">
          <h4>Track Your Income &amp; Expenses</h4>
          <h2>₹430,000</h2>
        </div>

        <div className="chart-box">
          <h4>All Transactions</h4>
          <p>2nd Jan to 21th Dec</p>
          <Chart />
        </div>
      </div>
    </div>
  );
};

export default Login;
