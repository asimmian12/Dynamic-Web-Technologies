import { useState, useRef } from "react";
import Webcam from "react-webcam";

export default function CreateReport() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Open");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [photo, setPhoto] = useState([]);
    const [message, setMessage] = useState("");
    const webcamRef = useRef(null);

    function capturePhoto() {
        const image = webcamRef.current.getScreenshot();

        if (!image) {
            setMessage("The camera is not ready yet.");
            return;
        }

        setPhoto(photo.concat(image));
        setMessage("");
    }

    function handlePhotoChange(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setPhoto(photo.concat(reader.result));
        };
        reader.readAsDataURL(file);

        event.target.value = "";
    }

    function removePhoto(indexToRemove) {
        const newPhotos = photo.filter((image, index) => {
            return index !== indexToRemove;
        });
        setPhoto(newPhotos);
    }

    function getLocation() {
        if (!navigator.geolocation) {
            setMessage("Location is not supported by this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setMessage("Location added.");
            },
            (error) => {
                setMessage(error.message);
            }
        );
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (title === "" || category === "" || description === "") {
            setMessage("Please fill in the title, category and description.");
            return;
        }

        if (latitude === "" || longitude === "") {
            setMessage("Please add a location.");
            return;
        }

        if (photo.length === 0) {
            setMessage("Please add at least one photo.");
            return;
        }

        const report = {
            id: Date.now(),
            title: title,
            category: category,
            status: status,
            description: description,
            latitude: latitude,
            longitude: longitude,
            photo: photo,
            createdAt: new Date().toISOString()
        };

        const oldData = localStorage.getItem("reports");
        let reports = [];

        if (oldData) {
            reports = JSON.parse(oldData);
        }

        reports.push(report);

        try {
            localStorage.setItem("reports", JSON.stringify(reports));
        } catch {
            setMessage("There is not enough browser storage.");
            return;
        }

        setMessage("Report saved.");
        setTitle("");
        setCategory("");
        setDescription("");
        setStatus("Open");
        setLatitude("");
        setLongitude("");
        setPhoto([]);
    }

    let statusClass = "status-open";
    if (status === "In Progress") {
        statusClass = "status-in-progress";
    }
    if (status === "Resolved") {
        statusClass = "status-resolved";
    }

    let photoText = "00";
    if (photo.length > 0 && photo.length < 10) {
        photoText = "0" + photo.length;
    } else if (photo.length >= 10) {
        photoText = photo.length;
    }

    return (
        <div className="page-stack">
            <section className="page-heading">
                <div>
                    <p className="eyebrow">FIELD ENTRY / 01</p>
                    <h1>New report</h1>
                    <p className="page-intro">Capture the details now. You can update the status as work progresses.</p>
                </div>
                <span className="local-badge"><span></span> SAVED ON DEVICE</span>
            </section>

            <form className="report-form" onSubmit={handleSubmit}>
                <div className="form-main">
                    <section className="panel form-panel">
                        <div className="panel-heading">
                            <span className="panel-step">01</span>
                            <div>
                                <h2>What did you find?</h2>
                                <p>Start with the details your team needs.</p>
                            </div>
                        </div>

                        <div className="form-fields">
                            <label className="field field-full">
                                <span>Report title <span className="required-mark">*</span></span>
                                <input
                                    className="field-control"
                                    type="text"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    placeholder="e.g. Loose panel near Gate 12"
                                    maxLength="100"
                                />
                            </label>

                            <label className="field">
                                <span>Category <span className="required-mark">*</span></span>
                                <select
                                    className="field-control"
                                    value={category}
                                    onChange={(event) => setCategory(event.target.value)}
                                >
                                    <option value="">Choose a category</option>
                                    <option value="Wildlife">Wildlife</option>
                                    <option value="Fault">Fault</option>
                                    <option value="Fly-tipping">Fly-tipping</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                            </label>

                            <label className="field">
                                <span>Current status</span>
                                <select
                                    className="field-control"
                                    value={status}
                                    onChange={(event) => setStatus(event.target.value)}
                                >
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </label>

                            <label className="field field-full">
                                <span>Description <span className="required-mark">*</span></span>
                                <textarea
                                    className="field-control field-textarea"
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    placeholder="Describe what you observed and any useful context."
                                    rows="5"
                                    maxLength="1000"
                                ></textarea>
                                <span className="field-hint">{description.length}/1000 characters</span>
                            </label>
                        </div>
                    </section>

                    <section className="panel form-panel">
                        <div className="panel-heading">
                            <span className="panel-step">02</span>
                            <div>
                                <h2>Where is it?</h2>
                                <p>Attach your current coordinates to help locate the finding.</p>
                            </div>
                        </div>

                        <div className="location-row">
                            <div className="location-readout">
                                <span className="location-pin" aria-hidden="true">+</span>
                                <div>
                                    <span className="field-label">GPS coordinates</span>
                                    {latitude && longitude ? (
                                        <strong>{Number(latitude).toFixed(5)}, {Number(longitude).toFixed(5)}</strong>
                                    ) : (
                                        <span className="muted-value">Waiting for location</span>
                                    )}
                                </div>
                            </div>
                            <button className="button button-secondary" type="button" onClick={getLocation}>
                                <span aria-hidden="true">+</span> Use my location
                            </button>
                        </div>
                        <p className="field-hint location-hint">Your browser will ask permission to access the device location.</p>
                    </section>

                    <section className="panel form-panel">
                        <div className="panel-heading">
                            <span className="panel-step">03</span>
                            <div>
                                <h2>Add photo evidence</h2>
                                <p>Take a photo or add images from your device.</p>
                            </div>
                        </div>

                        <div className="camera-frame">
                            <Webcam
                                className="camera-preview"
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{ facingMode: "environment" }}
                                onUserMediaError={() => setMessage("Camera access was unavailable.")}
                            />
                            <div className="camera-overlay"><span></span> CAMERA PREVIEW</div>
                        </div>

                        <div className="photo-actions">
                            <button className="button button-primary" type="button" onClick={capturePhoto}>
                                Take photo
                            </button>
                            <label className="button button-secondary upload-button">
                                Choose photos
                                <input type="file" accept="image/*" onChange={handlePhotoChange} />
                            </label>
                            <span className="photo-count">
                                {photo.length} {photo.length === 1 ? "photo" : "photos"} added
                            </span>
                        </div>

                        {photo.length > 0 && (
                            <div className="photo-strip">
                                {photo.map((image, index) => (
                                    <figure className="photo-thumbnail" key={index}>
                                        <img src={image} alt={"Photo " + (index + 1)} />
                                        <button type="button" onClick={() => removePhoto(index)}>
                                            ×
                                        </button>
                                    </figure>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <aside className="form-aside">
                    <div className="panel preview-panel">
                        <p className="eyebrow">LIVE PREVIEW</p>
                        <h2>{title || "Untitled report"}</h2>
                        <div className="preview-meta">
                            <span className={"status-pill " + statusClass}>
                                <span></span>{status}
                            </span>
                            <span>{category || "No category selected"}</span>
                        </div>
                        <div className="preview-divider"></div>
                        <p className="preview-description">
                            {description || "Your description will appear here as you write it."}
                        </p>
                        <div className="preview-facts">
                            <span>LOCATION <strong>{latitude && longitude ? "ATTACHED" : "NOT ADDED"}</strong></span>
                            <span>PHOTOS <strong>{photoText}</strong></span>
                        </div>
                    </div>

                    <div className="form-guidance">
                        <span className="guidance-mark" aria-hidden="true">i</span>
                        <div>
                            <strong>Before you save</strong>
                            <p>A title, category, description, location, and at least one photo are needed.</p>
                        </div>
                    </div>

                    {message && <p className="form-message message-error">{message}</p>}

                    <button className="button button-primary submit-button" type="submit">
                        Save report <span aria-hidden="true">→</span>
                    </button>
                    <p className="submit-note">This report is stored in this browser only.</p>
                </aside>
            </form>
        </div>
    );
}
