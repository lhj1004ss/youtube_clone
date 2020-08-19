import React, { useEffect, useState } from "react";
import { Card, Icon, Avatar, Col, Typography, Row } from "antd";
import Axios from "axios";
import moment from "moment";

const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {
  const [Video, setVideo] = useState([]);
  useEffect(() => {
    Axios.get("/api/video/getVideo").then((response) => {
      if (response.data.success) {
        console.log(response.data);
        setVideo(response.data.videos);
      } else {
        alert("failed to get the videos");
      }
    });
  }, []);

  const renderCard = Video.map((item, index) => {
    //   duration is second
    var minutes = Math.floor(item.duration / 60);
    var seconds = Math.floor(item.duration - minutes * 60);

    return (
      <Col lg={6} md={8} xs={24}>
        {/* link to each video */}
        <a href={`video/${item._id}`}>
          <div style={{ position: "relative" }}>
            <img
              style={{ width: "100%" }}
              src={`http://localhost:5000/${item.thumbnail}`}
            />
            <span
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                margin: "4px",
                opacity: "0.8",
                letterSpacing: "0.5px",
                fontSize: "15px",
                fontWeight: "500",
                background: "black",
                color: "white",
              }}
            >
              {minutes}:{seconds}
            </span>
          </div>
        </a>
        <br />
        <Meta
          avatar={<Avatar src={item.videoWriter.image} />}
          title={item.title}
          description=""
        />
        <span style={{ textTransform: "capitalize" }}>
          {item.videoWriter.name}
        </span>
        <br />
        <span style={{ marginLeft: "3rem" }}>{item.views} views</span>
        &nbsp;&nbsp;
        <span>{moment(item.createAt).format("MMM Do YY")}</span>
      </Col>
    );
  });
  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <Title level={2}>Recomended</Title>
      <hr />
      <Row gutter={[32, 16]}>{renderCard}</Row>
    </div>
  );
}

export default LandingPage;
