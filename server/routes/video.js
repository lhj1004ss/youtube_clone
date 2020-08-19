const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");
const multer = require("multer");
const { auth } = require("../middleware/auth");
var ffmpeg = require("fluent-ffmpeg");
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

//upload files
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

//submit video
router.post("/uploadVideo", (req, res) => {
  const video = new Video(req.body);
  // save all info about video to DB

  video.save((err, doc) => {
    console.log(err);
    if (err) return res.json({ success: false, err });

    return res.status(200).json({ success: true });
  });
});

//display video to frontend
router.get("/getVideo", (req, res) => {
  //  get videos from DB and send them to client
  Video.find()
    .populate("videoWriter")
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, videos });
    });
});

//video detail
router.post("/getVideoDetail", (req, res) => {
  Video.findOne({ _id: req.body.videoId })
    .populate("videoWriter")
    .exec((err, videoDetail) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, videoDetail });
    });
});

//thumbnail
router.post("/thumbnail", (req, res) => {
  let filePath = "";
  let fileDuration = "";

  //runtime or duration of the video
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);

    fileDuration = metadata.format.duration;
  });

  //make thumbnail
  ffmpeg(req.body.url)
    .on("filenames", function (filenames) {
      console.log("Will generate " + filenames.join(", "));
      console.log(filenames);
      filePath = "uploads/thumbnails/" + filenames[0];
    })
    .on("end", function () {
      console.log("Screenshots taken");
      return res.json({
        success: true,
        url: filePath,
        fileDuration: fileDuration,
      });
    })
    .on("error", function (err) {
      console.err(err);
      return res.json({ success: false, err });
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 3,
      folder: "uploads/thumbnails",
      size: "320x240",
      // %b input basename ( filename w/o extension )
      filename: "thumbnail-%b.png",
    });
});

module.exports = router;
