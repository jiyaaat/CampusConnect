import React from "react";

const Card = ({ user, onSwipe }) => {
  const handleLike = () => {
    onSwipe(user.id, "like");
  };

  const handleDislike = () => {
    onSwipe(user.id, "dislike");
  };

  return (
    <div className="user-card">
      <div className="user-info">
        <img src={user.image_url} alt="" />
        <h3 className="user-name">{user.name}</h3>
        <p className="user-age">{user.age} years old</p>
        <p className="user-gender">Gender: {user.gender}</p>
        <p className="user-location">Location: {user.location}</p>
        <p className="user-bio">{user.bio}</p>
        <p className="user-interests">Interests: {user.interests.join(", ")}</p>
      </div>
      <div className="user-actions">
        <button className="dislike-btn" onClick={handleDislike}>
          Dislike
        </button>
        <button className="like-btn" onClick={handleLike}>
          Like
        </button>
      </div>
    </div>
  );
};

export default Card;
