const db = require("../db");

const getSuggestions = async (req, res) => {
  const { userId } = req.query;

  try {
    const query = `
      SELECT u.id, u.name, up.bio, up.age, up.gender, up.location, up.interests, up.image_url
      FROM users u
      LEFT JOIN UserProfile up ON u.id = up.userid
      WHERE u.id != $1
      AND u.id NOT IN (
        SELECT receiver_id FROM swipes WHERE sender_id = $1
      )
      AND u.id NOT IN (
        SELECT sender_id FROM matches WHERE receiver_id = $1
      )
      LIMIT 10;
    `;

    const { rows } = await db.query(query, [userId]);

    res.status(200).json({ suggestions: rows });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const search = async (req, res) => {
  const { term } = req.query;

  try {
    const query = `
SELECT up.*, u.name as user_name
      FROM userprofile up
      JOIN users u ON up.userId = u.id
      WHERE $1 = ANY(up.interests) OR EXISTS (
        SELECT 1
        FROM unnest(up.interests) AS i
        WHERE i ILIKE $2
      );
    `;

    const { rows } = await db.query(query, [term, `%${term}%`]);
    res.status(200).json({ results: rows });
  } catch (error) {
    console.error("Error searching profiles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getSuggestions, search };