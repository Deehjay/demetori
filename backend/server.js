const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const mongoose = require("mongoose");
const Members = require("./models/Members");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = process.env.SECRET_KEY;
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("[Database] Connected to MongoDB Atlas"))
  .catch((err) => console.error("[Database] Connection Error:", err));

mongoose.connection.on("error", (err) => {
  console.error("[Database] Error occurred:", err);
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach decoded user info to request
    next(); // Call next middleware or route handler
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Health route
app.get("/health", async (req, res) => {
  try {
    await mongoose.connection.db.command({ ping: 1 });
    res.status(200).json({ message: "Database connection is healthy" });
  } catch (error) {
    res.status(500).json({ message: "Database connection error", error });
  }
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const storedUsername = process.env.APP_USERNAME;
  const storedPassword = process.env.APP_PASSWORD;

  if (username !== storedUsername || password !== storedPassword) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Create a JWT token
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// Protected route - Example
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}` });
});

// GET Endpoint for retrieving all members (Protected)
app.get("/api/members", authenticateToken, async (req, res) => {
  try {
    const members = await Members.find({});
    res.status(200).json(members);
  } catch (error) {
    console.error("[API Error] Failed to fetch members:", error);
    res.status(500).json({ message: "Failed to retrieve members" });
  }
});

// POST Endpoint for updating groups (Protected)
app.post(
  "/api/members/update-member-group",
  authenticateToken,
  async (req, res) => {
    const { memberId, groupName } = req.body;

    if (!memberId || !groupName) {
      return res
        .status(400)
        .json({ error: "Member ID and Group Name are required" });
    }

    try {
      const updatedMember = await Members.findOneAndUpdate(
        { memberId }, // Use memberId instead of _id
        { group: groupName },
        { new: true } // Return the updated document
      );

      if (!updatedMember) {
        return res.status(404).json({ error: "Member not found" });
      }

      res.json(updatedMember);
    } catch (error) {
      console.error("Error updating member group:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[Server] Running on port ${PORT}`));
