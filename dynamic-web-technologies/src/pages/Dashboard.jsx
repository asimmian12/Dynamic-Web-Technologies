import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { db } from "../services/db";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [photo, setPhoto] = useState("");
  const [cameraReady, setCameraReady] = useState(false);

  const [online, setOnline] = useState(navigator.onLine);

  const webcamRef = useRef(null);
  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        alert(error.message);
      }
    );
  };

  const capturePhoto = () => {
    if (!cameraReady) {
      alert("Camera is not ready yet.");
      return;
    }

    if (!webcamRef.current) {
      alert("Camera reference not found.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    console.log("Screenshot:", imageSrc);

    if (!imageSrc) {
      alert("Failed to capture image.");
      return;
    }

    setPhoto(imageSrc);
  };

  const retakePhoto = () => {
    setPhoto("");
  };
  const saveCheckpoint = async () => {
    if (!title) {
      alert("Enter a checkpoint name");
      return;
    }

    if (!latitude || !longitude) {
      alert("Get location first");
      return;
    }

    if (!photo) {
      alert("Capture a photo first");
      return;
    }

    await db.checkpoints.add({
      title,
      latitude,
      longitude,
      photo,
      timestamp: new Date().toLocaleString(),
    });

    alert("Checkpoint Saved");

    setTitle("");
    setLatitude("");
    setLongitude("");
    setPhoto("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>SafeTrack Dashboard</h1>
      
      <p>
        Status: {online ? "Online" : "Offline"}
      </p>
      
      <input
        type="text"
        placeholder="Checkpoint Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />
      <br />

      <button onClick={getLocation}>
        Get Location
      </button>

      <p>Latitude: {latitude}</p>
      <p>Longitude: {longitude}</p>

      <p>
        Current Time: {new Date().toLocaleString()}
      </p>

      {!photo ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            screenshotQuality={1}
            width={320}
            height={240}
            onUserMedia={() => {
              console.log("Camera Ready");
              setCameraReady(true);
            }}
            onUserMediaError={(err) => {
              console.error(err);
              alert("Camera access failed.");
            }}
          />

          <br />
          <br />

          <button onClick={capturePhoto}>
            Capture Photo
          </button>

          <p>
            Camera Status:{" "}
            {cameraReady ? "Ready" : "Loading..."}
          </p>
        </>
      ) : (
        <>
          <img
            src={photo}
            alt="Captured"
            width="320"
          />

          <br />
          <br />

          <button onClick={retakePhoto}>
            Retake Photo
          </button>
        </>
      )}

      <br />
      <br />

      <button onClick={saveCheckpoint}>
        Save Checkpoint
      </button>
    </div>
  );
}