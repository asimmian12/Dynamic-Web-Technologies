// Import React and necessary hooks for state management and routing 
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

// Export the EditReportForm component which handles the editing of a report
function EditReportForm({ report }) {
    // Initialise state variables for the report's title, category, description, status, message and photo evidence
    const navigate = useNavigate();
    const [title, setTitle] = useState(report.title || "");
    const [category, setCategory] = useState(report.category || "");
    const [description, setDescription] = useState(report.description || "");
    const [status, setStatus] = useState(report.status || "Open");
    const [message, setMessage] = useState("");

    // Used photos as an array to handle photo evidence, allowing for multiple photos to be added or removed
    let photos = [];

    // Check if the report has photo evidence and set the initial state accordingly
    if (Array.isArray(report.photo)) {
        // If the report has multiple photos, set the photos state to the array of photos
        photos = report.photo;
    } else if (report.photo) {
        // If the report has a single photo, set the photos state to an array containing that photo
        photos = [report.photo];
    }
    // Initialise the photo state with the photos array
    const [photo, setPhoto] = useState(photos);

    // The addPhoto function handles the addition of new photo evidence to the report. It reads the selected file and updates the photo state with the new image.
    function addPhoto(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        // Use the FileReader API to read the selected file and convert it to a data URL, which can be used as the source for an image element. Once the file is read, update the photo state with the new image.
        const reader = new FileReader();
        // When the file is successfully read, update the photo state with the new image data URL
        reader.onload = () => {
            // Update the photo state by concatenating the new image data URL to the existing array of photos
            setPhoto(photo.concat(reader.result));
        };
        // Read the selected file as a data URL, which will trigger the onload event when the reading is complete
        reader.readAsDataURL(file);
    }

    // The deletePhoto function handles the removal of photo evidence from the report. It filters out the photo at the specified index and updates the photo state accordingly.
    function deletePhoto(index) {
        // Filter the photo state to remove the photo at the specified index and update the photo state with the remaining photos
        const keptPhotos = photo.filter((item, photoIndex) => {
            // Return true for all photos except the one at the specified index, effectively removing it from the array
            return photoIndex !== index;
        });
        // Update the photo state with the remaining photos after the specified photo has been removed
        setPhoto(keptPhotos);
    }

    // The saveReport function handles the saving of the edited report. It validates the input fields, updates the report in local storage, and navigates back to the report details page upon successful save.
    function saveReport(event) {
        // This may prevent the default form submission behavior to avoid page reload and handle the save operation programmatically
        event.preventDefault();

        // Validate that the required fields (title, category, and description) are filled in. If any of these fields are empty, set an error message and return early to prevent saving the report.
        if (title === "" || category === "" || description === "") {
            // Set an error message to inform the user that the required fields must be filled in before saving the report
            setMessage("Please fill in the title, category and description.");
            // Return early to prevent the save operation from proceeding, as the required fields are not filled in
            return;
        }

        // Create an updated report object with the new values for title, category, status, description, and photo evidence. The latitude, longitude, and createdAt fields are preserved from the original report.
        const updated = {
            id: report.id,
            title: title,
            category: category,
            status: status,
            description: description,
            photo: photo,
            latitude: report.latitude,
            longitude: report.longitude,
            createdAt: report.createdAt
        };

        // Retrieve the existing reports from local storage, parse them into an array, and update the report with the matching ID. If the report is not found, it will remain unchanged.
        const saved = localStorage.getItem("reports");

        // Parse the saved reports from local storage into an array, or create an empty array if there are no saved reports
        const reports = saved ? JSON.parse(saved) : [];

        // Map through the existing reports and update the report with the matching ID. If the report ID matches, return the updated report; otherwise, return the original report unchanged.
        const updatedReports = reports.map((item) => {
            // Check if the current report ID matches the updated report ID. If it does, return the updated report; otherwise, return the original report unchanged.
            if (item.id === report.id) {
                // Return the updated report object to replace the original report in the array of reports
                return updated;
            }
            // Return the original report unchanged if the ID does not match
            return item;
        });

        // Try to save the updated reports array back to local storage. If there is an error (e.g., not enough storage space), set an error message and return early to prevent navigation.
        try {
            // Save the updated reports array to local storage by converting it to a JSON string. This will overwrite the existing reports in local storage with the updated version.
            localStorage.setItem("reports", JSON.stringify(updatedReports));
        } catch {
            // If there is an error while saving to local storage (e.g., not enough storage space), set an error message to inform the user and return early to prevent navigation to the report details page.
            setMessage("There is not enough browser storage.");
            // Return early to prevent navigation to the report details page, as the save operation was not successful
            return;
        }

        // Navigate back to the report details page for the updated report after successfully saving the changes. The URL is constructed using the report ID to display the correct report details.
        navigate("/reports/" + report.id);
    }

    // Determine the date of the report creation for display in the edit form. If the createdAt field is present, format it as a local date string; otherwise, display "Unknown".
    let date = "Unknown";

    // Check if the report has a createdAt field, and if so, format it as a local date string for display in the edit form. If the createdAt field is not present, the date will remain as "Unknown".
    if (report.createdAt) {
        // Data varable is set to the local date string representation of the report's createdAt field, which will be displayed in the edit form to inform the user of when the report was originally created.
        date = new Date(report.createdAt).toLocaleDateString();
    }

    return (
        // Render the edit report form with the necessary fields and controls for editing the report details, including title, category, status, description, and photo evidence. The form also includes a preview panel displaying the report ID, creation date, and coordinates.
        <div className="page-stack">
            <section className="page-heading">
                <div>
                    {/* Page heading for the edit report page */}
                    <p className="eyebrow">Report / Edit</p>
                    {/* Heading for the edit report page */}
                    <h1>Edit report</h1>
                    {/* Introduction for the edit report page */}
                    <p className="page-intro">Update the details or status for this finding.</p>
                </div>
                {/* Cancel link for the edit report page */}
                <Link className="button button-secondary" to={"/reports/" + report.id}>
                    Cancel
                </Link>
            </section>


            {/* Edit report form */}
            <form className="edit-layout" onSubmit={saveReport}>
                <div className="panel edit-panel">
                    <div className="panel-heading">
                        {/* Panel heading for the edit report form */}
                        <span className="panel-step">01</span>
                        <div>
                            {/* Report details panel heading */}
                            <h2>Report details</h2>
                            {/* Panel introduction for the edit report form */}
                            <p>Changes are saved to this device.</p>
                        </div>
                    </div>

                    <div className="form-fields">
                        <label className="field field-full">
                            {/* Report title label */}
                            <span>Report title <span className="required-mark">*</span></span>
                            {/* Report title input */}
                            <input
                                className="field-control"
                                type="text"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                maxLength="100"
                            />
                        </label>

                        <label className="field">
                            {/* Category label */}
                            <span>Category <span className="required-mark">*</span></span>
                            {/* Category select */}
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
                            {/* Current status label */}
                            <span>Current status</span>
                            {/* Current status select */}
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
                            {/* Description label */}
                            <span>Description <span className="required-mark">*</span></span>
                            {/* Description textarea */}
                            <textarea
                                className="field-control field-textarea"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                rows="6"
                                maxLength="1000"
                            ></textarea>
                            {/* Character count hint */}
                            <span className="field-hint">{description.length}/1000 characters</span>
                        </label>
                    </div>

                    <div className="edit-photos">
                        <div className="edit-photo-heading">
                            <div>
                                {/* Photo evidence heading */}
                                <h3>Photo evidence</h3>
                                {/* Photo evidence paragraph that is description */}
                                <p>Add a new image or remove an existing one.</p>
                            </div>
                            {/* Label button for uploading photos */}
                            <label className="button button-secondary upload-button">
                                Add photo
                                {/* File input for uploading photos */}
                                <input type="file" accept="image/*" onChange={addPhoto} />
                            </label>
                        </div>
                        {/* Photo strip when condition is met, when there are photos to display */}
                        {photo.length > 0 ? (
                            <div className="photo-strip">
                                {/* Loop through each photo and create a thumbnail */}
                                {photo.map((image, index) => (
                                    // Create a figure element for each photo thumbnail with a delete button to remove the photo from the report
                                    <figure className="photo-thumbnail" key={index}>
                                        {/* Display Photo thumbnail */}
                                        <img src={image} alt={"Photo " + (index + 1)} />
                                        {/* Delete button for each photo */}
                                        <button type="button" onClick={() => deletePhoto(index)}>
                                            X
                                        </button>
                                    </figure>
                                ))}
                            </div>

                            // When condition is not met, when there are no photos to display, show a message indicating that there are no photos attached
                        ) : (
                            <p className="muted-value">No photos attached.</p>
                        )}
                    </div>

                    {/* Form message */}
                    {message && <p className="form-message message-error">{message}</p>}

                    <div className="form-footer">
                        {/* Cancel link */}
                        <Link className="text-link" to={"/reports/" + report.id}>Cancel</Link>
                        {/* Save changes button */}
                        <button className="button button-primary" type="submit">
                            Save changes <span aria-hidden="true">→</span>
                        </button>
                    </div>
                </div>

                <aside className="edit-aside">
                    <div className="panel preview-panel">
                        {/* Report ID */}
                        <p className="eyebrow">Report ID</p>
                        {/* Display the report ID that is sliced to show the last 8 characters */}
                        <h2 className="id-heading">#{String(report.id).slice(-8)}</h2>
                        <div className="preview-divider"></div>
                        <div className="detail-fact">

                            {/* Display Created date */}
                            <span>Created</span>

                            {/* Display the created date */}
                            <strong>{date}</strong>
                        </div>
                        <div className="detail-fact">
                            {/* Display Coordinates */}
                            <span>Coordinates</span>
                            {/* Display the latitude and longitude */}
                            <strong>
                                {report.latitude || "—"}, {report.longitude || "—"}
                            </strong>
                        </div>
                    </div>
                    {/* Submit note */}
                    <p className="submit-note">
                        Your original location and date are kept when you save these changes.
                    </p>
                </aside>
            </form>
        </div>
    );
}

