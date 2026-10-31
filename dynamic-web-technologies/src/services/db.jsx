import Dexie from "dexie";

export const db = new Dexie("SafeTrackDB");

db.version(1).stores({
  checkpoints: "++id,title,timestamp",
});

