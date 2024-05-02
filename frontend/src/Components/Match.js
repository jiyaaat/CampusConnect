import React, { useState, useEffect } from "react";
import { backendUrl } from "../exports";
import { Link } from "react-router-dom";

const Match = ({ user }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `${backendUrl}userprofile/profile?userId=${user}`
        );
        const data = await response.json();
        setUserName(data.userProfile.name);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [user]);

  return (
    <Link to={`/chat/${user}`} className="match">
      {userName}
    </Link>
  );
};

export default Match;
