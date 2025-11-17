// Minimal IndexedDB helper for storing issue drafts
export type IssueDraft = {
  id?: number
  title: string
  description: string
  categoryId: string
  municipalityId: string
  address?: string
  latitude?: string
  longitude?: string
  imageName?: string
  imageDataUrl?: string // base64 or data URL for preview and later upload
  createdAt: number
}

const DB_NAME = "konnekt-offline-db"
const STORE = "issue-drafts"
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveDraft(draft: IssueDraft): Promise<number> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite")
    const store = tx.objectStore(STORE)
    const req = store.add(draft)
    req.onsuccess = () => resolve(req.result as number)
    req.onerror = () => reject(req.error)
  })
}

export async function updateDraft(draft: IssueDraft): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite")
    const store = tx.objectStore(STORE)
    const req = store.put(draft)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

export async function getDrafts(): Promise<IssueDraft[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly")
    const store = tx.objectStore(STORE)
    const req = store.getAll()
    req.onsuccess = () => resolve(req.result as IssueDraft[])
    req.onerror = () => reject(req.error)
  })
}

export async function deleteDraft(id: number): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite")
    const store = tx.objectStore(STORE)
    const req = store.delete(id)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}
