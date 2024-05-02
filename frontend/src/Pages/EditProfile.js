import React, { useState, useEffect } from "react";
import { backendUrl } from "../exports";
import Navbar from "../Components/Navbar";
import ImageUpload from "../Components/ImageUpload";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const EditProfile = () => {
  const [bio, setBio] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [interest, setInterest] = useState("");
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${backendUrl}userprofile/profile?userId=${userId}`
        );
        const data = await response.json();
        const userProfile = data.userProfile;
        setBio(userProfile.bio || "");
        setAge(userProfile.age || "");
        setGender(userProfile.gender || "");
        setLocation(userProfile.location || "");
        setInterests(userProfile.interests || []);
        setImageUrl(userProfile.image_url || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!interests.length) {
      setError("Please add at least one interest");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("bio", bio);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("location", location);
      interests.forEach((interest) => {
        formData.append("interests", interest);
      });
      formData.append("imageUrl", imageUrl || "");

      const response = await fetch(`${backendUrl}userprofile/update`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        window.location.href = "/profile";
      } else {
        console.error("Edit profile failed:", response.statusText);
      }
    } catch (error) {
      console.error("Edit profile error:", error);
    }
  };

  const handleAddInterest = () => {
    if (interest.trim() === "") {
      setError("Interest cannot be empty");
      return;
    }

    setInterests([...interests, interest]);
    setInterest("");
    setError("");
  };

  return (
    <>
      <Navbar />
      <div className="edit-profile">
        
        <h2>Edit Profile</h2>
        <div className="first">
        <ImageUpload setPublicId={setImageUrl} publicId={imageUrl} />
        {imageUrl && (
          <img src={imageUrl} alt="Uploaded" className="imageedit" style={{ maxWidth: "100%" }} />
        )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Interest</label>
            <input
              type="text"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            />
            <button type="button" onClick={handleAddInterest}>
              Add
            </button>
            {error && <p className="error">{error}</p>}
          </div>
          {interests.length > 0 && (
            <div className="interests-container">
              {interests.map((interest, index) => (
                <div key={index} className="interest">
                  <span>{interest}</span>
                  <button
                    type="button" className="cross"
                    onClick={() =>
                      setInterests(interests.filter((_, i) => i !== index))
                    }
                  >
                    <FontAwesomeIcon icon={faTimes} /> {/* Cross icon */}
                  </button>
                </div>
              ))}
            </div>
          )}
          <button type="submit" onClick={handleSubmit}>
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
