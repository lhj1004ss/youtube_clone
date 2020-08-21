import React, { useEffect, useState } from "react";
import Axios from "axios";

function SideVideo() {
  const [SideVideo, setSideVideo] = useState([]);

  useEffect(() => {
    Axios.get("/api/video/getVideo").then((response) => {
      if (response.data.success) {
        console.log(response.data);
        setSideVideo(response.data.videos);
      } else {
        alert("failed to get the side videos");
      }
    });
  }, []);

  const RenderSideVideo = SideVideo.map((item, index) => {
    var minutes = Math.floor(item.duration / 60);
    var seconds = Math.floor(item.duration - minutes * 60);

    return (
      <div
        key={index}
        style={{ display: "flex", marginBottom: "1rem", padding: "0 2rem" }}
      >
        <div
          style={{ width: "40%", marginBottom: "1rem", marginRight: "1rem" }}
        >
          <a href>
            <img
              style={{ width: "100%", height: "100%" }}
              src={`http://localhost:5000/${item.thumbnail}`}
              alt="thumbnail"
            />
          </a>
        </div>

        <div style={{ width: "50%" }}>
          <a href style={{ color: "gray" }}>
            <span style={{ fontSize: "1.25rem", color: "black" }}>
              {item.title}
            </span>
            <br />
            <span style={{ textTransform: "capitalize" }}>
              {item.videoWriter.name}
            </span>{" "}
            <br />
            <span>{item.views} views</span> <br />
            <span>
              {minutes} : {seconds}
            </span>
          </a>
        </div>
      </div>
    );
  });

  return (
    <React.Fragment>
      <div style={{ marginTop: "3rem" }}></div>
      {RenderSideVideo}
    </React.Fragment>
  );
}

export default SideVideo;
