import React from 'react';
import { useParams, useNavigate } from "react-router-dom";

export default function ReportDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const reports = JSON.parse(
        localStorage.getItem("reports")
    ) || [];
    const report = reports.find(
        report => report.id === Number(id)
    );


    if (!report) {
        return <h1>Report not found</h1>;
    }

    return (
        <>

            <h1>{report.title}</h1>
            <h2>Report Details</h2>
            <p><strong>Category:</strong> {report.category}</p>
            <p><strong>Status:</strong> {report.status}</p>
            <h2>Photos</h2>
            {report.photo && report.photo.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`Photo ${index + 1}`}
                    width="300"
                    style={{
                        marginRight: "10px",
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        marginBottom: "10px"
                    }}
                />
            ))}
            <p><strong>Description:</strong> {report.description}</p>
            <p>
                <strong>Latitude:</strong>
                {report.latitude || "Not Available"}
            </p>

            <p>
                <strong>Longitude:</strong>
                {report.longitude || "Not Available"}
            </p>
            <p>
                <strong>Created At:</strong>
                {new Date(report.createdAt).toLocaleString()}
            </p>
            <br />

            <button
                onClick={() => navigate(`/reports/${report.id}/edit`)}
            >
                Update
            </button>
            <br />
            <button
                onClick={() => navigate("/reports")}
            >
                Go Back
            </button>
            <br />
        </>
    );
}