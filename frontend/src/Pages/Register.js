import React, { useState } from "react";
import { Link } from "react-router-dom";
import { backendUrl } from "../exports";
import TokenVerification from "../Hooks/TokenVerification";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const { isLoading, isLoggedIn } = TokenVerification();

  if (isLoggedIn) {
    window.location.href = "/";
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSendVerification = async () => {
    try {
      const response = await fetch(`${backendUrl}verification/sendverify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccessMessage("Verification email sent successfully");
        setError("");
        setVerificationSent(true);
      } else {
        const data = await response.json();
        setError(data.error);
        setSuccessMessage("");
        setVerificationSent(false);
      }
    } catch (error) {
      console.error("Error sending verification:", error);
      setError("An error occurred while sending verification email");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await fetch(`${backendUrl}verification/checkverify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      if (response.ok) {
        await handleRegister();
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setError("An error occurred while verifying code");
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(`${backendUrl}auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        setSuccessMessage("Registration successful");
        setError("");
      } else {
        const data = await response.json();
        setError(data.error);
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred while registering");
    }
  };

  return (
    <div className="auth">
      <h2>Register</h2>
      {!verificationSent ? (
        <>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <button type="button" onClick={handleSendVerification}>
            Send Verification Code
          </button>
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
        </>
      ) : (
        <>
          <div className="form-group">
            <label>Verification Code</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter verification code"
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
          <button type="button" onClick={handleVerifyCode}>
            Verify Code & Register
          </button>
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
        </>
      )}
      <div>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
