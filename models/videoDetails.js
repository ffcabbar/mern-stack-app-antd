const mongoose = require("mongoose");

const uploadSchema = mongoose.Schema({
  upload_title: { type: String, required: true },
  video_path: { type: String, required: true },
  thumbnail_path: { type: String, required: true },
  upload_date: { type: Date, required: true }
});

module.exports = mongoose.model("Upload", uploadSchema);
