const mongoose = require("mongoose");

const markSchema = new mongoose.Schema({
  userID: { type: String, required: true }, // Store user's unique ID
  userName: { type: String, required: true }, // Store user's name
  marks: [
    {
      imageName: { type: String, required: true },
      imageUrl: { type: String, required: true },
      marks: { type: Number, required: true, min: 0, max: 10 }, // Individual marks for each image
    },
  ],
});

module.exports = mongoose.model("Mark", markSchema);
