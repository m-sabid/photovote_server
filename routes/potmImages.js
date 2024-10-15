const express = require("express");
const Image = require("../models/potmImageModel"); // Adjust the path as necessary
const router = express.Router();
const Marks = require("../models/markModel")
const MonthlyContest = require("../models/monthlyContestModel");

// CREATE: Route to handle multiple image uploads
router.post("/upload", async (req, res) => {
  const images = req.body; // Expect an array of images

  if (!Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ message: "No images provided" });
  }

  try {
    // Use Promise.all to save all images in parallel
    const savedImages = await Promise.all(
      images.map((image) => {
        const { imageName, imageUrl, uploadedBy } = image;

        // Create a new image document for each image in the array
        const potmImage = new Image({
          imageName,
          imageUrl,
          uploadedBy: uploadedBy || "sabid77", // Default to sabid77 if not provided
        });

        // Save the image to the database
        return potmImage.save();
      })
    );

    // Respond with the saved images
    res.status(201).json({ message: "Images uploaded successfully", savedImages });
  } catch (error) {
    console.error("Error saving images:", error);
    res.status(500).json({ message: "Error uploading images", error });
  }
});

// READ: Route to get all images or filter by image name or uploader
router.get("/potm-images", async (req, res) => {
  try {
    const { imageName, uploadedBy } = req.query;

    // Create a filter object based on the query parameters
    const filter = {};
    if (imageName) filter.imageName = imageName;
    if (uploadedBy) filter.uploadedBy = uploadedBy;

    // Fetch images from the database based on the filter
    const images = await Image.find(filter);

    if (images.length === 0) {
      return res.status(404).json({ message: "No images found" });
    }

    // Respond with the found images
    res.status(200).json({ message: "Images retrieved successfully", images });
  } catch (error) {
    console.error("Error retrieving images:", error);
    res.status(500).json({ message: "Error retrieving images", error });
  }
});

// UPDATE: Route to update a specific image by ID
router.put("/images/:id", async (req, res) => {
  const { id } = req.params;
  const { imageName, imageUrl, uploadedBy } = req.body;

  try {
    // Find the image by ID and update it
    const updatedImage = await Image.findByIdAndUpdate(
      id,
      { imageName, imageUrl, uploadedBy },
      { new: true, runValidators: true }
    );

    if (!updatedImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Respond with the updated image
    res.status(200).json({ message: "Image updated successfully", updatedImage });
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).json({ message: "Error updating image", error });
  }
});

// DELETE: Route to delete an image by ID
router.delete("/images/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the image by ID and delete it
    const deletedImage = await Image.findByIdAndDelete(id);

    if (!deletedImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Error deleting image", error });
  }
});


router.post("/voting-done", async (req, res) => {
  const { monthName } = req.body;

  if (!monthName) {
    return res.status(400).json({ message: "Month name is required." });
  }

  try {
    const marksData = await Marks.find(); // Get all users' marks

    if (!marksData || marksData.length === 0) {
      return res.status(404).json({ message: "No marks found to process." });
    }

    const imagesArray = await Image.find(); // Get all images

    if (!imagesArray || imagesArray.length === 0) {
      return res.status(404).json({ message: "No images found to process." });
    }

    const monthlyContestData = {
      monthName,
      imageInfo: [], // Adjusted to match the new schema
    };

    // Calculate total points for each image
    imagesArray.forEach((image) => {
      let totalPoints = 0;

      // Loop through each user's marks to find marks for this image
      marksData.forEach((userMarks) => {
        // Look for the marks entry for the current image in the user's marks array
        const imageMark = userMarks.marks.find(
          (mark) => mark.imageName === image.imageName
        );

        if (imageMark) {
          totalPoints += imageMark.marks; // Add the image marks to the total
        }
      });

      // Ensure all required fields are present and valid before pushing data
      if (image.imageName && image.imageUrl && totalPoints > 0) {
        monthlyContestData.imageInfo.push({
          imageName: image.imageName,
          imageUrl: image.imageUrl,
          totalPoints,
          uploadedBy: image.uploadedBy, 
          uploadedAt: image.uploadedAt,
        });
      } else {
        console.warn("Invalid data found for image:", {
          imageName: image.imageName,
          imageUrl: image.imageUrl,
          totalPoints,
        });
      }
    });

    // Debugging: Log the data before saving
    console.log("Monthly Contest Data: ", monthlyContestData);

    // Validate if we have valid data to save
    if (monthlyContestData.imageInfo.length === 0) {
      return res.status(404).json({ message: "No valid images or marks to process." });
    }

    // Save the monthly contest data to the collection
    await MonthlyContest.create(monthlyContestData);

    // Remove the marks from the current `Marks` collection
    await Marks.deleteMany({});

    // Remove all images from the Image collection
    await Image.deleteMany({}); // Deletes all images after processing

    // Respond with success message
    res.status(200).json({ message: "Marks moved to monthly contest and deleted successfully", monthlyContestData });
  } catch (error) {
    console.error("Error in moving and deleting marks:", error);
    res.status(500).json({ message: "Error processing the marks", error });
  }
});



module.exports = router;
