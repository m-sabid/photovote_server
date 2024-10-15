const mongoose = require("mongoose");

const monthlyContestSchema = new mongoose.Schema({
  monthName: { type: String, required: true }, // Month name
  imageInfo: [
    {
      imageName: { type: String, required: true },
      imageUrl: { type: String, required: true },
      totalPoints: { type: Number, required: true },
      uploadedBy: { type: String, required: true, default: "sabid77" }, // User ID of the uploader
      uploadedAt: { type: Date, default: Date.now }, // Date when the image was uploaded
    },
  ],
});

const MonthlyContest = mongoose.model("MonthlyContest", monthlyContestSchema);

module.exports = MonthlyContest;
