// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from "./Pages/Loading"; // Import the Loading component
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";
import Matches from "./Pages/Matches";
import Chat from "./Pages/Chat";
import Results from "./Pages/Results";
import Notif from "./Pages/Notif";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2000); // Simulate loading for 2 seconds
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Router>
      {loading ? (
        <Loading /> // Show loading animation while loading
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/chat/:chatId" element={<Chat />} />
          <Route path="/search/:searchTerm" element={<Results />} />
          <Route path="/notifications" element={<Notif />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
