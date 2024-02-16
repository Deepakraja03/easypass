const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const admin = require("firebase-admin");
const app = express();
const PORT = process.env.PORT || 5000;

// Firebase Admin SDK initialization
const serviceAccount = require("../ticket2-b1147-firebase-adminsdk-93xxm-5626a22e27.json"); // Update with your service account key path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ticket2-b1147-default-rtdb.firebaseio.com/" // Update with your database URL
});

// Connect to MongoDB
mongoose.connect("mongodb+srv://manikandan05082003:Manicdon07%40@cluster0.scriurb.mongodb.net/Ticket2", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

const eventSchema = new mongoose.Schema({
  name: String,
  location: String,
  totalTickets: Number,
  price: Number,
  date: Date,
  time: String,
  image: Buffer,
  contentType: String,
  hostedBy: String,
  bookedBy: [String],
});

// Create Mongoose model
const Event = mongoose.model("Event", eventSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

const verifyToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const idToken = authorizationHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.userEmail = decodedToken.email;
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Multer storage configuration
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage, limits: { fileSize: 25 * 1024 * 1024 } });

// Route to host an event
app.post("/api/host", verifyToken, upload.single("image"), async (req, res) => {
  const { name, location, totalTickets, price, date, time } = req.body;
  const email = req.userEmail;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const { buffer, mimetype } = req.file;
    const newEvent = new Event({
      name,
      location,
      totalTickets: parseInt(totalTickets),
      price: parseInt(price),
      date: date ? new Date(date) : null,
      time,
      imageURL: "",
      hostedBy: email, // Set the hostedBy field to the user's email
    });

    await newEvent.save();

    res.status(201).json({ message: "Event hosted successfully" });
  } catch (error) {
    console.error("Error hosting event:", error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
});

// Route to fetch all events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find();
    if (!events) {
      return res.status(404).json({ error: "No events found" });
    }
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Route to fetch a specific event by ID
app.get("/api/events/:id", async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to book a ticket for an event
app.post("/api/events/book/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ error: "User email is required" });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.bookedBy.includes(userEmail)) {
      return res.status(400).json({ error: "You have already booked a ticket for this event" });
    }

    if (event.totalTickets <= 0) {
      return res.status(400).json({ error: "No available tickets" });
    }

    event.bookedBy.push(userEmail);
    event.totalTickets -= 1;
    await event.save();

    res.status(200).json({ message: "Ticket booked successfully" });
  } catch (error) {
    console.error("Error booking tickets:", error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
