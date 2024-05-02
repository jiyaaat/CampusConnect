const express = require("express");
const multer = require("multer");
const cors = require("cors");
const auth = require("./routes/auth");
const userprofile = require("./routes/userprofile");
const matching = require("./routes/matching");
const messaging = require("./routes/messaging");
const blockreport = require("./routes/blockreport");
const verification = require("./routes/verification");
const suggestions = require("./routes/suggestions");
const cron = require("node-cron");
const db = require("./db");

const upload = multer();

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(upload.none());

const verificationTask = cron.schedule("*/10 * * * * *", async () => {
  try {
    await db.query(
      "DELETE FROM verification WHERE created_at < NOW() - INTERVAL '10 minutes';"
    );
    console.log("Expired verification records deleted.");
  } catch (error) {
    console.error("Error occurred during verification records cleanup.", error);
  }
});

verificationTask.start();

const passwordResetTask = cron.schedule("*/10 * * * * *", async () => {
  try {
    await db.query(
      "DELETE FROM PasswordReset WHERE created_at < NOW() - INTERVAL '10 minutes';"
    );
    console.log("Expired password reset records deleted.");
  } catch (error) {
    console.error(
      "Error occurred during password reset records cleanup.",
      error
    );
  }
});

passwordResetTask.start();

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});

app.use("/auth", auth);
app.use("/userprofile", userprofile);
app.use("/matching", matching);
app.use("/messaging", messaging);
app.use("/blockreport", blockreport);
app.use("/verification", verification);
app.use("/suggestions", suggestions);
