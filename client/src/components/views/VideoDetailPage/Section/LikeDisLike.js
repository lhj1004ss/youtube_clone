import React, { useEffect, useState } from "react";
import { Tooltip, Icon } from "antd";
import Axios from "axios";

function LikeDisLike(props) {
  const [Like, setLike] = useState(0);
  const [Dislike, setDislike] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DisLikeAction, setDisLikeAction] = useState(null);

  let variable = {};
  if (props.video) {
    variable = { videoId: props.videoId, userId: props.userId };
    console.log(variable);
  } else {
    variable = { commentId: props.commentId, userId: props.userId };
    console.log(variable);
  }

  useEffect(() => {
    Axios.post("/api/like/getLike", variable).then((response) => {
      if (response.data.success) {
        // how many like?
        setLike(response.data.like.length);
        // alread clicked like?
        response.data.like.map((like) => {
          if (like.userId === props.userId) {
            setLikeAction("liked");
          }
        });
      } else {
        alert("failed to get like");
      }
    });

    Axios.post("/api/like/getDislike", variable).then((response) => {
      if (response.data.success) {
        // how many dislike?
        setDislike(response.data.dislike.length);
        // already clicked dislike?
        response.data.dislike.map((dislike) => {
          if (dislike.userId === props.userId) {
            setDisLikeAction("disliked");
          }
        });
      } else {
        alert("failed to get Dislike");
      }
    });
  }, []);

  const onLike = () => {
    console.log("liked");
    // when not cliked ===null
    if (LikeAction === null) {
      Axios.post("/api/like/upLike", variable).then((response) => {
        if (response.data.success) {
          setLike(Like + 1);
          setLikeAction("liked");

          //If dislike button is already clicked

          if (DisLikeAction !== null) {
            setDisLikeAction(null);
            setDislike(Dislike - 1);
          }
        } else {
          alert("Failed to increase the like");
        }
      });
    } else {
      Axios.post("/api/like/unLike", variable).then((response) => {
        if (response.data.success) {
          setLike(Like - 1);
          setLikeAction(null);
        } else {
          alert("Failed to decrease the like");
        }
      });
    }
  };
  const onDislike = () => {
    console.log("disliked");

    if (DisLikeAction !== null) {
      Axios.post("/api/like/unDisLike", variable).then((response) => {
        if (response.data.success) {
          setDislike(Dislike - 1);
          setDisLikeAction(null);
        } else {
          alert("Failed to remove dislike");
        }
      });
    } else {
      Axios.post("/api/like/upDisLike", variable).then((response) => {
        if (response.data.success) {
          setDislike(Dislike + 1);
          setDisLikeAction("disliked");

          //If dislike button is already clicked
          if (LikeAction !== null) {
            setLikeAction(null);
            setLike(Like - 1);
          }
        } else {
          alert("Failed to increase dislike");
        }
      });
    }
  };

  return (
    <React.Fragment>
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <Icon
            type="like"
            theme={LikeAction === "liked" ? "filled" : "outlined"}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}>{Like}</span>
      </span>
      &nbsp;&nbsp;
      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
          <Icon
            type="dislike"
            theme={DisLikeAction === "disliked" ? "filled" : "outlined"}
            onClick={onDislike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}>{Dislike}</span>
      </span>
    </React.Fragment>
  );
}

export default LikeDisLike;
