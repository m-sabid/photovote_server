const express = require("express");
const router = express.Router();
const {
  POTMImage,
  GalleryImage,
  AwesomeClickImage,
  FavoriteImage,
} = require("../models/uploadImageModels");

// Utility function for handling uploads
const handleUpload = async (images, ImageModel) => {
    if (!Array.isArray(images) || images.length === 0) {
      throw new Error("No images provided");
    }
  
    return Promise.all(
      images.map((image) => {
        const { imageName, imageUrl, uploadedBy } = image;
        const newImageData = {
          imageName,
          imageUrl,
          uploadedBy: uploadedBy || "sabid77",
        };
  
        // Add selectedType only if the model is GalleryImage
        if (ImageModel === GalleryImage) {
          newImageData.selectedType = image.selectedType; // Include selectedType for gallery images
        }
  
        const newImage = new ImageModel(newImageData);
        return newImage.save();
      })
    );
  };
  

// CREATE: Upload POTM Images
router.post("/potm/upload", async (req, res) => {
  try {
    const savedImages = await handleUpload(req.body, POTMImage);
    res
      .status(201)
      .json({ message: "POTM images uploaded successfully", savedImages });
  } catch (error) {
    console.error("Error uploading POTM images:", error);
    res.status(500).json({ message: "Error uploading POTM images", error });
  }
});

// READ: Get all POTM Images
router.get("/potm/images", async (req, res) => {
  try {
    const images = await POTMImage.find();
    res
      .status(200)
      .json({ message: "POTM images retrieved successfully", images });
  } catch (error) {
    console.error("Error retrieving POTM images:", error);
    res.status(500).json({ message: "Error retrieving POTM images", error });
  }
});

// DELETE: Delete POTM Image
router.delete("/potm/images/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedImage = await POTMImage.findByIdAndDelete(id);
    if (!deletedImage) {
      return res.status(404).json({ message: "POTM image not found" });
    }
    res.status(200).json({ message: "POTM image deleted successfully" });
  } catch (error) {
    console.error("Error deleting POTM image:", error);
    res.status(500).json({ message: "Error deleting POTM image", error });
  }
});


// CREATE: Upload Gallery Images
router.post("/gallery/upload", async (req, res) => {
    try {
      // Ensure the incoming data includes the selectedType
      const imagesData = req.body.map(image => ({
        imageName: image.imageName,
        imageUrl: image.imageUrl,
        uploadedBy: image.uploadedBy,
        selectedType: image.selectedType, // Ensure this is included
      }));
  
      const savedImages = await handleUpload(imagesData, GalleryImage); // Make sure handleUpload can handle the new structure
      res
        .status(201)
        .json({ message: "Gallery images uploaded successfully", savedImages });
    } catch (error) {
      console.error("Error uploading Gallery images:", error);
      res.status(500).json({ message: "Error uploading Gallery images", error });
    }
  });
  

// READ: Get 18 Random Gallery Images
router.get("/gallery/images", async (req, res) => {
  try {
    // Retrieve all images from the database
    const images = await GalleryImage.find();

    // Shuffle the images array and select 18
    const shuffledImages = images.sort(() => 0.5 - Math.random()).slice(0, 18);

    // Send only 18 randomly selected images
    res.status(200).json({
      message: "18 random gallery images retrieved successfully",
      images: shuffledImages
    });
  } catch (error) {
    console.error("Error retrieving gallery images:", error);
    res.status(500).json({ message: "Error retrieving gallery images", error });
  }
});


// DELETE: Delete Gallery Image
router.delete("/gallery/images/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedImage = await GalleryImage.findByIdAndDelete(id);
    if (!deletedImage) {
      return res.status(404).json({ message: "Gallery image not found" });
    }
    res.status(200).json({ message: "Gallery image deleted successfully" });
  } catch (error) {
    console.error("Error deleting Gallery image:", error);
    res.status(500).json({ message: "Error deleting Gallery image", error });
  }
});

// CREATE: Upload Awesome Clicks
router.post("/awesome-clicks/upload", async (req, res) => {
  try {
    const savedImages = await handleUpload(req.body, AwesomeClickImage);
    res
      .status(201)
      .json({
        message: "Awesome Clicks images uploaded successfully",
        savedImages,
      });
  } catch (error) {
    console.error("Error uploading Awesome Clicks images:", error);
    res
      .status(500)
      .json({ message: "Error uploading Awesome Clicks images", error });
  }
});

// READ: Get all Awesome Click Images
router.get("/awesome-clicks/images", async (req, res) => {
  try {
    const images = await AwesomeClickImage.find();
    res
      .status(200)
      .json({ message: "Awesome Click images retrieved successfully", images });
  } catch (error) {
    console.error("Error retrieving Awesome Click images:", error);
    res
      .status(500)
      .json({ message: "Error retrieving Awesome Click images", error });
  }
});

// DELETE: Delete Awesome Click Image
router.delete("/awesome-clicks/images/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedImage = await AwesomeClickImage.findByIdAndDelete(id);
    if (!deletedImage) {
      return res.status(404).json({ message: "Awesome Click image not found" });
    }
    res
      .status(200)
      .json({ message: "Awesome Click image deleted successfully" });
  } catch (error) {
    console.error("Error deleting Awesome Click image:", error);
    res
      .status(500)
      .json({ message: "Error deleting Awesome Click image", error });
  }
});

// CREATE: Upload People's Favorite
router.post("/favorite/upload", async (req, res) => {
  try {
    const savedImages = await handleUpload(req.body, FavoriteImage);
    res
      .status(201)
      .json({ message: "Favorite images uploaded successfully", savedImages });
  } catch (error) {
    console.error("Error uploading Favorite images:", error);
    res.status(500).json({ message: "Error uploading Favorite images", error });
  }
});

// READ: Get all Favorite Images
router.get("/favorite/images", async (req, res) => {
  try {
    const images = await FavoriteImage.find();
    res
      .status(200)
      .json({ message: "Favorite images retrieved successfully", images });
  } catch (error) {
    console.error("Error retrieving Favorite images:", error);
    res
      .status(500)
      .json({ message: "Error retrieving Favorite images", error });
  }
});

// DELETE: Delete Favorite Image
router.delete("/favorite/images/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedImage = await FavoriteImage.findByIdAndDelete(id);
    if (!deletedImage) {
      return res.status(404).json({ message: "Favorite image not found" });
    }
    res.status(200).json({ message: "Favorite image deleted successfully" });
  } catch (error) {
    console.error("Error deleting Favorite image:", error);
    res.status(500).json({ message: "Error deleting Favorite image", error });
  }
});

module.exports = router;