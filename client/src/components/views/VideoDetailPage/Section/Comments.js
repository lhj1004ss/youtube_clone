import React, { useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";

function Comment(props) {
  const [CommentValue, setCommentValue] = useState("");
  const user = useSelector((state) => state.user);
  const videoId = props.postId;

  const handleClick = (e) => {
    setCommentValue(e.currentTarget.value);
  };

  const onSubmit = (e) => {
    const variable = {
      content: CommentValue,
      commentWriter: user.userData._id,
      postId: videoId,
    };
    e.preventDefault();

    Axios.post("/api/comment/saveComment", variable).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        setCommentValue("");
        props.refreshFunction(response.data.result);
      } else {
        alert("failed to save comment");
      }
    });
  };

  return (
    <div>
      <br />
      <p>Replies</p>
      <hr />
      {/* comment list (single comment) */}

      {props.commentList &&
        props.commentList.map(
          (comment, index) =>
            !comment.responseTo && (
              <React.Fragment>
                <SingleComment
                  key={index}
                  refreshFunction={props.refreshFunction}
                  comment={comment}
                  postId={videoId}
                />
                <ReplyComment
                  postId={videoId}
                  parentCommentId={comment._id}
                  commentList={props.commentList}
                  refreshFunction={props.refreshFunction}
                />
              </React.Fragment>
            )
        )}

      {/* root cooment  */}
      <form style={{ display: "flex" }} onSubmit={onSubmit}>
        <textarea
          style={{ width: "100%", borderRadius: "5px", marginRight: "1rem" }}
          onChange={handleClick}
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
    </div>
  );
}

export default Comment;
