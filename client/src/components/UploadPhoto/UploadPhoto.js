import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Progress, Divider, Button } from "antd";
import "react-toastify/dist/ReactToastify.css";
import Axios from "axios";
import "../UploadVideo/UploadVideo.css";

const UploadPhoto = () => {
  const [selectedPhotos, setSelectedPhotos] = useState(null);
  const [loaded, setLoaded] = useState(0);

  const maxSelectFile = (event) => {
    let files = event.target.files;
    if (files.length > 1) {
      toast.error("Maximum 1 file is allowed");
      event.target.value = null;
      return false;
    } else {
      let err = "";
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 52428800) {
          // 50 MB
          err += files[i].name + ", ";
        }
      }
      if (err !== "") {
        // error caught
        event.target.value = null;
        toast.error(err + " is/are too large. Please select file size < 50Mb");
      }
    }
    return true;
  };

  const fileChangeHandler = (event) => {
    const files = event.target.files;
    if (maxSelectFile(event)) {
      setSelectedPhotos(files);
      setLoaded(50);
    }
  };

  const fileUploadHandler = (event) => {
    event.preventDefault();
    const data = new FormData();
    for (let i = 0; i < selectedPhotos.length; i++) {
      data.append("file", selectedPhotos[i]);
    }
    Axios.post(
      "http://localhost:5000/api/uploadPhoto",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer",
        },
      },
      {
        onUploadProgress: (ProgressEvent) => {
          setLoaded((ProgressEvent.loaded / ProgressEvent.total) * 100);
        },
      }
    )
      .then((res) => {
        toast.success("Upload Successful");
        setLoaded(100);
      })
      .catch((err) => {
        toast.error(`Upload Fail with status: ${err.statusText}`);
      });
  };

  return (
    <>
      <h2>Upload Photo</h2>
      <Divider />

      <div className="form-group">
        <ToastContainer />
      </div>

      <form
        method="post"
        name="videoUpload"
        action="/api/upload"
        id="#"
        encType="multipart/form-data"
      >
        <div className="form-group files">
          <h4>Buradan fotoğraf yükleyebilirsiniz</h4>
          <input
            type="file"
            name="file"
            className="form-control"
            multiple="multiple"
            accept="image/*"
            onChange={fileChangeHandler}
          />
          <Progress status="active" percent={loaded} />

          <Button
            type="primary"
            htmlType="submit"
            block
            onClick={fileUploadHandler}
            style={{ marginTop: "15px" }}
          >
            Upload Photo
          </Button>
        </div>
      </form>
    </>
  );
};

export default UploadPhoto;
