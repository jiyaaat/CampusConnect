import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { backendUrl } from "../exports";
import Navbar from "../Components/Navbar";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${backendUrl}userprofile/profile?userId=${userId}`
        );
        const data = await response.json();
        setProfile(data.userProfile);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  return (
    <>
      <Navbar />
      <div className="profile">
        <h2>Profile</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          profile && (
            <div className="profile-details">
              <img src={profile.image_url} alt="" />
              <p>Name: {profile.name}</p>
              <p>Age: {profile.age}</p>
              <p>Gender: {profile.gender}</p>
              <p>Location: {profile.location}</p>
              <p>Bio: {profile.bio}</p>
              <p>Interests: {profile.interests.join(", ")}</p>
              <Link to="/edit-profile">Edit Profile</Link>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default Profile;
