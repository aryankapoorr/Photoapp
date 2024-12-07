import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

const CameraComponent = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment", // Use "user" for front camera
  };

  const handleCapture = () => {
    const image = webcamRef.current.getScreenshot();
    setImageSrc(image);
    setIsCameraOpen(false);
  };

  return (
    <div style={styles.container}>
      {isCameraOpen ? (
        <div style={styles.cameraView}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={styles.webcam}
          />
          <button style={styles.captureButton} onClick={handleCapture}>
            Capture
          </button>
        </div>
      ) : (
        <div>
          {imageSrc ? (
            <div>
              <img src={imageSrc} alt="Captured" style={styles.imagePreview} />
            </div>
          ) : (
            <button style={styles.cameraButton} onClick={() => setIsCameraOpen(true)}>
              📷
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100%",
    backgroundColor: "#f5f5f5",
  },
  cameraButton: {
    fontSize: "2rem",
    border: "none",
    background: "none",
    cursor: "pointer",
  },
  cameraView: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  webcam: {
    width: "100%",
    maxWidth: "400px",
    height: "auto",
  },
  captureButton: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  imagePreview: {
    width: "100%",
    maxWidth: "300px",
    height: "auto",
    marginTop: "10px",
    borderRadius: "10px",
  },
};

export default CameraComponent;
