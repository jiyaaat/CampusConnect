const db = require("../db");

const getMessages = async (req, res) => {
  const { userId, receiverId } = req.query;

  try {
    const messages = await db.query(
      "SELECT * FROM chat WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)",
      [userId, receiverId]
    );

    res.status(200).json({ messages: messages.rows });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendMessage = async (req, res) => {
  const { userId, receiverId, content } = req.body;

  try {
    await db.query(
      "INSERT INTO chat (sender_id, receiver_id, content) VALUES ($1, $2, $3)",
      [userId, receiverId, content]
    );

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getMessages, sendMessage };
