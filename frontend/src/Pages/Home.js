import React, { useState, useEffect } from "react";
import { backendUrl } from "../exports";
import Card from "../Components/Card";
import Navbar from "../Components/Navbar";

const Home = () => {
  const [suggestions, setSuggestions] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(
          `${backendUrl}suggestions?userId=${userId}`
        );
        const data = await response.json();
        setSuggestions(data.suggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    fetchSuggestions();
  }, [userId]);

  const handleSwipe = async (receiverId, action) => {
    try {
      const response = await fetch(
        `${backendUrl}matching/swipe?userId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ receiverId, action }),
        }
      );

      if (response.ok) {
        const updatedSuggestions = suggestions.filter(
          (user) => user.id !== receiverId
        );
        setSuggestions(updatedSuggestions);
      } else {
        console.error("Swipe action failed:", response.statusText);
      }
    } catch (error) {
      console.error("Swipe action error:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="home">
        <h2>Suggestions</h2>
        <div className="user-card-container">
          {suggestions && suggestions.length > 0 ? (
            suggestions.map((user) => (
              <Card key={user.id} user={user} onSwipe={handleSwipe} />
            ))
          ) : (
            <p>No suggestions</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
