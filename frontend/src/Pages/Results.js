import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { backendUrl } from "../exports";
import Navbar from "../Components/Navbar";

const Results = () => {
  const { searchTerm } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(
          `${backendUrl}suggestions/search?term=${searchTerm}`
        );
        const data = await response.json();
        setResults(data.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setLoading(false);
      }
    };
    fetchResults();
  }, [searchTerm]);

  const handleSwipe = async (receiverId, action) => {
    // Implement like/dislike logic here
    try {
      const response = await fetch(
        `${backendUrl}matching/swipe?userId=${localStorage.getItem(
          "userId"
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ receiverId, action }),
        }
      );

      if (response.ok) {
        // Update the results list based on the action
        const updatedResults = results.filter((user) => user.id !== receiverId);
        setResults(updatedResults);
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
      <div className="results-page">
        <h2>Search Results for "{searchTerm}"</h2>
        {loading ? (
          <p>Loading...</p>
        ) : results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <div className="results-container">
            {results.map((result) => (
              <div key={result.id} className="result-item">
                <img src={result.image_url} alt="" />
                <h3>{result.user_name}</h3>
                <p>{result.bio}</p>
                <p>Age: {result.age}</p>
                <p>Gender: {result.gender}</p>
                <p>Location: {result.location}</p>
                <p>Interests: {result.interests.join(", ")}</p>
                {/* Like button */}
                <div className="btns">
                <button className='like-btn'onClick={() => handleSwipe(result.id, "like")}>
                  Like
                </button>
                {/* Dislike button */}
                <button className='dislike-btn'onClick={() => handleSwipe(result.id, "dislike")}>
                  Dislike
                </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Results;
