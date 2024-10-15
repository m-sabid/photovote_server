const mongoose = require("mongoose");

// Define the Image schema
const imageSchema = new mongoose.Schema({
  imageName: { type: String, required: true }, // Name of the image
  imageUrl: { type: String, required: true }, // URL of the image
  uploadedBy: { type: String, required: true, default: "sabid77" }, // User ID of the uploader
  uploadedAt: { type: Date, default: Date.now }, // Date when the image was uploaded
});

// Export the model
module.exports = mongoose.model("Image", imageSchema);
