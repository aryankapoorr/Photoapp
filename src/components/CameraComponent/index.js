import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { Button, Box, IconButton, Stack } from "@mui/material";
import { PhotoCamera, FlipCameraAndroid } from "@mui/icons-material";
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
            color="primary"
            fullWidth
            onClick={() => setImageSrc(null)}
          >
            Retake
          </Button>
        </Box>
      ) : useNativeCamera ? (
        <Box>
          <label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleNativeFileChange}
              className="fileInput"
            />
            <Button variant="contained" color="primary" component="span">
              Launch Camera
            </Button>
          </label>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => setUseNativeCamera(false)}
            style={{ marginTop: "20px" }}
          >
            Switch to Web Camera
          </Button>
        </Box>
      ) : (
        <Box className="cameraView">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="webcam"
          />
          <Stack direction="row" spacing={2} className="buttonContainer">
            <IconButton
              color="secondary"
              onClick={handleSwitchCamera}
              className="switchButton"
            >
              <FlipCameraAndroid fontSize="large" />
            </IconButton>
            <IconButton
              color="primary"
              onClick={handleInAppCapture}
              className="captureButton"
            >
              <PhotoCamera fontSize="large" />
            </IconButton>
          </Stack>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => setUseNativeCamera(true)}
            style={{ marginTop: "20px" }}
          >
            Use Camera App
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CameraComponent;
