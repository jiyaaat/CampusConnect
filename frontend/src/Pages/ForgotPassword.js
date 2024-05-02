import React, { useState } from "react";
import { Link } from "react-router-dom";
import { backendUrl } from "../exports";
import TokenVerification from "../Hooks/TokenVerification";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resetTokenInput, setResetTokenInput] = useState(false);
  const { isLoading, isLoggedIn } = TokenVerification();

  if (isLoggedIn) {
    window.location.href = "/";
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleForgotPassword = async () => {
    try {
      const response = await fetch(`${backendUrl}auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setError("");
        setResetTokenInput(true);
      } else {
        setError(data.error);
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("An error occurred while resetting password");
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await fetch(`${backendUrl}auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setError("");
      } else {
        setError(data.error);
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("An error occurred while resetting password");
    }
  };

  return (
    <div className="auth">
      <h2>Forgot Password</h2>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      {resetTokenInput && (
        <>
          <div className="form-group">
            <label>Reset Token</label>
            <input
              type="text"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              placeholder="Enter the reset token"
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
            />
          </div>
        </>
      )}
      {successMessage && <p className="success">{successMessage}</p>}
      {!resetTokenInput && (
        <button type="button" onClick={handleForgotPassword}>
          Reset Password
        </button>
      )}
      {error && <p className="error">{error}</p>}
      {resetTokenInput && (
        <button type="button" onClick={handleResetPassword}>
          Submit New Password
        </button>
      )}
      <div>
        <p>
          Remembered your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
