const express = require("express");
const router = express.Router();
const { Comment } = require("../models/Comment");

// comment

router.post("/saveComment", (req, res) => {
  const comment = new Comment(req.body);
  // save to DB
  comment.save((err, comment) => {
    if (err) return res.json({ success: false, err });
    // cant use populate after save
    Comment.find({ _id: comment._id })
      .populate("commentWriter")
      .exec((err, result) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, result });
      });
  });
});

router.post("/getComment", (req, res) => {
  Comment.find({ postId: req.body.videoId })
    .populate("commentWriter")
    .exec((err, comment) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, comment });
    });
});

module.exports = router;
