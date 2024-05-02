import React, { useState, useEffect } from "react";
import { backendUrl } from "../exports";
import Navbar from "../Components/Navbar";

const Notif = () => {
  const [likedUsers, setLikedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedUsers = async () => {
      try {
        const response = await fetch(
          `${backendUrl}matching/notifications?userId=${localStorage.getItem(
            "userId"
          )}`
        );
        const data = await response.json();
        setLikedUsers(data.likedUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching liked users:", error);
        setLoading(false);
      }
    };

    fetchLikedUsers();
  }, []);

  return (
    <>
      <Navbar />
      <div className="notif-page">
        <h2>Notifications</h2>
        {loading ? (
          <p>Loading...</p>
        ) : likedUsers.length === 0 ? (
          <p>No notifications found.</p>
        ) : (
          <ul>
            {likedUsers.map((user) => (
              <li key={user.id}>
                <img src={user.image_url} className='user-image' alt={user.name} />
                <span className="name">{user.name} liked you</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Notif;
