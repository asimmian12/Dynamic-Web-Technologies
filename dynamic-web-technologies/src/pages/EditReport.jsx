import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditReportForm({ report }) {
    const navigate = useNavigate();
    const [title, setTitle] = useState(report.title || "");
    const [category, setCategory] = useState(report.category || "");
    const [description, setDescription] = useState(report.description || "");
    const [status, setStatus] = useState(report.status || "Open");
    const [message, setMessage] = useState("");

    let photos = [];
    if (Array.isArray(report.photo)) {
        photos = report.photo;
    } else if (report.photo) {
        photos = [report.photo];
    }
    const [photo, setPhoto] = useState(photos);

    function addPhoto(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setPhoto(photo.concat(reader.result));
        };
        reader.readAsDataURL(file);
    }

    function deletePhoto(index) {
        const keptPhotos = photo.filter((item, photoIndex) => {
            return photoIndex !== index;
        });
        setPhoto(keptPhotos);
    }

    function saveReport(event) {
        event.preventDefault();

        if (title === "" || category === "" || description === "") {
            setMessage("Please fill in the title, category and description.");
            return;
        }

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

        const saved = localStorage.getItem("reports");
        const reports = saved ? JSON.parse(saved) : [];

        const updatedReports = reports.map((item) => {
            if (item.id === report.id) {
                return updated;
            }
            return item;
        });

        try {
            localStorage.setItem("reports", JSON.stringify(updatedReports));
        } catch {
            setMessage("There is not enough browser storage.");
            return;
        }

        navigate("/reports/" + report.id);
    }

    let date = "Unknown";
    if (report.createdAt) {
        date = new Date(report.createdAt).toLocaleDateString();
    }

    return (
        <div className="page-stack">
            <section className="page-heading">
                <div>
                    <p className="eyebrow">REPORT / EDIT</p>
                    <h1>Edit report</h1>
                    <p className="page-intro">Update the details or status for this finding.</p>
                </div>
                <Link className="button button-secondary" to={"/reports/" + report.id}>
                    Cancel
                </Link>
            </section>

            <form className="edit-layout" onSubmit={saveReport}>
                <div className="panel edit-panel">
                    <div className="panel-heading">
                        <span className="panel-step">01</span>
                        <div>
                            <h2>Report details</h2>
                            <p>Changes are saved to this device.</p>
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
                                rows="6"
                                maxLength="1000"
                            ></textarea>
                            <span className="field-hint">{description.length}/1000 characters</span>
                        </label>
                    </div>

                    <div className="edit-photos">
                        <div className="edit-photo-heading">
                            <div>
                                <h3>Photo evidence</h3>
                                <p>Add a new image or remove an existing one.</p>
                            </div>
                            <label className="button button-secondary upload-button">
                                Add photo
                                <input type="file" accept="image/*" onChange={addPhoto} />
                            </label>
                        </div>

                        {photo.length > 0 ? (
                            <div className="photo-strip">
                                {photo.map((image, index) => (
                                    <figure className="photo-thumbnail" key={index}>
                                        <img src={image} alt={"Photo " + (index + 1)} />
                                        <button type="button" onClick={() => deletePhoto(index)}>
                                            ×
                                        </button>
                                    </figure>
                                ))}
                            </div>
                        ) : (
                            <p className="muted-value">No photos attached.</p>
                        )}
                    </div>

                    {message && <p className="form-message message-error">{message}</p>}

                    <div className="form-footer">
                        <Link className="text-link" to={"/reports/" + report.id}>Cancel</Link>
                        <button className="button button-primary" type="submit">
                            Save changes <span aria-hidden="true">→</span>
                        </button>
                    </div>
                </div>

                <aside className="edit-aside">
                    <div className="panel preview-panel">
                        <p className="eyebrow">REPORT ID</p>
                        <h2 className="id-heading">#{String(report.id).slice(-8)}</h2>
                        <div className="preview-divider"></div>
                        <div className="detail-fact">
                            <span>Created</span>
                            <strong>{date}</strong>
                        </div>
                        <div className="detail-fact">
                            <span>Coordinates</span>
                            <strong>
                                {report.latitude || "—"}, {report.longitude || "—"}
                            </strong>
                        </div>
                    </div>
                    <p className="submit-note">
                        Your original location and date are kept when you save these changes.
                    </p>
                </aside>
            </form>
        </div>
    );
}

export default function EditReport() {
    const { id } = useParams();
    const saved = localStorage.getItem("reports");
    const reports = saved ? JSON.parse(saved) : [];
    const report = reports.find((item) => item.id === Number(id));

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

    return <EditReportForm key={report.id} report={report} />;
}
