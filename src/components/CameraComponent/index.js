import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { Button, Box, IconButton, Stack } from "@mui/material";
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
        <Box>
          <Button
            variant="contained"
            className="pastelButton"
            onClick={() => document.getElementById("file-input").click()}
          >
            Choose File
          </Button>

          <input
            type="file"
            id="file-input"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleNativeFileChange}
          />

          {!useNativeCamera && (
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
                  className="iconButton"
                  onClick={handleSwitchCamera}
                >
                  <Loop className="icon" />
                </IconButton>
                <IconButton
                  className="iconButton primaryIcon"
                  onClick={handleInAppCapture}
                >
                  <CameraAlt className="icon" />
                </IconButton>
              </Stack>
            </Box>
          )}

          {useNativeCamera && (
            <Button
              variant="outlined"
              className="pastelButtonOutline"
              fullWidth
              onClick={() => setUseNativeCamera(false)}
              style={{ marginTop: "20px" }}
            >
              Switch to Web Camera
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CameraComponent;
