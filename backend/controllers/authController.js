const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("../nodemailer");
require("dotenv").config();

const generateRandomToken = () => {
  const tokenLength = 10;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < tokenLength; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const mailOptions = {
    from: process.env.MAIL_ID,
    to: email,
    subject: "Password Reset",
    text: `Your password reset token is: ${resetToken}. This will expire in 10 mins.`,
  };

  try {
    await nodemailer.sendMail(mailOptions);
    console.log(`Password reset email sent to: ${email}`);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await db.query(
      "SELECT * FROM Users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.query(
      "INSERT INTO Users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
      [name, email, hashedPassword]
    );

    const userId = newUser.rows[0].id;

    await db.query(
      "INSERT INTO UserProfile (userid, bio, age, gender, location, interests) VALUES ($1, $2, $3, $4, $5, $6)",
      [userId, "", null, "", "", []]
    );

    const token = jwt.sign({ email, userId }, process.env.SECRET_KEY);

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.query(
      "SELECT id, password FROM Users WHERE email = $1",
      [email]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const { id, password: hashedPassword } = user.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ email, userId: id }, process.env.SECRET_KEY);

    res.status(200).json({ message: "Login successful", userId: id, token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await db.query("SELECT * FROM Users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = generateRandomToken();

    await db.query(
      "INSERT INTO PasswordReset (email, reset_token, created_at) VALUES ($1, $2, NOW())",
      [email, resetToken]
    );

    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error initiating password reset:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const resetTokenData = await db.query(
      "SELECT * FROM PasswordReset WHERE reset_token = $1 ORDER BY created_at DESC LIMIT 1",
      [token]
    );
    if (resetTokenData.rows.length === 0) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const email = resetTokenData.rows[0].email;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE Users SET password = $1 WHERE email = $2", [
      hashedPassword,
      email,
    ]);

    await db.query("DELETE FROM PasswordReset WHERE reset_token = $1", [token]);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const verifyToken = (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    res.status(200).json({ message: "Token is valid", decoded });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyToken,
};
