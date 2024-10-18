const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const marksRoutes = require("./routes/marks");
const potmImageRoutes = require("./routes/potmImages");
const uploadImages = require("./routes/handelUploads");
const User = require("./models/User");

const app = express();

// Connect to MongoDB (updated)
mongoose
  .connect(
    "mongodb+srv://photoOfTheCentury:photoOfTheCenturySS24@cluster0.smucr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  )
  .then(async () => {
    console.log("MongoDB connected");

    // Drop the index on the email field if it exists
    try {
      await User.collection.dropIndex('email_1');
      console.log('Dropped index on email field');
    } catch (err) {
      if (err.code === 27) {
        console.log('Index not found, skipping drop');
      } else {
        console.error('Error dropping index:', err);
      }
    }
  })
  .catch((err) => console.log("MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/potmimages", potmImageRoutes);
app.use("/api/uploadimages", uploadImages); 

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));