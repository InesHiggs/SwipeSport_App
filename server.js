const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("firebase-admin");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

//Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json"); // Download this from Firebase Console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id.firebaseio.com",
});

app.post("/register", authMiddleware, async (req, res) => {
    try {
      const { email, skillLevel, sport } = req.body;
  
      // Save user profile in Firestore
      await db.collection("users").doc(req.user.uid).set({
        email,
        skillLevel,
        sport,
        createdAt: new Date(),
      });
  
      res.json({ message: "User registered successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Failed to register user" });
    }
  });

// Middleware: Protect Routes with Firebase Authentication
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user data to the request
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

// Test Route
app.get("/", (req, res) => {
  res.send("Express + Firebase Backend Running!");
});

// Protected Route: Get Logged-In User Data
app.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: `Hello, ${req.user.email}`, userId: req.user.uid });
});

// API: Create a Sports Match
const db = admin.firestore();

app.post("/create-match", authMiddleware, async (req, res) => {
  try {
    const matchData = {
      sport: req.body.sport,
      skillLevel: req.body.skillLevel,
      timeSlot: req.body.timeSlot,
      createdBy: req.user.uid,
      createdAt: new Date(),
    };

    const matchRef = await db.collection("matches").add(matchData);
    res.json({ message: "Match created!", matchId: matchRef.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create match" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
