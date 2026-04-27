import React, { useState } from "react";
import { FaGithub, FaRocket } from "react-icons/fa";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./Login.css";

function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleGithubLogin = () => {
    setLoading(true);
    setTimeout(() => {
      window.open("http://localhost:5000/auth/github", "_self");
    }, 1000);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setErrorMsg("");
    setLoading(true);
    try {
      await API.post("/api/auth/login", { email, password });
      window.location.href = "/dashboard";
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Invalid credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg-elements">
        <div className="login-orb orb-1"></div>
        <div className="login-orb orb-2"></div>
        <div className="login-orb orb-3"></div>
      </div>

      <div className="login-card">
        <div className="login-icon-wrapper">
          <FaRocket />
        </div>
        
        <h1 className="login-title">Open Source Tracker</h1>
        <p className="login-subtitle">
          Track, analyze, and grow your coding journey.
        </p>

        {errorMsg && <p style={{ color: "#ef4444", marginBottom: "16px", fontSize: "14px" }}>{errorMsg}</p>}

        <form className="auth-form" onSubmit={handleEmailLogin}>
          <input 
            type="email" 
            className="auth-input" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input 
            type="password" 
            className="auth-input" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" className="primary-btn" disabled={loading}>
             {loading ? <div className="login-loader" style={{margin: "0 auto"}}></div> : "Sign In"}
          </button>
        </form>

        <div className="auth-divider">OR</div>

        <button 
          className="login-button" 
          onClick={handleGithubLogin}
          type="button"
          disabled={loading}
        >
          <FaGithub className="login-github-icon" />
          <span>Continue with GitHub</span>
        </button>
        
        <Link to="/signup" className="auth-link">
          Don't have an account? <span>Sign up</span>
        </Link>
      </div>
    </div>
  );
}

export default Login;