// Import useState and useRef hooks from React, and the Webcam component for capturing photos
import { useState, useRef } from "react";
import Webcam from "react-webcam";

// Export the CreateReport component as the default export
export default function CreateReport() {
    // Initialise state variables for the report's title, category, description, status, latitude, longitude, photo, message and webcamRef.
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Open");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [photo, setPhoto] = useState([]);
    const [message, setMessage] = useState("");
    const webcamRef = useRef(null);

    // Webcam
    // To capture a photo using the webcam, check if the webcam is ready and then add the captured image to the photo state. If the webcam is not ready, display an error message.
    function capturePhoto() {
        // Get the screenshot from the webcam reference from image. This will return a base64-encoded image string.
        const image = webcamRef.current.getScreenshot();

        // Check if the image is null, which indicates that the webcam is not ready. If so, set an error message and return early.
        if (!image) {
            setMessage("The camera is not ready yet.");
            return;
        }
        // If the image is valid, add it to the photo state array and clear any previous messages.
        setPhoto(photo.concat(image));
        // Clear any previous messages after successfully capturing a photo.
        setMessage("");
    }
    // Handle photo changes by reading the selected file and adding it to the photo state. If no file is selected, return early. After reading the file, reset the input value to allow for re-selection of the same file.
    function handlePhotoChange(event) {
        // Get the first file from the file input event. If no file is selected, return early.
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        // To read the selected file, create a new FileReader instance. When the file is loaded, add the resulting base64-encoded image string to the photo state array. Finally, read the file as a data URL and reset the input value to allow for re-selection of the same file. 
        const reader = new FileReader();
        // When the file is loaded, add the resulting base64-encoded image string to the photo state array.
        reader.onload = () => {
            // Add the loaded image to the photo state array using the concat method to create a new array with the existing photos and the new one.
            setPhoto(photo.concat(reader.result));
        };

        // Read the selected file as a data URL, which will trigger the onload event when the file is fully read.
        reader.readAsDataURL(file);

        // Reset the input value to allow for re-selection of the same file. This is necessary because some browsers do not trigger the change event if the same file is selected again.
        event.target.value = "";
    }

    // Remove a photo from the photo state array by filtering out the photo at the specified index. This function takes an index as an argument and creates a new array that excludes the photo at that index, then updates the photo state with the new array.
    function removePhoto(indexToRemove) {
        // Create a new array of photos by filtering out the photo at the specified index. The filter method creates a new array that includes all photos except the one at the indexToRemove.
        const newPhotos = photo.filter((image, index) => {
            // Return true for all photos except the one at the indexToRemove, effectively removing it from the new array.
            return index !== indexToRemove;
        });
        // Update the photo state with the new array of photos, effectively removing the specified photo from the state.
        setPhoto(newPhotos);
    }

    // Get the user's current location using the Geolocation API. If the browser does not support geolocation, display an error message. If the location is successfully retrieved, update the latitude and longitude state variables and display a success message. If there is an error retrieving the location, display the error message.
    // GeoLocation
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

    // Handle form submission by validating the input fields and saving the report to local storage. If any required fields are missing, display an error message. If the report is successfully saved, clear the form fields and display a success message.
    function handleSubmit(event) {
        // Prevent the default form submission behavior to avoid page reloads and allow for custom handling of the form data.
        event.preventDefault();

        // Validate the required fields (title, category, description, latitude, longitude, and photo) before saving the report. If any of these fields are missing, set an appropriate error message and return early to prevent saving an incomplete report.
        if (title === "" || category === "" || description === "") {
            setMessage("Please fill in the title, category and description.");
            return;
        }
        // Validate that both latitude and longitude are provided. If either is missing, set an error message and return early to prevent saving a report without location data.
        if (latitude === "" || longitude === "") {
            setMessage("Please add a location.");
            return;
        }

        // Validate that at least one photo is added to the report. If no photos are present, set an error message and return early to prevent saving a report without visual evidence.
        if (photo.length === 0) {
            setMessage("Please add at least one photo.");
            return;
        }

        // Create a new report object with the provided details, including a unique ID based on the current timestamp and the current date and time in ISO format.
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

        // Retrieve existing reports from local storage, parse them into an array, and add the new report to the array. If there are no existing reports, initialize an empty array.
        const oldData = localStorage.getItem("reports");

        // Initialise an empty array to hold the existing reports. If there are existing reports in local storage, parse them into an array and assign it to the reports variable. Otherwise, keep the reports variable as an empty array.
        let reports = [];

        // To check if oldData is not null. If it is not null, parse the JSON string into an array and assign it to the reports variable. This allows for adding the new report to the existing reports.
        if (oldData) {
            reports = JSON.parse(oldData);
        }
        // Add the new report to the reports array and save the updated array back to local storage. If there is an error saving to local storage (e.g., due to insufficient space), display an error message and return early.
        reports.push(report);

        try {
            // Save the updated reports array to local storage by converting it to a JSON string. This allows for persistent storage of the reports across browser sessions.
            localStorage.setItem("reports", JSON.stringify(reports));
        } catch {
            // If there is an error saving to local storage (e.g., due to insufficient space), set an error message indicating that there is not enough browser storage and return early to prevent further execution of the function.
            setMessage("There is not enough browser storage.");
            return;
        }

        /* If the report is successfully saved, set a success message and clear the form fields to allow for creating a new report. This provides feedback to the user that the report has been saved and resets the form for further use.
        This may also allow to clear the form fields and reset the state variables to their initial values, preparing the form for a new report entry.
        */
        setMessage("Report saved.");
        setTitle("");
        setCategory("");
        setDescription("");
        setStatus("Open");
        setLatitude("");
        setLongitude("");
        setPhoto([]);
    }

    // Determine the appropriate CSS class for the status pill based on the current status of the report. This allows for visual differentiation of the report's status in the UI.
    let statusClass = "status-open";
    if (status === "In Progress") {
        statusClass = "status-in-progress";
    }
    if (status === "Resolved") {
        statusClass = "status-resolved";
    }

    // Determine the appropriate text to display for the number of photos added to the report. This provides a user-friendly representation of the photo count in the UI.
    let photoText = "00";
    if (photo.length > 0 && photo.length < 10) {
        photoText = "0" + photo.length;
    } else if (photo.length >= 10) {
        photoText = photo.length;
    }

    return (
        // Render the CreateReport component's UI, including the form for creating a new report, live preview of the report, and various sections for capturing details, location, and photo evidence. The form includes input fields for title, category, description, status, and buttons for capturing photos and using the device's location. The live preview updates in real-time as the user fills out the form.
        <div className="page-stack">
            <section className="page-heading">
                <div>
                    <p className="eyebrow">Field Entry / 01</p>
                    {/* Heading for the new report section */}
                    <h1>New report</h1>
                    {/* Introduction for the new report section */}
                    <p className="page-intro">Capture the details now. You can update the status as work progresses.</p>
                </div>
                {/* Saved on Device badge */}
                <span className="local-badge"><span></span> Saved on Device</span>
            </section>

            {/* Report form */}
            <form className="report-form" onSubmit={handleSubmit}>
                <div className="form-main">
                    <section className="panel form-panel">
                        <div className="panel-heading">
                            {/* Panel step indicator */}
                            <span className="panel-step">01</span>
                            <div>
                                {/* Panel heading */}
                                <h2>What did you find?</h2>
                                {/* Paragraph */}
                                <p>Start with the details your team needs.</p>
                            </div>
                        </div>

                        <div className="form-fields">
                            <label className="field field-full">
                                {/* Span for the report title label */}
                                <span>Report title <span className="required-mark">*</span></span>
                                {/* Input for the report title */}
                                <input
                                    className="field-control"
                                    type="text"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    placeholder="e.g. Loose panel near Gate 12"
                                    maxLength="100"
                                />
                            </label>
                            {/* Category label and select dropdown */}
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

                            {/* Status label and select dropdown */}
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

                            {/* Description label and textarea */}
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
                                {/* 1000 max Character Indicator */}
                                <span className="field-hint">{description.length}/1000 characters</span>
                            </label>
                        </div>
                    </section>

                    <section className="panel form-panel">
                        <div className="panel-heading">
                            {/* Span for the panel step */}
                            <span className="panel-step">02</span>
                            <div>
                                {/* Location heading and description */}
                                <h2>Where is it?</h2>
                                {/* Paragraph description for the location section */}
                                <p>Attach your current coordinates to help locate the finding.</p>
                            </div>
                        </div>

                        <div className="location-row">
                            <div className="location-readout">
                                {/* Location pin icon */}
                                <span className="location-pin" aria-hidden="true">+</span>
                                <div>
                                    {/* Span for the GPS coordinates label */}
                                    <span className="field-label">GPS coordinates</span>
                                    {/* GPS coordinates display when coordinates are met to display */}
                                    {latitude && longitude ? (
                                        // Display the latitude and longitude values formatted to five decimal places when both coordinates are available. This provides a clear and precise representation of the location in the UI.
                                        <strong>{Number(latitude).toFixed(5)}, {Number(longitude).toFixed(5)}</strong>
                                        // If the coordinates are not available, display a message indicating that the location is being waited for.
                                    ) : (
                                        <span className="muted-value">Waiting for location</span>
                                    )}
                                </div>
                            </div>
                            {/* Use my location button */}
                            <button className="button button-secondary" type="button" onClick={getLocation}>
                                <span aria-hidden="true">+</span> Use my location
                            </button>
                        </div>
                        {/* Location hint */}
                        <p className="field-hint location-hint">Your browser will ask permission to access the device location.</p>
                    </section>

                    <section className="panel form-panel">
                        <div className="panel-heading">
                            {/* Panel step indicator */}
                            <span className="panel-step">03</span>
                            <div>
                                {/* Photo evidence heading and description */}
                                <h2>Add photo evidence</h2>
                                <p>Take a photo or add images from your device.</p>
                            </div>
                        </div>

                        <div className="camera-frame">
                            {/* Webcam component for capturing photos */}
                            <Webcam
                                // Set the class name for the webcam component to "camera-preview" for styling purposes.
                                className="camera-preview"
                                // Disable audio capture in the webcam component, as only photo evidence is needed for the report.
                                audio={false}
                                // Set the reference for the webcam component to the webcamRef created earlier.s
                                ref={webcamRef}
                                // Set the screenshot format to JPEG for capturing photos. 
                                screenshotFormat="image/jpeg"
                                // Set the video constraints for the webcam component to use the environment-facing camera (rear camera) on devices that support it. 
                                videoConstraints={{ facingMode: "environment" }}
                                // Handle errors when accessing the webcam by setting an error message in the state. 
                                onUserMediaError={() => setMessage("Camera access was unavailable.")}
                            />

                            {/* Div for camera preview */}
                            <div className="camera-overlay"><span></span> Camera Preview</div>
                        </div>

                        <div className="photo-actions">
                            {/* Button for capturing photos */}
                            <button className="button button-primary" type="button" onClick={capturePhoto}>
                                Take photo
                            </button>
                            {/* Label for uploading photos */}
                            <label className="button button-secondary upload-button">
                                Choose photos
                                {/* Input for selecting photos from the device's file system */}
                                <input type="file" accept="image/*" onChange={handlePhotoChange} />
                            </label>
                            {/* Span for displaying the number of photos added */}
                            <span className="photo-count">
                                {photo.length} {photo.length === 1 ? "photo" : "photos"} added
                            </span>
                        </div>
                        {/* Photo strip for when conditions are met */}
                        {photo.length > 0 && (
                            <div className="photo-strip">
                                {/* Loop through each photo and display its thumbnail */}
                                {photo.map((image, index) => (
                                    <figure className="photo-thumbnail" key={index}>
                                        {/* Display Photo thumbnail */}
                                        <img src={image} alt={"Photo " + (index + 1)} />
                                        {/* Button for removing a photo */}
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
                        {/* Live preview of the report */}
                        <p className="eyebrow">Live Preview</p>
                        <h2>{title || "Untitled report"}</h2>
                        <div className="preview-meta">
                            {/* Status pill */}
                            <span className={"status-pill " + statusClass}>
                                <span></span>{status}
                            </span>
                            {/* Category fact */}
                            <span>{category || "No category selected"}</span>
                        </div>
                        <div className="preview-divider"></div>
                        <p className="preview-description">
                            {description || "Your description will appear here as you write it."}
                        </p>
                        <div className="preview-facts">
                            {/* span for Location fact */}
                            <span>Location: <strong>{latitude && longitude ? "ATTACHED" : "NOT ADDED"}</strong></span>
                            {/* span for Photos fact */}
                            <span>Photos: <strong>{photoText}</strong></span>
                        </div>
                    </div>

                    <div className="form-guidance">
                        {/* Span for guidance icon */}
                        <span className="guidance-mark" aria-hidden="true">i</span>
                        <div>
                            {/* Strong for guidance */}
                            <strong>Before you save</strong>
                            {/* Paragraph for guidance */}
                            <p>A title, category, description, location, and at least one photo are needed.</p>
                        </div>
                    </div>
                    
                    {/* Message container */}
                    {message && <p className="form-message message-error">{message}</p>}
                    {/* Submit button */}
                    <button className="button button-primary submit-button" type="submit">
                        Save report <span aria-hidden="true">→</span>
                    </button>
                    {/* Paragraph for submit note */}
                    <p className="submit-note">This report is stored in this browser only.</p>
                </aside>
            </form>
        </div>
    );
}
