const db = require("../db");

const notifications = async (req, res) => {
  const { userId } = req.query;

  try {
    const likedUsers = await db.query(
      "SELECT u.name, up.image_url FROM swipes s INNER JOIN users u ON s.sender_id = u.id INNER JOIN userprofile up ON u.id = up.userid WHERE s.receiver_id = $1 AND s.event = 'like'",
      [userId]
    );

    res.status(200).json({ likedUsers: likedUsers.rows });
  } catch (error) {
    console.error("Error fetching liked users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMatches = async (req, res) => {
  const { userId } = req.query;

  try {
    const matches = await db.query(
      "SELECT * FROM matches WHERE sender_id = $1 OR receiver_id = $1",
      [userId]
    );

    res.status(200).json({ matches: matches.rows });
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const swipe = async (req, res) => {
  const { userId } = req.query;
  const { receiverId, action } = req.body;

  if (action !== "like" && action !== "dislike") {
    return res.status(400).json({ error: "Invalid action" });
  }

  try {
    await db.query(
      "INSERT INTO swipes (sender_id, receiver_id, event) VALUES ($1, $2, $3)",
      [userId, receiverId, action]
    );

    if (action === "like") {
      const likeSwipe = await db.query(
        "SELECT * FROM swipes WHERE sender_id = $1 AND receiver_id = $2 AND event = 'like'",
        [receiverId, userId]
      );

      if (likeSwipe.rows.length > 0) {
        await db.query(
          "INSERT INTO matches (sender_id, receiver_id, event) VALUES ($1, $2, 'like')",
          [receiverId, userId]
        );
      }
    }

    res.status(200).json({ message: `${action} action recorded successfully` });
  } catch (error) {
    console.error(`Error recording ${action} action:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getMatches, swipe, notifications };
