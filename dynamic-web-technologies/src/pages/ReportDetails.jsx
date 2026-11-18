// Import Link, useNavigate, and useParams from react-router-dom
import { Link, useNavigate, useParams } from "react-router-dom";

// Export the ReportDetails component 
export default function ReportDetails() {
    // Get the report ID from the URL parameters and initialise the navigate function
    const { id } = useParams();
    // Initialise the navigate function
    const navigate = useNavigate();

    // Retrieve the reports from localStorage and parse them into an array
    const stored = localStorage.getItem("reports");
    // Parse the stored reports or set to an empty array if none exist
    const reports = stored ? JSON.parse(stored) : [];

    // Find the report with the matching ID from the reports array
    const report = reports.find((report) => {
        return report.id === Number(id);
    });

    // If the report is not found, display an error message and a link to return to the reports list
    if (!report) {
        return (
            // Rendder an empty state message indicating that the report was not found
            <div className="empty-state page-empty">
                {/* Paragraph for no report found */}
                <p className="eyebrow">No report found</p>
                {/* Heading for the error message */}
                <h1>This report may have been removed.</h1>
                {/* Description for the error message */}
                <p>Return to the report list to choose another record.</p>
                {/* Link to the reports list */}
                <Link className="button button-primary" to="/reports">Back to reports</Link>
            </div>
        );
    }
    // Set photos to an empty array, and if the report has a photo property, set photos to that property
    let photos = [];
    if (Array.isArray(report.photo)) {
        photos = report.photo;
    } else if (report.photo) {
        photos = [report.photo];
    }
    // Determine the status of the report and set the appropriate CSS class for styling
    const status = report.status || "Open";
    // Initialise the statusClass variable to "status-open" by default
    let statusClass = "status-open";
    // Set the status class based on the report's status
    if (status === "In Progress") {
        // If the report status is "In Progress", set the statusClass to "status-in-progress"
        statusClass = "status-in-progress";
    }
    if (status === "Resolved") {
        // If the report status is "Resolved", set the statusClass to "status-resolved"
        statusClass = "status-resolved";
    }

    // Set the creation date variables
    let fullDate = "Unknown";
    // If the report has a createdAt property, format the date and set the fullDate and shortDate variables
    
    let shortDate = "Unknown";

    // If the report has a createdAt property, format the date and set the fullDate and shortDate variables
    // Check if the report has a createdAt property is not empty
    if (report.createdAt) {
        // Set the fullDate variable to a formatted string of the report's createdAt date and time
        fullDate = new Date(report.createdAt).toLocaleString();
        // Set the shortDate variable to a formatted string of the report's createdAt date
        shortDate = new Date(report.createdAt).toLocaleDateString();
    }

    return (
        // Render the report details page with a back button, report information, photos, and location details
        <div className="page-stack">
            <div className="detail-back-row">
                {/* Back button to navigate to the reports page */}
                <button
                    className="back-link"
                    type="button"
                    onClick={() => navigate("/reports")}
                >
                    {/* Span for the back arrow */}
                    <span aria-hidden="true">←</span> All reports
                </button>
                {/* Span for the report reference */}
                <span className="detail-reference">
                    Report / #{String(report.id).slice(-8)}
                </span>
            </div>

            <section className="detail-heading">
                <div>
                    <div className="detail-heading-meta">
                        {/* Span for the report status */}
                        <span className={"status-pill " + statusClass}>
                            {/* Span for the status indicator */}
                            <span></span>{status}
                        </span>
                        {/* Span for the report category */}
                        <span className="report-category">
                            {/* Span for the category indicator */}
                            {report.category || "Uncategorised"}
                        </span>
                    </div>
                    {/* Heading for the report title */}
                    <h1>{report.title || "Untitled report"}</h1>
                    {/* Paragraph for the report creation date */}
                    <p className="detail-created">Logged {fullDate}</p>
                </div>
                {/* Link for editing the report */}
                <Link className="button button-secondary" to={"/reports/" + report.id + "/edit"}>
                    Edit report
                </Link>
            </section>

            <div className="detail-grid">
                <section className="panel detail-main">
                    <div className="detail-section-heading">
                        <div>
                            {/* Paragraph for the field evidence heading */}
                            <p className="eyebrow">Field Evidence</p>
                            {/* Heading for the photos section */}
                            <h2>Photos <span className="heading-count">{photos.length}</span></h2>
                        </div>
                    </div>
                    {/* The gallery is displayed if photos are available */}
                    {photos.length > 0 ? (
                        <div className="detail-gallery">
                            {/* Loop through each photo and create a link */}
                            {photos.map((image, index) => (
                                <a
                                    className="detail-photo"
                                    // Set the href to the image URL, open in a new tab, and add a key for each photo
                                    href={image}
                                    target="_blank"
                                    rel="noreferrer"
                                    key={index}
                                >
                                    {/* Image for the photo and increment the index */}
                                    <img src={image} alt={"Photo " + (index + 1)} />
                                    {/* Span for the view image text */}
                                    <span>View image</span>
                                </a>
                            ))}
                        </div>
                    ) : (
                        // Otherwise, display a message indicating that no photos are attached to the report
                        <p className="muted-value">No photos attached to this report.</p>
                    )}

                    <div className="description-block">
                        {/* Paragraph for the observation heading */}
                        <p className="eyebrow">Observation</p>
                        {/* Description for the Observation */}
                        <p>{report.description || "No description provided."}</p>
                    </div>
                </section>

                <aside className="detail-side">
                    <section className="panel detail-info-panel">
                        {/* Paragraph for the report information heading */}
                        <p className="eyebrow">Report Information</p>
                        {/* Heading for the report information section */}
                        <h2>On-site details</h2>

                        <div className="detail-fact">
                            {/* Span for the category  */}
                            <span>Category</span>
                            {/* Strong tag for the category value */}
                            <strong>{report.category || "Uncategorised"}</strong>
                        </div>
                        <div className="detail-fact">
                            {/* Span for the status */}
                            <span>Status</span>
                            {/* Strong tag for the status value */}
                            <strong>{status}</strong>
                        </div>
                        <div className="detail-fact">
                            {/* Span for the date logged */}
                            <span>Date logged</span>
                            {/* Strong tag for the date logged value */}
                            <strong>{shortDate}</strong>
                        </div>
                    </section>

                    <section className="panel coordinates-panel">
                        {/* Paragraph for the location heading */}
                        <p className="eyebrow">Location</p>
                        {/* Heading for the coordinates section */}
                        <h2>Coordinates</h2>

                        <div className="coordinate-pair">
                            {/* Span for the latitude */}
                            <span>Latitude</span>
                            {/* Strong tag for the latitude value */}
                            <strong>{report.latitude || "Not available"}</strong>
                        </div>
                        <div className="coordinate-pair">
                            {/* Span for the longitude */}
                            <span>Longitude</span>
                            {/* Strong tag for the longitude value */}
                            <strong>{report.longitude || "Not available"}</strong>
                        </div>

                        {/* Map link element to open in Google Maps */}
                        {report.latitude && report.longitude && (
                            <a
                                className="map-link"
                                href={"https://www.google.com/maps?q=" +
                                    report.latitude + "," + report.longitude}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Open in Maps 
                                {/* Span for the  link icon */} 
                                <span aria-hidden="true">↗</span>
                            </a>
                        )}
                    </section>
                </aside>
            </div>
        </div>
    );
}
