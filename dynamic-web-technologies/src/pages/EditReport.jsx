import { useParams, useNavigate } from "react-router-dom";
import React, { useState } from "react";

export default function EditReport() {
    const { id } = useParams();
    const navigate = useNavigate();

    const reports = JSON.parse(
        localStorage.getItem("reports")
    ) || [];

    if (!reports) {
        return <p>No Saved Data found.</p>;
    }

    const report = reports.find(
        report => report.id === Number(id)
    );

    if (!report) {
        return <p>Report not found.</p>;
    }

    const [title, setTitle] = useState(report.title);
    const [category, setCategory] = useState(report.category);
    const [description, setDescription] = useState(report.description);
    const [status, setStatus] = useState(report.status || "Open");


    const [photo, setPhoto] = useState(report.photo || []);

    function handlePhotoChange(event) {
        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
            setPhoto((previousPhotos) => [
                ...previousPhotos,
                reader.result
            ]);
        };

        reader.readAsDataURL(file);
    }


    function handleSave() {
        const updatedReport = {
            id: report.id,
            title,
            category,
            status,
            description,
            photo,
            latitude: report.latitude,
            longitude: report.longitude,
            createdAt: report.createdAt
        };

        const updatedReports = reports.map((r) => {
            if (r.id === report.id) {
                return updatedReport;
            }

            return r;
        });
        localStorage.setItem("reports", JSON.stringify(updatedReports));
        console.log(updatedReport);
        console.log(updatedReports);
        navigate("/reports");
    }

    return (
        <>
            <h1>Edit Report</h1>
            <p>Report ID: {id}</p>
            {report && (
                <>
                    <p>Title:
                        <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} />
                    </p>

                    <p>Category:</p>

                    <select
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                    >
                        <option value="">Select Category</option>
                        <option value="Wildlife">Wildlife</option>
                        <option value="Fault">Fault</option>
                        <option value="Fly-tipping">Fly-tipping</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>

                    <p>Status:</p>

                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                    >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>

                    <p>Upload New Photo:</p>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                    />

                    {photo.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Photo ${index + 1}`}
                            width="300"
                        />
                    ))}

                    <p>Description:</p>
                    <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    ></textarea>

                    <button onClick={handleSave}>
                        Save Changes
                    </button>
                </>
            )}
        </>
    );
}