// Export the EditReport component which retrieves the report ID from the URL parameters, fetches the corresponding report from local storage, and renders the EditReportForm component. If the report is not found, it displays an error message and a link to return to the report list.
export default function EditReport() {
    // Retrieve the report ID from the URL parameters using the useParams hook. This ID is used to fetch the corresponding report from local storage.
    const { id } = useParams();

    // Retrieve the saved reports from local storage and parse them into an array. If there are no saved reports, an empty array is used. Then, find the report with the matching ID from the array of reports.
    const saved = localStorage.getItem("reports");
    
    // Parse the saved reports from local storage into an array, or create an empty array if there are no saved reports. Then, find the report with the matching ID from the array of reports.
    const reports = saved ? JSON.parse(saved) : [];
    
    // Find the report with the matching ID from the array of reports. If the report is not found, the variable will be undefined.
    const report = reports.find((item) => item.id === Number(id));

    // If the report is not found, display an error message that mentions the report may have not been found and a link to return to the report list. This provides feedback to the user that their report may have not been found.
    if (!report) {
        return (
            <div className="empty-state page-empty">
                <p className="eyebrow">No report found</p>
                <h1>This report may have been removed.</h1>
                <p>Return to the report list to choose another record.</p>
                <Link className="button button-primary" to="/reports">Back to reports</Link>
            </div>
        );
    }

    // If the report is found, render the EditReportForm component and pass the report as a prop. The key prop is set to the report ID to ensure that the form is re-rendered when the report changes.
    return <EditReportForm key={report.id} report={report} />;
}
