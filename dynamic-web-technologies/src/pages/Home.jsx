// Import Link component from react-router-dom for navigation
import { Link } from "react-router-dom";


// Export the Home component as the default export
export default function Home() {
    // Retrieve the "reports" item from localStorage and parse it as JSON, or use an empty array if it doesn't exist
    const stored = localStorage.getItem("reports");
    // Parse the stored reports or initialise an empty array if none are found
    const reports = stored ? JSON.parse(stored) : [];

    // Open reports counter is set to 0 initially
    let openReports = 0;
    // Loop through each report and increment the openReports counter for reports that are not resolved
    reports.forEach((report) => {
        // Check if the report status is not "Resolved" and increment the openReports counter
        if (report.status !== "Resolved") {
            // Increment the openReports counter for each report that is not resolved
            openReports = openReports + 1;
        }
    });

    // Format the total number of reports and open reports for display, adding a leading zero if the count is less than 10
    let totalText = reports.length;
    // Reports.length is checked to see if it is less than 10, and if so, a leading zero is added to the totalText variable
    if (reports.length < 10) {
        // totalText is updated to include a leading zero for single-digit report counts
        totalText = "0" + reports.length;
    }

    // OpenText is initialised with the value of openReports, and a leading zero is added if the count is less than 10
    let openText = openReports;
    if (openReports < 10) {
        openText = "0" + openReports;
    }

    return (
        // Renders the whole Ui/UX
        <div className="page-stack">
            <section className="home-hero">
                <div className="hero-copy">
                    {/* Paragraph for eyebrow */}
                    <p className="eyebrow">
                        {/* Span for eyebrrow-dot */}
                        <span className="eyebrow-dot"></span>
                        Glasgow · Field Operations
                    </p>
                    {/* Heading */}
                    <h1>
                        Every detail.<br />
                        {/* Span */}
                        <span>In the right place.</span>
                    </h1>
                    {/* Paragraph for hero */}
                    <p className="hero-description">
                        A calmer way to record, locate, and follow up on what needs attention across your site.
                    </p>

                    <div className="hero-actions">
                        {/* Link to Create a report */}
                        <Link className="button button-primary" to="/reports/new">
                            Create a report <span aria-hidden="true">↗</span>
                        </Link>
                        {/* Link to report list */}
                        <Link className="text-link" to="/reports">
                            Browse reports <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    <div className="hero-footnote">
                        {/* Span for privacy icon */}
                        <span className="privacy-icon" aria-hidden="true">◈</span>
                        Your reports are saved privately on this device.
                    </div>
                </div>

                <div className="hero-art" aria-label="Airport runway illustration">
                    <div className="art-sun"></div>
                    <div className="art-grid"></div>
                    <div className="runway">
                        <div className="runway-centerline"></div>
                        {/* Span with text */}
                        <span className="runway-number">27</span>
                        <span className="runway-label">West Apron</span>
                    </div>
                    <div className="art-coordinate coordinate-one">51°28′39.0″N</div>
                    <div className="art-coordinate coordinate-two">000°27′41.0″W</div>
                    <div className="art-caption">
                        <span></span>
                        Site Status <strong>On The Ground</strong>
                    </div>
                </div>
            </section>

            <section className="overview-row" aria-label="Report overview">
                <div className="section-heading">
                    <div>
                        {/* Paaragraph for workspace in eyebrow */}
                        <p className="eyebrow">Your Workspace</p>
                        <h2>At a glance</h2>
                    </div>
                    <span className="local-badge"><span></span> Local Data</span>
                </div>

                <div className="stats-grid">
                    <article className="stat-card">
                        {/* Span texts */}
                        <span className="stat-label">Total reports</span>
                        {/* String displaying totalText */}
                        <strong>{totalText}</strong>
                        {/* Span with Reminder of device storage */}
                        <span className="stat-note">Saved on this device</span>
                    </article>

                    <article className="stat-card">
                        {/* Span texts */}
                        <span className="stat-label">Needs attention</span>
                        {/* String text */}
                        <strong>{openText}</strong>
                        {/* Span text */}
                        <span className="stat-note">Open or in progress</span>
                    </article>

                    <article className="stat-card stat-card-action">
                        {/* Spand texts */}
                        <span className="stat-label">Ready when you are</span>
                        {/* String text */}
                        <strong className="stat-action-title">Capture a new finding</strong>
                        {/* Link to Create a new report */}
                        <Link to="/reports/new">Start a report <span aria-hidden="true">↗</span></Link>
                    </article>
                </div>
            </section>

            <section className="workflow-section">
                <div className="section-heading">
                    <div>
                        {/* Paragraph to eyebrow */}
                        <p className="eyebrow">A Simple Workflow</p>
                        {/* Heading for eyebrow */}
                        <h2>From observation to resolution</h2>
                    </div>
                </div>

                <div className="workflow-grid">
                    <article className="workflow-item">
                        {/* Span with workflow */}
                        <span className="workflow-number">01</span>
                        <div>
                            {/* Heading */}
                            <h3>Record the detail</h3>
                            {/* Paragraph for workflow */}
                            <p>Add a clear description, category, and status while the finding is fresh.</p>
                        </div>
                    </article>

                    <article className="workflow-item">
                        {/* Span for workflow */}
                        <span className="workflow-number">02</span>
                        <div>
                            {/* heading for Workflow */}
                            <h3>Pinpoint the place</h3>
                            {/* Paragraph for workflow */}
                            <p>Attach your current coordinates and photos to give each report context.</p>
                        </div>
                    </article>

                    <article className="workflow-item">
                        {/* Span for workflow */}
                        <span className="workflow-number">03</span>
                        <div>
                            {/* Heading for workflow */}
                            <h3>Follow it through</h3>
                            {/* Paragraph for workflow */}
                            <p>Review reports, update their status, and mark resolved work as complete.</p>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );
}
