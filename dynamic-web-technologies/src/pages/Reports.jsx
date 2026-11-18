// Import useState from React and Link, useNavigate from react-router-dom
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Export the Reports component
export default function Reports() {
    
    // Retrieve reports from localStorage and initialise state variables
    const data = localStorage.getItem("reports");
    
    // Initialise reports state with parsed data or an empty array
    const [reports, setReports] = useState(data ? JSON.parse(data) : []);
   
    // Initialise search and filter state variables
    const [search, setSearch] = useState("");
   
    // Initialise filter state variable with default value "All statuses"
    const [filter, setFilter] = useState("All statuses");
   
    // Initialise navigate function from useNavigate hook
    const navigate = useNavigate();



    // Function to delete a report by its id
    function deleteReport(id) {
        // It can filters out the report with the specified id from the reports array
        const newReports = reports.filter((report) => {
            // Return true for reports that do not match the specified id, effectively removing the report with that id
            return report.id !== Number(id);
        });

        // Update localStorage with the new reports array and update the state
        localStorage.setItem("reports", JSON.stringify(newReports));

        // Update the reports state with the new reports array
        setReports(newReports);
    }

    // Determine which reports should be visible based on the current filter and search criteria
    let visible = reports;

    // If the filter is not set to "All statuses", filter the visible reports based on their status
    if (filter !== "All statuses") {
        visible = visible.filter((report) => {
            return (report.status || "Open") === filter;
        });
    }
    // If the search input is not empty, filter the visible reports based on whether their title, category, or description includes the search text (case-insensitive)
    if (search !== "") {
        // Convert the search text to lowercase for case-insensitive comparison
        const searchText = search.toLowerCase();
        // It can filter the visible reports based on whether their title, category, or description includes the search text (case-insensitive)
        visible = visible.filter((report) => {
            // It can convert the title, category, and description of the report to lowercase for case-insensitive comparison
            const title = report.title ? report.title.toLowerCase() : "";
            // It can convert the category of the report to lowercase for case-insensitive comparison
            const category = report.category ? report.category.toLowerCase() : "";
            // It can convert the description of the report to lowercase for case-insensitive comparison
            const description = report.description ? report.description.toLowerCase() : "";
            // Return true if the title, category, or description includes the search text, indicating that the report should be visible
            return title.includes(searchText) ||
                category.includes(searchText) ||
                description.includes(searchText);
        });
    }

    // Reverse the order of the visible reports so that the most recent reports appear first
    visible = visible.slice().reverse();

    // Set Open and Resolved count to 0 for the summary section 
    let open = 0;
    let resolved = 0;
    // Loop through the reports to count how many are open and how many are resolved
    reports.forEach((report) => {
        // If the report's status is "Resolved", increment the resolved count, otherwise increment the open count
        if (report.status === "Resolved") {
            resolved = resolved + 1;
            // If the report's status is not "Resolved", increment the open count
        } else {
            open = open + 1;
        }
    });
    // Function to format numbers as two-digit strings for display in the summary section
    function numberText(number) {
        // If the number is less than 10, return it as a string with a leading zero, otherwise return it as a string
        if (number < 10) {
            // Return the number as a string with a leading zero for single-digit numbers
            return "0" + number;
        }
        // Return the number as a string for numbers 10 and above
        return number;
    }
    // This is a function to retrieve photos for a report, ensuring that the result is always an array
    function photosFor(report) {
        // If the report's photo property is an array, return it directly
        if (Array.isArray(report.photo)) {
            // Return the report's photo property as an array if it is already an array
            return report.photo;
        }
        // If the report's photo property is a single value (not an array), return it as a single-element array
        if (report.photo) {
            // Return the report's photo property as a single-element array if it is not an array
            return [report.photo];
        }
        // If the report has no photo property, return an empty array
        return [];
    }

    return (
        // Render the main container for the reports page, including the heading, summary, and list of reports
        <div className="page-stack">
            <section className="page-heading reports-heading">
                <div>
                    {/* Paragraph for the page heading */}
                    <p className="eyebrow">Glasgow Log / Reports</p>
                    {/* Page Heading */}
                    <h1>Reports</h1>
                    {/* Page Introduction */}
                    <p className="page-intro">A clear record of what has been found and what still needs attention.</p>
                </div>
                {/* New Report Link */}
                <Link className="button button-primary" to="/reports/new">
                    {/* Span for the plus sign */}
                    <span aria-hidden="true">+</span> New report
                </Link>
            </section>

            <section className="reports-summary" aria-label="Report totals">
                <div>
                    {/* Strong NumberText for reports.length */}
                    <strong>{numberText(reports.length)}</strong>
                    {/* Span for all reports */}
                    <span>All Reports</span>
                </div>
                <div>
                    {/* Strong NumberText for open reports */}
                    <strong>{numberText(open)}</strong>
                    {/* Span for open reports */}
                    <span>Needs Attention</span>
                </div>
                <div>
                    {/* Strong NumberText for resolved reports */}
                    <strong>{numberText(resolved)}</strong>
                    {/* Span for resolved reports */}
                    <span>Resolved</span>
                </div>
                {/* Paragraph for device Storage Information */}
                <p>Stored locally on this device</p>
            </section>

            <section className="report-list-section">
                <div className="list-toolbar">
                    <div className="list-title">
                        <div>
                            {/* Paragraph for your records */}
                            <p className="eyebrow">Your Records</p>
                            {/* Heading for all findings */}
                            <h2>All findings <span>{visible.length}</span></h2>
                        </div>
                    </div>

                    <div className="list-controls">
                        {/* Search label */}
                        <label className="search-field">
                            {/* Span for search icon */}
                            <span className="search-icon" aria-hidden="true"></span>
                            
                            {/* Input for search */}
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search reports"
                                aria-label="Search reports"
                            />
                        </label>
                        {/* Filter select and dropdown */}
                        <select
                            className="filter-select"
                            value={filter}
                            onChange={(event) => setFilter(event.target.value)}
                            aria-label="Filter by status"
                        >
                            <option>All statuses</option>
                            <option>Open</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                        </select>
                    </div>
                </div>
                {/* Reports.length when condition is true */}
                {reports.length === 0 ? (
                    <div className="empty-state">
                        {/* Span for empty state */}
                        <span className="empty-mark" aria-hidden="true">+</span>
                        {/* Paragraph for empty state */}
                        <p className="eyebrow">Nothing logged yet</p>
                        {/* Heading for report list */}
                        <h2>Your report list starts here.</h2>
                        {/* Paragraph for report list */}
                        <p>Record a site finding with its location and photo evidence.</p>
                        {/* Link for creating new report */}
                        <Link className="button button-primary" to="/reports/new">
                            Create your first report
                        </Link>
                    </div>
                    // If there are no visible reports after filtering and searching, display a message indicating that there are no matching reports
                ) : visible.length === 0 ? (
                    <div className="empty-state compact-empty">
                        {/* Heading for no matching reports */}
                        <h2>No matching reports</h2>
                        {/* Paragraph for no matching reports */}
                        <p>Try another search or change the status filter.</p>
                        {/* Button for clearing filters */}
                        <button
                            className="text-button"
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setFilter("All statuses");
                            }}
                        >
                            Clear filters
                        </button>
                    </div>
                    // Otherwise, if there are visible reports, display them in a grid layout
                ) : (
                    <div className="reports-grid">
                        {/* Loop through visible reports as report cards */}
                        {visible.map((report) => {
                            // Retrieve photos for the report using the photosFor function
                            const photos = photosFor(report);
                            // Determine the status of the report, defaulting to "Open" if not specified
                            const reportStatus = report.status || "Open";

                            // Determine the CSS class for the status pill based on the report's status
                            let statusClass = "status-open";
                            // If the report's status is "In Progress", update the statusClass to "status-in-progress"
                            if (reportStatus === "In Progress") {
                                // Update the statusClass to "status-in-progress" for reports with "In Progress" status
                                statusClass = "status-in-progress";
                            }
                            // If the report's status is "Resolved", update the statusClass to "status-resolved"
                            if (reportStatus === "Resolved") {
                                // Update the statusClass to "status-resolved" for reports with "Resolved" status   
                                statusClass = "status-resolved";
                            }
                            // Determine the date text for the report, defaulting to "No date" if not specified
                            let dateText = "No date";
                            // If the report has a createdAt property, format it as a local date string for display
                            if (report.createdAt) {
                                // Format the report's createdAt date as a local date string for display
                                dateText = new Date(report.createdAt).toLocaleDateString();
                            }
                            // Determine the location text for the report, defaulting to "Location unavailable" if not specified
                            let location = "Location unavailable";
                            // If the report has latitude and longitude properties, format them as a string with four decimal places for display
                            if (report.latitude !== undefined && report.longitude !== undefined) {
                                // Format the report's latitude and longitude as a string with four decimal places for display location information
                                location = Number(report.latitude).toFixed(4) + ", " + Number(report.longitude).toFixed(4);
                            }

                            return (
                                // Render a report card for each visible report, including its image, status, date, category, title, description, location, and actions (view, edit, delete)
                                <article className="report-card" key={report.id}>
                                    {/* Link to the report details page */}
                                    <Link
                                        className="report-card-image"
                                        to={"/reports/" + report.id}
                                        aria-label={"View " + (report.title || "report")}
                                    >
                                        {/* Photo.length display when condition is met */}
                                        {photos.length > 0 ? (
                                            // If the report has photos, display the first photo as an image
                                            <img src={photos[0]} alt="" />
                                            // Otherwise, if the report has no photos, display a placeholder with the initials "RH"
                                        ) : (
                                            <span className="image-placeholder">RH</span>
                                        )}
                                        {/* Image count display */}
                                        {photos.length > 1 && (
                                            // If the report has more than one photo, display a count of the additional photos available
                                            <span className="image-count">+{photos.length - 1} photos</span>
                                        )}
                                    </Link>

                                    <div className="report-card-body">
                                        <div className="report-card-topline">
                                            {/* Status pill */}
                                            <span className={"status-pill " + statusClass}>
                                                {/* Status icon */}
                                                <span></span>{reportStatus}
                                            </span>
                                            {/* Report date */}
                                            <span className="report-date">{dateText}</span>
                                        </div>
                                        {/* paragraph for Report category */}
                                        <p className="report-category">{report.category || "Uncategorised"}</p>
                                        {/* Heading for the report title */}
                                        <h3>
                                        {/* Link to the report details page */}
                                            <Link to={"/reports/" + report.id}>
                                                {report.title || "Untitled report"}
                                            </Link>
                                        </h3>
                                        {/* Report description */}
                                        <p className="report-description">
                                            {report.description || "No description provided."}
                                        </p>

                                        <div className="report-card-location">
                                            {/* Location icon */}
                                            <span className="mini-pin" aria-hidden="true">+</span>
                                            {location}
                                        </div>

                                        <div className="report-card-actions">
                                            {/* View report button */}
                                            <button
                                                className="card-link"
                                                type="button"
                                                onClick={() => navigate("/reports/" + report.id)}
                                            >
                                                View report <span aria-hidden="true">→</span>
                                            </button>

                                            <div>
                                                {/* Edit report button */}
                                                <button
                                                    className="icon-button"
                                                    type="button"
                                                    onClick={() => navigate("/reports/" + report.id + "/edit")}
                                                >
                                                    Edit
                                                </button>
                                                {/* Delete report button */}
                                                <button
                                                    className="icon-button icon-button-danger"
                                                    type="button"
                                                    onClick={() => deleteReport(report.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
