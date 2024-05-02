import React, { useState } from "react";
import { Link } from "react-router-dom";
import { backendUrl } from "../exports";
import TokenVerification from "../Hooks/TokenVerification";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isLoading, isLoggedIn } = TokenVerification();

  if (isLoggedIn) {
    window.location.href = "/";
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleLogin = async () => {
    try {
      const response = await fetch(`${backendUrl}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);

        const profileResponse = await fetch(
          `${backendUrl}userprofile/check?userId=${data.userId}`
        );
        const isProfileComplete = await profileResponse.json();

        if (isProfileComplete) {
          window.location.href = "/";
        } else {
          window.location.href = "/edit-profile";
        }
      } else if (response.status === 401) {
        setError("Invalid password");
      } else if (response.status === 404) {
        setError("User not found");
      } else {
        setError("An error occurred while logging in");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred while logging in");
    }
  };

  return (
    <div className="auth">
      <h2>Login</h2>
      <form>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
      <div>
        <p>
          New User? <Link to="/register">Register</Link>
        </p>
        <p>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
