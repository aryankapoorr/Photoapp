import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { Button, Box, IconButton } from "@mui/material";
import { CameraAlt, Loop } from "@mui/icons-material";
import "./styles.css";

const CameraComponent = () => {
  const [useNativeCamera, setUseNativeCamera] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [cameraFacingMode, setCameraFacingMode] = useState("environment");
  const webcamRef = useRef(null);

  const videoConstraints = {
    facingMode: cameraFacingMode,
  };

  // Handle in-app camera capture
  const handleInAppCapture = () => {
    const image = webcamRef.current.getScreenshot();
    setImageSrc(image);
  };

  // Switch camera facing mode
  const handleSwitchCamera = () => {
    setCameraFacingMode((prev) =>
      prev === "environment" ? "user" : "environment"
    );
  };

  // Handle native camera file selection
  const handleNativeFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box className="container">
      {imageSrc ? (
        <Box className="imagePreviewContainer">
          <img src={imageSrc} alt="Captured" className="imagePreview" />
          <Button
            variant="contained"
            className="pastelButton"
            fullWidth
            onClick={() => setImageSrc(null)}
          >
            Retake
          </Button>
        </Box>
      ) : (
        <Box className="cameraView">
          {/* "Upload File" button in the top-left */}
          <Button
            variant="outlined"
            className="uploadButton"
            onClick={() => document.getElementById("file-input").click()}
          >
            upload file
          </Button>
          <input
            type="file"
            id="file-input"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleNativeFileChange}
          />

          {/* Flip camera icon in the top-right */}
          <IconButton className="flipCameraButton" onClick={handleSwitchCamera}>
            <Loop className="icon" />
          </IconButton>

          {/* Webcam frame */}
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="webcam"
          />

          {/* Camera icon centered below the frame */}
          <IconButton
            className="captureButton primaryIcon"
            onClick={handleInAppCapture}
          >
            <CameraAlt className="icon" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default CameraComponent;
