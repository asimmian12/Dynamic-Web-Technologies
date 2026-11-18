import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Reports() {
    const data = localStorage.getItem("reports");
    const [reports, setReports] = useState(data ? JSON.parse(data) : []);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All statuses");
    const navigate = useNavigate();

    function deleteReport(id) {
        const newReports = reports.filter((report) => {
            return report.id !== id;
        });
        localStorage.setItem("reports", JSON.stringify(newReports));
        setReports(newReports);
    }

    let visible = reports;

    if (filter !== "All statuses") {
        visible = visible.filter((report) => {
            return (report.status || "Open") === filter;
        });
    }

    if (search !== "") {
        const searchText = search.toLowerCase();
        visible = visible.filter((report) => {
            const title = report.title ? report.title.toLowerCase() : "";
            const category = report.category ? report.category.toLowerCase() : "";
            const description = report.description ? report.description.toLowerCase() : "";

            return title.includes(searchText) ||
                category.includes(searchText) ||
                description.includes(searchText);
        });
    }

    visible = visible.slice().reverse();

    let open = 0;
    let resolved = 0;
    reports.forEach((report) => {
        if (report.status === "Resolved") {
            resolved = resolved + 1;
        } else {
            open = open + 1;
        }
    });

    function numberText(number) {
        if (number < 10) {
            return "0" + number;
        }
        return number;
    }

    function photosFor(report) {
        if (Array.isArray(report.photo)) {
            return report.photo;
        }
        if (report.photo) {
            return [report.photo];
        }
        return [];
    }

    return (
        <div className="page-stack">
            <section className="page-heading reports-heading">
                <div>
                    <p className="eyebrow">AIRFIELD LOG / REPORTS</p>
                    <h1>Reports</h1>
                    <p className="page-intro">A clear record of what has been found and what still needs attention.</p>
                </div>
                <Link className="button button-primary" to="/reports/new">
                    <span aria-hidden="true">+</span> New report
                </Link>
            </section>

            <section className="reports-summary" aria-label="Report totals">
                <div>
                    <strong>{numberText(reports.length)}</strong>
                    <span>ALL REPORTS</span>
                </div>
                <div>
                    <strong>{numberText(open)}</strong>
                    <span>NEEDS ATTENTION</span>
                </div>
                <div>
                    <strong>{numberText(resolved)}</strong>
                    <span>RESOLVED</span>
                </div>
                <p>Stored locally on this device</p>
            </section>

            <section className="report-list-section">
                <div className="list-toolbar">
                    <div className="list-title">
                        <div>
                            <p className="eyebrow">YOUR RECORDS</p>
                            <h2>All findings <span>{visible.length}</span></h2>
                        </div>
                    </div>

                    <div className="list-controls">
                        <label className="search-field">
                            <span className="search-icon" aria-hidden="true"></span>
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search reports"
                                aria-label="Search reports"
                            />
                        </label>

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

                {reports.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-mark" aria-hidden="true">+</span>
                        <p className="eyebrow">NOTHING LOGGED YET</p>
                        <h2>Your report list starts here.</h2>
                        <p>Record a site finding with its location and photo evidence.</p>
                        <Link className="button button-primary" to="/reports/new">
                            Create your first report
                        </Link>
                    </div>
                ) : visible.length === 0 ? (
                    <div className="empty-state compact-empty">
                        <h2>No matching reports</h2>
                        <p>Try another search or change the status filter.</p>
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
                ) : (
                    <div className="reports-grid">
                        {visible.map((report) => {
                            const photos = photosFor(report);
                            const reportStatus = report.status || "Open";

                            let statusClass = "status-open";
                            if (reportStatus === "In Progress") {
                                statusClass = "status-in-progress";
                            }
                            if (reportStatus === "Resolved") {
                                statusClass = "status-resolved";
                            }

                            let dateText = "No date";
                            if (report.createdAt) {
                                dateText = new Date(report.createdAt).toLocaleDateString();
                            }

                            let location = "Location unavailable";
                            if (report.latitude !== undefined && report.longitude !== undefined) {
                                location = Number(report.latitude).toFixed(4) + ", " +
                                    Number(report.longitude).toFixed(4);
                            }

                            return (
                                <article className="report-card" key={report.id}>
                                    <Link
                                        className="report-card-image"
                                        to={"/reports/" + report.id}
                                        aria-label={"View " + (report.title || "report")}
                                    >
                                        {photos.length > 0 ? (
                                            <img src={photos[0]} alt="" />
                                        ) : (
                                            <span className="image-placeholder">RH</span>
                                        )}
                                        {photos.length > 1 && (
                                            <span className="image-count">+{photos.length - 1} photos</span>
                                        )}
                                    </Link>

                                    <div className="report-card-body">
                                        <div className="report-card-topline">
                                            <span className={"status-pill " + statusClass}>
                                                <span></span>{reportStatus}
                                            </span>
                                            <span className="report-date">{dateText}</span>
                                        </div>

                                        <p className="report-category">{report.category || "Uncategorised"}</p>
                                        <h3>
                                            <Link to={"/reports/" + report.id}>
                                                {report.title || "Untitled report"}
                                            </Link>
                                        </h3>
                                        <p className="report-description">
                                            {report.description || "No description provided."}
                                        </p>

                                        <div className="report-card-location">
                                            <span className="mini-pin" aria-hidden="true">+</span>
                                            {location}
                                        </div>

                                        <div className="report-card-actions">
                                            <button
                                                className="card-link"
                                                type="button"
                                                onClick={() => navigate("/reports/" + report.id)}
                                            >
                                                View report <span aria-hidden="true">→</span>
                                            </button>

                                            <div>
                                                <button
                                                    className="icon-button"
                                                    type="button"
                                                    onClick={() => navigate("/reports/" + report.id + "/edit")}
                                                >
                                                    Edit
                                                </button>
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
