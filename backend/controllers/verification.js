const db = require("../db");
const nodemailer = require("../nodemailer");

const sendVerificationEmail = async (to, verificationCode) => {
  const mailOptions = {
    from: process.env.MAIL_ID,
    to: to,
    subject: "Email Verification",
    text: `Your verification code is: ${verificationCode}. This will expire in 10 mins.`,
  };

  try {
    await nodemailer.sendMail(mailOptions);
    console.log(`Verification email sent to: ${to}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

const sendVerify = async (req, res) => {
  const { email } = req.body;

  try {
    const verificationCode = generateVerificationCode();
    await db.query("INSERT INTO verification (email, code) VALUES ($1, $2)", [
      email,
      verificationCode,
    ]);

    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: "Verification email sent successfully" });
  } catch (error) {
    console.error("Error sending verification email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { sendVerify };

const checkVerify = async (req, res) => {
  const { email, code } = req.body;

  try {
    const data = await db.query(
      "SELECT * FROM verification WHERE email = $1 AND code = $2",
      [email, code]
    );

    const verificationRecord = data.rows[0];

    if (!verificationRecord) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    await db.query("DELETE FROM verification WHERE email = $1", [email]);

    res.status(200).json({ message: "Email verification successful" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { sendVerify, checkVerify };
