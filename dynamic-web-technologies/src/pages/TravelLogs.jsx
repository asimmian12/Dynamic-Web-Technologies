import { useEffect, useState } from "react";
import { db } from "../services/db";

export default function TravelLogs() {
  const [logs, setLogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const loadLogs = async () => {
    const data = await db.checkpoints.toArray();
    setLogs(data);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const deleteLog = async (id) => {
    await db.checkpoints.delete(id);
    loadLogs();
  };

  const updateLog = async (id) => {
    await db.checkpoints.update(id, {
      title: newTitle,
    });

    setEditingId(null);
    setNewTitle("");

    loadLogs();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Travel Logs</h1>

      <p>
        Total Checkpoints: {logs.length}
      </p>

      {logs.map((log) => (
        <div
          key={log.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          {editingId === log.id ? (
            <>
              <input
                value={newTitle}
                onChange={(e) =>
                  setNewTitle(e.target.value)
                }
              />

              <button
                onClick={() =>
                  updateLog(log.id)
                }
              >
                Save
              </button>
            </>
          ) : (
            <>
              <h3>{log.title}</h3>

              <p>Latitude: {log.latitude}</p>

              <p>Longitude: {log.longitude}</p>

              <p>{log.timestamp}</p>

              {log.photo && (
                <img
                  src={log.photo}
                  alt="checkpoint"
                  width="200"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginTop: "10px",
                    display: "block",
                  }}
                />
              )}

              <br /><br />

              <button
                onClick={() => {
                  setEditingId(log.id);
                  setNewTitle(log.title);
                }}
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteLog(log.id)
                }
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
