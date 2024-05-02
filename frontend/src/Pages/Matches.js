import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { backendUrl } from "../exports";
import Match from "../Components/Match";

const Matches = () => {
  const [matchedUserIds, setMatchedUserIds] = useState([]);
  const userId = parseInt(localStorage.getItem("userId"), 10);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(`${backendUrl}matching?userId=${userId}`);
        const data = await response.json();
        const matches = data.matches;

        const matchedIds = matches.reduce((acc, match) => {
          if (match.sender_id !== userId)
            acc.push(parseInt(match.sender_id, 10));
          if (match.receiver_id !== userId)
            acc.push(parseInt(match.receiver_id, 10));
          return acc;
        }, []);

        const uniqueMatchedIds = [...new Set(matchedIds)];

        const index = uniqueMatchedIds.indexOf(userId);
        if (index !== -1) {
          uniqueMatchedIds.splice(index, 1);
        }

        setMatchedUserIds(uniqueMatchedIds);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, [userId]);

  return (
    <>
      <Navbar />
      <div className="matches">
        <div className="matches-container">
          <h2>Matches</h2>
          <div className="matches-list">
            {matchedUserIds.length > 0 ? (
              matchedUserIds.map((user) => <Match key={user} user={user} />)
            ) : (
              <p>No matches found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Matches;
