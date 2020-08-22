import React, { useState } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import { useSelector } from "react-redux";
import Axios from "axios";

function SingleComment(props) {
  const [OpenReply, setOpenReply] = useState(false);
  const [CommentValue, setCommentValue] = useState("");
  const user = useSelector((state) => state.user);

  const onClickReplyOpen = () => {
    setOpenReply(!OpenReply);
  };

  const onHandleChange = (e) => {
    setCommentValue(e.currentTarget.value);
  };

  const onSubmit = (e) => {
    const variable = {
      content: CommentValue,
      commentWriter: user.userData._id,
      postId: props.postId,
      // get all comment info from DB for response to
      responseTo: props.comment._id,
    };
    e.preventDefault();

    Axios.post("/api/comment/saveComment", variable).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        setCommentValue("");
        setOpenReply(false);
        props.refreshFunction(response.data.result);
      } else {
        alert("failed to save comment");
      }
    });
  };

  const actions = [
    <span onClick={onClickReplyOpen} key="comment-basic-re-reply-to">
      Reply to
    </span>,
  ];
  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.commentWriter.name}
        avatar={<Avatar src={props.comment.commentWriter.image} alt />}
        content={<p>{props.comment.content}</p>}
      ></Comment>

      {OpenReply && (
        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <textarea
            style={{ width: "100%", borderRadius: "5px", marginRight: "1rem" }}
            onChange={onHandleChange}
            value={CommentValue}
            placeholder="Please write your comment"
          ></textarea>
          <br />
          <button
            style={{
              width: "20%",
              height: "52px",
              background: "lightgray",
              color: "white",
              borderRadius: "5px",
            }}
            onClick={onSubmit}
          >
            Reply
          </button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
