import { Link, useNavigate, useParams } from "react-router-dom";

export default function ReportDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const stored = localStorage.getItem("reports");
    const reports = stored ? JSON.parse(stored) : [];

    const report = reports.find((item) => {
        return item.id === Number(id);
    });

    if (!report) {
        return (
            <div className="empty-state page-empty">
                <p className="eyebrow">REPORT NOT FOUND</p>
                <h1>This report may have been removed.</h1>
                <p>Return to the report list to choose another record.</p>
                <Link className="button button-primary" to="/reports">Back to reports</Link>
            </div>
        );
    }

    let photos = [];
    if (Array.isArray(report.photo)) {
        photos = report.photo;
    } else if (report.photo) {
        photos = [report.photo];
    }

    const status = report.status || "Open";
    let statusClass = "status-open";
    if (status === "In Progress") {
        statusClass = "status-in-progress";
    }
    if (status === "Resolved") {
        statusClass = "status-resolved";
    }

    let fullDate = "Unknown";
    let shortDate = "Unknown";
    if (report.createdAt) {
        fullDate = new Date(report.createdAt).toLocaleString();
        shortDate = new Date(report.createdAt).toLocaleDateString();
    }

    return (
        <div className="page-stack">
            <div className="detail-back-row">
                <button
                    className="back-link"
                    type="button"
                    onClick={() => navigate("/reports")}
                >
                    <span aria-hidden="true">←</span> All reports
                </button>
                <span className="detail-reference">
                    REPORT / #{String(report.id).slice(-8)}
                </span>
            </div>

            <section className="detail-heading">
                <div>
                    <div className="detail-heading-meta">
                        <span className={"status-pill " + statusClass}>
                            <span></span>{status}
                        </span>
                        <span className="report-category">
                            {report.category || "Uncategorised"}
                        </span>
                    </div>
                    <h1>{report.title || "Untitled report"}</h1>
                    <p className="detail-created">Logged {fullDate}</p>
                </div>
                <Link className="button button-secondary" to={"/reports/" + report.id + "/edit"}>
                    Edit report
                </Link>
            </section>

            <div className="detail-grid">
                <section className="panel detail-main">
                    <div className="detail-section-heading">
                        <div>
                            <p className="eyebrow">FIELD EVIDENCE</p>
                            <h2>Photos <span className="heading-count">{photos.length}</span></h2>
                        </div>
                    </div>

                    {photos.length > 0 ? (
                        <div className="detail-gallery">
                            {photos.map((image, index) => (
                                <a
                                    className="detail-photo"
                                    href={image}
                                    target="_blank"
                                    rel="noreferrer"
                                    key={index}
                                >
                                    <img src={image} alt={"Photo " + (index + 1)} />
                                    <span>View image</span>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="muted-value">No photos attached to this report.</p>
                    )}

                    <div className="description-block">
                        <p className="eyebrow">OBSERVATION</p>
                        <p>{report.description || "No description provided."}</p>
                    </div>
                </section>

                <aside className="detail-side">
                    <section className="panel detail-info-panel">
                        <p className="eyebrow">REPORT INFORMATION</p>
                        <h2>On-site details</h2>

                        <div className="detail-fact">
                            <span>Category</span>
                            <strong>{report.category || "Uncategorised"}</strong>
                        </div>
                        <div className="detail-fact">
                            <span>Status</span>
                            <strong>{status}</strong>
                        </div>
                        <div className="detail-fact">
                            <span>Date logged</span>
                            <strong>{shortDate}</strong>
                        </div>
                    </section>

                    <section className="panel coordinates-panel">
                        <p className="eyebrow">LOCATION</p>
                        <h2>Coordinates</h2>

                        <div className="coordinate-pair">
                            <span>LATITUDE</span>
                            <strong>{report.latitude || "Not available"}</strong>
                        </div>
                        <div className="coordinate-pair">
                            <span>LONGITUDE</span>
                            <strong>{report.longitude || "Not available"}</strong>
                        </div>

                        {report.latitude && report.longitude && (
                            <a
                                className="map-link"
                                href={"https://www.google.com/maps?q=" +
                                    report.latitude + "," + report.longitude}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Open in Maps <span aria-hidden="true">↗</span>
                            </a>
                        )}
                    </section>
                </aside>
            </div>
        </div>
    );
}
