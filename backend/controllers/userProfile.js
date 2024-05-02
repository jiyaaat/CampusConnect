const db = require("../db");

const getUserProfile = async (req, res) => {
  const { userId } = req.query;

  try {
    const userProfile = await db.query(
      "SELECT userprofile.*, users.name FROM userprofile JOIN users ON userprofile.userid = users.id WHERE userprofile.userid = $1",
      [userId]
    );

    if (userProfile.rows.length === 0) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.status(200).json({ userProfile: userProfile.rows[0] });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUserProfile = async (req, res) => {
  const { bio, age, gender, location, interests, userId, imageUrl } = req.body;

  try {
    let interestsArray = Array.isArray(interests) ? interests : [interests];

    await db.query(
      "UPDATE userprofile SET bio = $1, age = $2, gender = $3, location = $4, interests = $5, image_url = $6 WHERE userid = $7",
      [bio, age, gender, location, interestsArray, imageUrl, userId]
    );

    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const checkProfile = async (req, res) => {
  const { userId } = req.query;

  try {
    const userProfile = await db.query(
      "SELECT * FROM userprofile WHERE userid = $1",
      [userId]
    );

    if (userProfile.rows.length === 0) {
      return res.status(404).json({ error: "User profile not found" });
    }

    const profile = userProfile.rows[0];

    if (
      !profile.bio ||
      !profile.age ||
      !profile.gender ||
      !profile.location ||
      !profile.interests ||
      !profile.image_url
    ) {
      return res.status(200).json(false);
    }

    res.status(200).json(true);
  } catch (error) {
    console.error("Error checking profile completeness:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getUserProfile, updateUserProfile, checkProfile };
