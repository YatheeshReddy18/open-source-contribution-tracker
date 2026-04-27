import React, { useState } from "react";
import { FaGithub, FaRocket } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Login.css"; 

function Signup() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleGithubSignup = () => {
    setLoading(true);
    setTimeout(() => {
      window.open("http://localhost:5000/auth/github", "_self");
    }, 1000);
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setErrorMsg("");
    setLoading(true);
    try {
      await API.post("/api/auth/register", { name, email, password });
      navigate("/");
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Registration failed. Try again.");
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
        
        <h1 className="login-title">Create Account</h1>
        <p className="login-subtitle">
          Join Open Source Tracker to analyze your coding journey.
        </p>

        {errorMsg && <p style={{ color: "#ef4444", marginBottom: "16px", fontSize: "14px" }}>{errorMsg}</p>}

        <form className="auth-form" onSubmit={handleEmailSignup}>
          <input 
            type="text" 
            className="auth-input" 
            placeholder="Full Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
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
             {loading ? <div className="login-loader" style={{margin: "0 auto"}}></div> : "Sign Up"}
          </button>
        </form>

        <div className="auth-divider">OR</div>

        <button 
          className="login-button" 
          onClick={handleGithubSignup}
          type="button"
          disabled={loading}
        >
          <FaGithub className="login-github-icon" />
          <span>Sign up with GitHub</span>
        </button>
        
        <Link to="/" className="auth-link">
          Already have an account? <span>Log in</span>
        </Link>
      </div>
    </div>
  );
}

export default Signup;
