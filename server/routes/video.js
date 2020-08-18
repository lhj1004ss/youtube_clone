const express = require("express");
const router = express.Router();
// const { Video } = require("../models/Video");
const multer = require("multer");
const { auth } = require("../middleware/auth");

// multer configuration
let storage = multer.diskStorage({
  // save the file to uploads directory
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // only video
    if (ext !== ".mp4") {
      return cb(res.status(400).end("only VIDEO(.mp4) is allowed"), false);
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage }).single("file");

//Video
router.post("/uploadfiles", (req, res) => {
  // save the video from client by using multer
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    } else {
      return res.json({
        success: true,
        url: res.req.file.path,
        fileName: res.req.file.filename,
      });
    }
  });
});

module.exports = router;
