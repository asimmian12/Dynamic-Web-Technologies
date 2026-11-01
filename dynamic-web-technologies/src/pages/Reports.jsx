import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Reports() {
    const [reports, setReports] = useState(JSON.parse(localStorage.getItem("reports")) || []);
    const navigate = useNavigate();


    function deleteReport(id) {
        const updatedReports = reports.filter(
            report => report.id !== id
        );
        console.log(updatedReports);
        localStorage.setItem(
            "reports",
            JSON.stringify(updatedReports)
        );
        setReports(updatedReports);
    }

    if (!reports || reports.length === 0) {
        return <p>No reports found.</p>;
    }


    return (
        <>
            <h1>Reports</h1>
            {reports.map((report, index) => (
                <div key={report.id}>
                    <p>Title: {report.title}</p>
                    <p>Category: {report.category}</p>
                    <p>Description: {report.description}</p>
                    <p>Status: {report.status}</p>
                    <p>Latitude: {report.latitude}</p>
                    <p>Longitude: {report.longitude}</p>
                    <p>
                        Created:
                        {report.createdAt
                            ? new Date(report.createdAt).toLocaleString()
                            : "Unknown"}
                    </p>

                    {report.photo && report.photo.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Photo ${index + 1}`}
                            width="200"
                            style={{
                                marginRight: "10px",
                                marginBottom: "10px"
                            }}
                        />
                    ))}

                    <button
                        onClick={() => navigate(`/reports/${report.id}/edit`)}
                    >
                        Update
                    </button>
                    <button onClick={() => deleteReport(report.id)}>Delete</button>
                </div>

            ))}

        </>

    );

}
