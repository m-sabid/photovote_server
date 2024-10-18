const express = require("express");
const Mark = require("../models/markModel");
const router = express.Router();

// Submit marks for a user
router.post("/", async (req, res) => {
  const { userID, userName, marks } = req.body;

  try {
    // Check if the user has already submitted marks
    const existingMark = await Mark.findOne({ userID });
    if (existingMark) {
      return res.status(400).json({ message: "Marks already submitted." });
    }

    const newMark = new Mark({ userID, userName, marks });
    await newMark.save();

    res.status(201).json(newMark);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all marks for a user
router.get("/:userID", async (req, res) => {

  const { userID } = req.params;
  
  try {
    const userMarks = await Mark.findOne({ userID });
    if (!userMarks) {
      return res.status(404).json({ message: "Marks not found." });
    }
    res.status(200).json(userMarks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all marks and return imageName with total marks normalized to 10 for each image
router.get("/", async (req, res) => {
  try {
    // Fetch all marks data from the database
    const allMarks = await Mark.find({});

    if (allMarks.length === 0) {
      return res.status(404).json({ message: "No marks found in the database." });
    }

    // Create a dictionary to store total marks and count for each image
    const imageMarks = {};

    allMarks.forEach(user => {
      user.marks.forEach(image => {
        const { imageName, marks } = image;

        // If imageName exists, add marks and increment count, otherwise initialize
        if (imageMarks[imageName]) {
          imageMarks[imageName].total += marks;
          imageMarks[imageName].count += 1;
        } else {
          imageMarks[imageName] = { total: marks, count: 1 };
        }
      });
    });

    // Convert the dictionary to an array of objects with imageName and marks normalized to 10
    const result = Object.keys(imageMarks).map(imageName => {
      const { total, count } = imageMarks[imageName];

      // Calculate average marks and convert it to a scale out of 10
      const normalizedMarks = (total / count);

      return {
        imageName,
        marksOutOf10: Math.floor(Math.min(normalizedMarks, 10)) // Using Math.floor() to get whole numbers
      };
    });


    // Return the result
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});



module.exports = router;