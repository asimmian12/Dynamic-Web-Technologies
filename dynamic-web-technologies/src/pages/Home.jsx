import { Link } from "react-router-dom";

export default function Home() {
    const stored = localStorage.getItem("reports");
    const reports = stored ? JSON.parse(stored) : [];

    let openReports = 0;
    reports.forEach((report) => {
        if (report.status !== "Resolved") {
            openReports = openReports + 1;
        }
    });

    let totalText = reports.length;
    if (reports.length < 10) {
        totalText = "0" + reports.length;
    }

    let openText = openReports;
    if (openReports < 10) {
        openText = "0" + openReports;
    }

    return (
        <div className="page-stack">
            <section className="home-hero">
                <div className="hero-copy">
                    <p className="eyebrow">
                        <span className="eyebrow-dot"></span>
                        GLASGOW · FIELD OPERATIONS
                    </p>
                    <h1>
                        Every detail.<br />
                        <span>In the right place.</span>
                    </h1>
                    <p className="hero-description">
                        A calmer way to record, locate, and follow up on what needs attention across your site.
                    </p>

                    <div className="hero-actions">
                        <Link className="button button-primary" to="/reports/new">
                            Create a report <span aria-hidden="true">↗</span>
                        </Link>
                        <Link className="text-link" to="/reports">
                            Browse reports <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    <div className="hero-footnote">
                        <span className="privacy-icon" aria-hidden="true">◈</span>
                        Your reports are saved privately on this device.
                    </div>
                </div>

                <div className="hero-art" aria-label="Airport runway illustration">
                    <div className="art-sun"></div>
                    <div className="art-grid"></div>
                    <div className="runway">
                        <div className="runway-centerline"></div>
                        <span className="runway-number">27</span>
                        <span className="runway-label">WEST APRON</span>
                    </div>
                    <div className="art-coordinate coordinate-one">51°28′39.0″N</div>
                    <div className="art-coordinate coordinate-two">000°27′41.0″W</div>
                    <div className="art-caption">
                        <span></span>
                        SITE STATUS <strong>ON THE GROUND</strong>
                    </div>
                </div>
            </section>

            <section className="overview-row" aria-label="Report overview">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">YOUR WORKSPACE</p>
                        <h2>At a glance</h2>
                    </div>
                    <span className="local-badge"><span></span> LOCAL DATA</span>
                </div>

                <div className="stats-grid">
                    <article className="stat-card">
                        <span className="stat-label">Total reports</span>
                        <strong>{totalText}</strong>
                        <span className="stat-note">Saved on this device</span>
                    </article>

                    <article className="stat-card">
                        <span className="stat-label">Needs attention</span>
                        <strong>{openText}</strong>
                        <span className="stat-note">Open or in progress</span>
                    </article>

                    <article className="stat-card stat-card-action">
                        <span className="stat-label">Ready when you are</span>
                        <strong className="stat-action-title">Capture a new finding</strong>
                        <Link to="/reports/new">Start a report <span aria-hidden="true">↗</span></Link>
                    </article>
                </div>
            </section>

            <section className="workflow-section">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">A SIMPLE WORKFLOW</p>
                        <h2>From observation to resolution</h2>
                    </div>
                </div>

                <div className="workflow-grid">
                    <article className="workflow-item">
                        <span className="workflow-number">01</span>
                        <div>
                            <h3>Record the detail</h3>
                            <p>Add a clear description, category, and status while the finding is fresh.</p>
                        </div>
                    </article>

                    <article className="workflow-item">
                        <span className="workflow-number">02</span>
                        <div>
                            <h3>Pinpoint the place</h3>
                            <p>Attach your current coordinates and photos to give each report context.</p>
                        </div>
                    </article>

                    <article className="workflow-item">
                        <span className="workflow-number">03</span>
                        <div>
                            <h3>Follow it through</h3>
                            <p>Review reports, update their status, and mark resolved work as complete.</p>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );
}
