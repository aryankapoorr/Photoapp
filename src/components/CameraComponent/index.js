import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import "./styles.css"; // Import the external CSS file

const CameraComponent = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [cameraFacingMode, setCameraFacingMode] = useState("environment");
  const webcamRef = useRef(null);

  const videoConstraints = {
    facingMode: cameraFacingMode,
  };

  const handleCapture = () => {
    const image = webcamRef.current.getScreenshot();
    setImageSrc(image);
    setIsCameraOpen(false);
  };

  const handleSwitchCamera = () => {
    setCameraFacingMode((prev) =>
      prev === "environment" ? "user" : "environment"
    );
  };

  return (
    <div className="container">
      {isCameraOpen ? (
        <div className="cameraView">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="webcam"
          />
          <div className="buttonContainer">
            <button className="switchButton" onClick={handleSwitchCamera}>
              🔄 Switch Camera
            </button>
            <button className="captureButton" onClick={handleCapture}>
              📸 Capture
            </button>
          </div>
        </div>
      ) : (
        <div>
          {imageSrc ? (
            <div>
              <img src={imageSrc} alt="Captured" className="imagePreview" />
              <button
                className="cameraButton"
                onClick={() => setIsCameraOpen(true)}
              >
                📷 Retake
              </button>
            </div>
          ) : (
            <button
              className="cameraButton"
              onClick={() => setIsCameraOpen(true)}
            >
              📷 Open Camera
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
