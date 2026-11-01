import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

export default function CreateReport() {
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");


    const [photo, setPhoto] = useState([]);
    const webcamRef = useRef(null);

    const [status, setStatus] = useState("Open");

    function capturePhoto() {
        const imageSrc = webcamRef.current.getScreenshot();
        setPhoto((previousPhotos) => [
            ...previousPhotos,
            imageSrc
        ]);
    }

    function handlePhotoChange(event) {
        const file = event.target.files[0];

        if (!file) {
            return;
        };

        const reader = new FileReader();

        reader.onloadend = () => {
            setPhoto((previousPhotos) => [
                ...previousPhotos,
                reader.result
            ]);
        };

        reader.readAsDataURL(file);
    }






    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h1>Create Report</h1>
                <p>Title:
                    <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} />
                </p>

                <p>Category:</p>

                <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                >
                    <option value="">Select Category</option>
                    <option value="Wildlife">Wildlife</option>
                    <option value="Fault">Fault</option>
                    <option value="Fly-tipping">Fly-tipping</option>
                    <option value="Maintenance">Maintenance</option>
                </select>

                <p>Status:</p>

                <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                </select>

                <p>Description:</p>
                <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                ></textarea>
                <h2>Preview</h2>

                <p>Title: {title}</p>
                <p>Category: {category}</p>
                <p>Description: {description}</p>
                <p>Latitude: {latitude}</p>
                <p>Longitude: {longitude}</p>
                <p>Photos: {photo.length}</p>
                <br />
                <br />
                <button type="button" onClick={getLocation}>Get Location</button>
                <br />
                <br />
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                />

                <button
                    type="button"
                    onClick={capturePhoto}
                >
                    Take Photo
                </button>

                <p>OR Upload Existing Photo:</p>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                />

                {photo.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Photo ${index + 1}`}
                        width="300"
                    />
                ))}


                <button type="submit">
                    Submit
                </button>
            </form>
        </>
    );

    function getLocation() {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!title) {
            console.log("Title is required");
            return;
        }

        if (!category) {
            console.log("Category is required");
            return;
        }

        if (!description) {
            console.log("Description is required");
            return;
        }

        if (!latitude) {
            console.log("Latitude is required");
            return;
        }

        if (!longitude) {
            console.log("Longitude is required");
            return;
        }

        if (photo.length === 0) {
            console.log("Photo is required");
            return;
        }


        const reportData = {
            id: Date.now(),
            title,
            category,
            status,
            description,
            latitude,
            longitude,
            photo,
            createdAt: new Date().toISOString()
        };

        const savedReports = localStorage.getItem("reports");

        const reports = savedReports
            ? JSON.parse(savedReports)
            : [];

        const updatedReports = [
            ...reports,
            reportData
        ];

        localStorage.setItem(
            "reports",
            JSON.stringify(updatedReports)
        );

        console.log(reportData);
        console.log(updatedReports);

        setTitle("");
        setCategory("");
        setDescription("");

        setLatitude("");
        setLongitude("");

        setPhoto([]);

        setStatus("Open");
    }
}



