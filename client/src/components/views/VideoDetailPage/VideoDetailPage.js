import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import Axios from "axios";
import SideVideo from "./Section/SideVideo";
import Subscribe from "./Section/Subscribe";
import Comments from "./Section/Comments";

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;
  const variable = {
    videoId: videoId,
  };

  const [VideoDetail, setVideoDetail] = useState([]);
  const [Comment, setComment] = useState([]);

  useEffect(() => {
    Axios.post("/api/video/getVideoDetail", variable).then((response) => {
      // console.log(response.data.success);
      if (response.data.success) {
        setVideoDetail(response.data.videoDetail);
      } else {
        alert("failed to get the video");
      }
    });

    Axios.post("/api/comment/getComment", variable).then((response) => {
      if (response.data.success) {
        setComment(response.data.comment);
        console.log(response.data.comment);
      } else {
        alert("failed to get comment information");
      }
    });
  }, []);

  const refreshFunction = (newComment) => {
    setComment(Comment.concat(newComment));
  };

  if (VideoDetail.videoWriter) {
    const subscribeBtn = VideoDetail.videoWriter._id !==
      localStorage.getItem("userId") && (
      <Subscribe
        userTo={VideoDetail.videoWriter._id}
        userFrom={localStorage.getItem("userId")}
      />
    );

    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          {/* main video */}
          <div style={{ width: "100%", padding: "3rem 4rem" }}>
            <video
              style={{ width: "100%" }}
              src={`http://localhost:5000/${VideoDetail.filePath}`}
              controls
            />
            {/* video info */}
            {/* subscriber */}
            <List.Item actions={[subscribeBtn]}>
              <List.Item.Meta
                avatar={<Avatar src={VideoDetail.videoWriter.image} />}
                title={VideoDetail.videoWriter.name}
                description={VideoDetail.description}
              ></List.Item.Meta>
            </List.Item>
            {/* comment */}
            <Comments
              refreshFunction={refreshFunction}
              commentList={Comment}
              postId={videoId}
            />
          </div>
        </Col>
        <Col lg={6} xs={24}>
          {/* side video */}
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default VideoDetailPage;
