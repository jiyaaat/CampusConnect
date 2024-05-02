const db = require("../db");

const blockUser = async (req, res) => {
  const { userId } = req.user;
  const { blockedUserId, reason } = req.body;

  try {
    await db.query(
      "INSERT INTO BlockedUsers (blocked_by_user_id, blocked_user_id, reason) VALUES ($1, $2, $3)",
      [userId, blockedUserId, reason]
    );

    res.status(201).json({ message: "User blocked successfully" });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const reportUser = async (req, res) => {
  const { userId } = req.user;
  const { reportedUserId, content } = req.body;

  try {
    await db.query(
      "INSERT INTO Reports (sender_id, receiver_id, content) VALUES ($1, $2, $3)",
      [userId, reportedUserId, content]
    );

    res.status(201).json({ message: "User reported successfully" });
  } catch (error) {
    console.error("Error reporting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { blockUser, reportUser };
