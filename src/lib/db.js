import { openDB } from "idb";

const DB_NAME = "champions-codex";
const DB_VERSION = 1;
const STORE = "teamPresets";

let dbPromise;
function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: "id" });
          store.createIndex("updatedAt", "updatedAt");
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllPresets() {
  const db = await getDB();
  const all = await db.getAll(STORE);
  return all.sort((a, b) => b.updatedAt - a.updatedAt); // 최신순
}

export async function putPreset(preset) {
  const db = await getDB();
  await db.put(STORE, preset);
}

export async function deletePreset(id) {
  const db = await getDB();
  await db.delete(STORE, id);
}
