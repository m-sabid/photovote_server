const mongoose = require("mongoose");

// POTM Image Schema
const potmImageSchema = new mongoose.Schema({
  imageName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: String,
    default: "sabid77", // Default uploader
  },
}, { timestamps: true });

// Gallery Image Schema
const galleryImageSchema = new mongoose.Schema({
  imageName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: String,
    default: "sabid77", // Default uploader
  },
  selectedType: {
    type: String,
    required: true,
  },
}, { timestamps: true });


// Awesome Click Image Schema
const awesomeClickImageSchema = new mongoose.Schema({
  imageName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: String,
    default: "sabid77", // Default uploader
  },
}, { timestamps: true });

// Favorite Image Schema
const favoriteImageSchema = new mongoose.Schema({
  imageName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: String,
    default: "sabid77", // Default uploader
  },
}, { timestamps: true });

// Create models
const POTMImage = mongoose.model("POTMImage", potmImageSchema);
const GalleryImage = mongoose.model("GalleryImage", galleryImageSchema);
const AwesomeClickImage = mongoose.model("AwesomeClickImage", awesomeClickImageSchema);
const FavoriteImage = mongoose.model("FavoriteImage", favoriteImageSchema);

// Export models
module.exports = {
  POTMImage,
  GalleryImage,
  AwesomeClickImage,
  FavoriteImage,
};
