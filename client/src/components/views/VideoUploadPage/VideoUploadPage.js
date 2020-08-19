import React, { useState } from "react";
import { Typography, Button, Form, message, Input, Icon } from "antd";
import Dropzone from "react-dropzone";
import Axios from "axios";
import { useSelector } from "react-redux";

const { Title } = Typography;
const { TextArea } = Input;
const PrivateOptions = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];
const CategoryOptions = [
  { value: 0, label: "Blog" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets and Animal" },
  { value: 4, label: "Film & Animation" },
];

function VideoUploadPage(props) {
  const user = useSelector((state) => state.user);
  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  //private =0 , public=1
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState("Blog");
  const [FilePath, setFilePath] = useState("");
  const [ThumbnailPath, setThumbnailPath] = useState("");
  const [Duration, setDuration] = useState("");

  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value);
  };
  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  };
  const onPrivateChange = (e) => {
    setPrivate(e.currentTarget.value);
  };
  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value);
  };

  //file in paramater = info of file
  const onDrop = (file) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", file[0]);
    Axios.post("/api/video/uploadfiles", formData, config).then((response) => {
      if (response.data.success) {
        // console.log(response.data);

        let variable = {
          url: response.data.url,
          fileName: response.data.fileName,
        };

        setFilePath(response.data.url);

        Axios.post("/api/video/thumbnail", variable).then((response) => {
          if (response.data.success) {
            // console.log(response.data);
            setDuration(response.data.fileDuration);
            setThumbnailPath(response.data.url);
          } else {
            alert("failed to make thumbnail");
          }
        });
      } else {
        alert("failed to upload video file");
      }
    });
  };

  //submit
  const onSubmit = (e) => {
    const variable = {
      // user from redux
      videoWriter: user.userData._id,
      title: VideoTitle,
      description: Description,
      privacy: Private,
      filePath: FilePath,
      category: Category,
      duration: Duration,
      thumbnail: ThumbnailPath,
    };
    e.preventDefault();

    Axios.post("/api/video/uploadVideo", variable).then((response) => {
      if (response.data.success) {
        // console.log(response.data);
        message.success("you successfully uploaded video");
        // after 3nds, go to landingpage
        setTimeout(() => {
          props.history.push("/");
        }, 3000);
      } else {
        alert("failed to upload the video");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* video upload */}
          <Dropzone onDrop={onDrop} multiple={false} maxSize={10000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: "3rem" }} />
              </div>
            )}
          </Dropzone>
          {/* thumbnail */}
          {ThumbnailPath && (
            <div>
              <img
                src={`http://localhost:5000/${ThumbnailPath}`}
                alt="thunmbnail"
              />
            </div>
          )}
        </div>
        <br />
        <br />
        <label>Title</label>
        <Input onChange={onTitleChange} value={VideoTitle}></Input>
        <br />
        <br />

        <label>Description</label>
        <TextArea onChange={onDescriptionChange} value={Description}></TextArea>

        <br />
        <br />

        <select onChange={onPrivateChange}>
          {PrivateOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <select onChange={onCategoryChange}>
          {CategoryOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
