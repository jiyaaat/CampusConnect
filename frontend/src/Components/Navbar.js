import React, { useState } from "react";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      window.location.href = `/search/${searchTerm}`;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar-test">
      <a href="/" id="logo">
        CampusConnect
      </a>
      <div className="items">
        <a href="/" className="nav-link">
          Home
        </a>
        <a href="/matches" className="nav-link">
          Matches
        </a>
        <a href="/profile" className="nav-link">
          Profile
        </a>
        <a href="/notifications" className="nav-link">
          Notifications
        </a>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search interests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="nav-link" onClick={handleSearch}>
            Search
          </button>
        </div>
        <button className="nav-link" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
