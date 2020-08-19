const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = mongoose.Schema(
  {
    videoWriter: {
      // bring all user info from User
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    privacy: {
      type: Number,
    },
    filePath: {
      type: String,
    },
    category: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    // generate time
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", VideoSchema);

module.exports = { Video };
