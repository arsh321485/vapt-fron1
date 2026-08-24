const DB_NAME = "vaptfix_pending_upload";
const STORE = "files";
const KEY = "report";
export const PENDING_UPLOAD_META_KEY = "vaptfix_pending_upload_meta";

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function setPendingUploadMeta(meta = {}) {
  sessionStorage.setItem(
    PENDING_UPLOAD_META_KEY,
    JSON.stringify({
      count: Number(meta.count) || 0,
      plan: meta.plan || "",
      name: meta.name || "",
    }),
  );
}

export function peekPendingUploadMeta() {
  try {
    const raw = sessionStorage.getItem(PENDING_UPLOAD_META_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return {
      count: Number(data.count) || 0,
      plan: String(data.plan || ""),
      name: String(data.name || ""),
    };
  } catch {
    return null;
  }
}

export function clearPendingUploadMeta() {
  sessionStorage.removeItem(PENDING_UPLOAD_META_KEY);
}

function asFile(entry, fallbackName = "report") {
  if (!entry) return null;
  const blob = entry.file || entry;
  if (!(blob instanceof Blob)) return null;
  return new File([blob], entry.name || fallbackName, {
    type: entry.type || blob.type || "",
  });
}

export async function stashPendingUpload(fileOrFiles, meta = {}) {
  const files = (Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles]).filter(
    (file) => file instanceof Blob,
  );
  if (!files.length) return;
  setPendingUploadMeta({
    count: Number(meta.count) || 0,
    plan: meta.plan || "",
    name: files[0].name || meta.name || "report",
  });
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE).put(
      {
        files: files.map((file) => ({
          file,
          name: file.name,
          type: file.type,
        })),
        file: files[0],
        name: files[0].name,
        type: files[0].type,
      },
      KEY,
    );
  });
  db.close();
}

export async function peekPendingUploadFiles() {
  try {
    const db = await openDb();
    const record = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
    db.close();
    if (Array.isArray(record?.files) && record.files.length) {
      return record.files.map((entry, idx) => asFile(entry, `report-${idx + 1}`)).filter(Boolean);
    }
    const single = asFile(record, "report");
    return single ? [single] : [];
  } catch {
    return [];
  }
}

export async function peekPendingUploadFile() {
  const files = await peekPendingUploadFiles();
  return files[0] || null;
}

export async function clearPendingUpload() {
  clearPendingUploadMeta();
  try {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.objectStore(STORE).delete(KEY);
    });
    db.close();
  } catch {
    /* ignore */
  }
}
