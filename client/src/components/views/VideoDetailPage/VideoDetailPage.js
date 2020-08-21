import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import Axios from "axios";
import SideVideo from "./Section/SideVideo";
import Subscribe from "./Section/Subscribe";

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;
  var variable = {
    videoId: videoId,
  };

  const [VideoDetail, setVideoDetail] = useState([]);

  useEffect(() => {
    Axios.post("/api/video/getVideoDetail", variable).then((response) => {
      if (response.data.success) {
        setVideoDetail(response.data.videoDetail);
      } else {
        alert("failed to get the video");
      }
    });
  }, []);

  if (VideoDetail.videoWriter) {
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
            <List.Item
              actions={[
                <Subscribe
                  userTo={VideoDetail.videoWriter._id}
                  userFrom={localStorage.getItem("userId")}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={VideoDetail.videoWriter.image} />}
                title={VideoDetail.videoWriter.name}
                description={VideoDetail.description}
              ></List.Item.Meta>
            </List.Item>
            {/* comment */}
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
