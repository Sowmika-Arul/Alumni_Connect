// Required packages
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// MongoDB Atlas connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // Hashed password
  isVerified: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true,
  logger: true,
});

// Route: Signup
app.post("/signup", async (req, res) => {
  try {
    const { name, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const user = new User({ name, email });
    await user.save();

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const verificationLink = `https://alumni-connect-5ad6.onrender.com/verify-email/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Verify your email",
      html: `<p>Hi ${name},</p>
             <p>Please verify your email by clicking the link below:</p>
             <a href="${verificationLink}">Verify Email</a>`,
    });

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Error in /signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route: Verify Email
app.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // If already verified, skip saving again
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    // Redirect to the frontend password setting route
    res.redirect(`https://alumni-connect-5ad6.onrender.com/set-password?email=${email}`);
  } catch (error) {
    console.error("Error in /verify-email:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// Route: Set Password
app.post("/set-password", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password set successfully. You can now login." });
  } catch (error) {
    console.error("Error in /set-password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route: Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified) return res.status(400).json({ message: "Please verify your email first" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error in /login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
