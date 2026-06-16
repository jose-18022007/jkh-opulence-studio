import { Capacitor } from '@capacitor/core';
import { SQLiteConnection, SQLiteDBConnection, CapacitorSQLite } from '@capacitor-community/sqlite';
import { Filesystem, Directory } from '@capacitor/filesystem';

export interface Creation {
  id: string;
  url: string; // Generated design image webview-compatible url (or base64 on web)
  original_url?: string; // Original uploaded room image webview-compatible url (or base64 on web)
  room_type: string;
  style: string;
  created_at: string;
}

// Global references for SQLite connection
let sqliteConnection: SQLiteConnection | null = null;
let sqliteDb: SQLiteDBConnection | null = null;
const DB_NAME = 'jkh_opulence_db';

/**
 * Checks if the application is running in a native Capacitor environment (iOS).
 */
const isNative = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Helper: Strip data URL header (e.g. "data:image/webp;base64,") to get raw base64 data.
 */
const cleanBase64 = (base64String: string): string => {
  if (base64String.includes(';base64,')) {
    return base64String.split(';base64,')[1];
  }
  return base64String;
};

/**
 * Web Fallback: Open IndexedDB database
 */
const openIndexedDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2); // Upgraded version to support original_url
    
    request.onupgradeneeded = (e) => {
      const db = request.result;
      if (!db.objectStoreNames.contains('creations')) {
        db.createObjectStore('creations', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Initialize SQLite Database connection for iOS native platforms.
 */
export const initSQLiteDB = async (): Promise<SQLiteDBConnection> => {
  if (sqliteDb) return sqliteDb;

  try {
    if (!sqliteConnection) {
      sqliteConnection = new SQLiteConnection(CapacitorSQLite);
    }
    
    const db = await sqliteConnection.createConnection(
      DB_NAME,
      false, // encrypted
      'no-encryption', // mode
      1, // version
      false // readonly
    );
    
    await db.open();
    
    // Create the schema table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS creations (
        id TEXT PRIMARY KEY,
        room_type TEXT,
        style TEXT,
        original_image_path TEXT,
        generated_image_path TEXT,
        created_at TEXT
      );
    `;
    await db.execute(createTableQuery);
    sqliteDb = db;
    return db;
  } catch (error) {
    console.error('Failed to initialize Capacitor SQLite, falling back...', error);
    throw error;
  }
};

/**
 * Save a room design creation.
 * NATIVE: Saves images to the filesystem, writes metadata/filepaths to SQLite.
 * WEB: Saves base64 images directly to IndexedDB.
 */
export const saveCreation = async (creation: Creation): Promise<void> => {
  if (isNative()) {
    try {
      const db = await initSQLiteDB();
      
      let originalImagePath = '';
      let generatedImagePath = '';

      // Create a directory for storage
      try {
        await Filesystem.mkdir({
          path: 'creations',
          directory: Directory.Data,
          recursive: true
        });
      } catch (e) {
        // Directory may already exist, ignore error
      }

      // Save Original Room image if present
      if (creation.original_url && creation.original_url.startsWith('data:')) {
        originalImagePath = `creations/original_${creation.id}.webp`;
        await Filesystem.writeFile({
          path: originalImagePath,
          data: cleanBase64(creation.original_url),
          directory: Directory.Data
        });
      } else if (creation.original_url) {
        // If it's already a local file path/url or external url, save it directly
        originalImagePath = creation.original_url;
      }

      // Save Generated Design image
      if (creation.url && creation.url.startsWith('data:')) {
        generatedImagePath = `creations/generated_${creation.id}.webp`;
        await Filesystem.writeFile({
          path: generatedImagePath,
          data: cleanBase64(creation.url),
          directory: Directory.Data
        });
      } else {
        generatedImagePath = creation.url;
      }

      // Save record in SQLite
      const insertQuery = `
        INSERT OR REPLACE INTO creations (id, room_type, style, original_image_path, generated_image_path, created_at)
        VALUES (?, ?, ?, ?, ?, ?);
      `;
      await db.run(insertQuery, [
        creation.id,
        creation.room_type,
        creation.style,
        originalImagePath,
        generatedImagePath,
        creation.created_at
      ]);
      return;
    } catch (error) {
      console.warn('Native SQLite save failed, falling back to IndexedDB...', error);
    }
  }

  // Web Fallback: IndexedDB
  const db = await openIndexedDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction('creations', 'readwrite');
    const store = tx.objectStore('creations');
    store.put(creation);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

/**
 * Retrieve all room designs.
 * NATIVE: Reads metadata from SQLite, translates filepaths to webview-compatible URLs.
 * WEB: Retrieves base64 objects directly from IndexedDB.
 */
export const getCreations = async (): Promise<Creation[]> => {
  if (isNative()) {
    try {
      const db = await initSQLiteDB();
      const query = 'SELECT * FROM creations ORDER BY created_at DESC;';
      const result = await db.query(query);
      
      const creationsList: Creation[] = [];
      
      if (result.values) {
        for (const row of result.values) {
          let url = row.generated_image_path;
          let originalUrl = row.original_image_path;

          // Convert internal filepaths to webview compatible URLs
          if (row.generated_image_path && row.generated_image_path.startsWith('creations/')) {
            try {
              const fileUri = await Filesystem.getUri({
                path: row.generated_image_path,
                directory: Directory.Data
              });
              url = Capacitor.convertFileSrc(fileUri.uri);
            } catch (err) {
              console.error('Failed to get generated image URI', err);
            }
          }

          if (row.original_image_path && row.original_image_path.startsWith('creations/')) {
            try {
              const fileUri = await Filesystem.getUri({
                path: row.original_image_path,
                directory: Directory.Data
              });
              originalUrl = Capacitor.convertFileSrc(fileUri.uri);
            } catch (err) {
              console.error('Failed to get original image URI', err);
            }
          }

          creationsList.push({
            id: row.id,
            url: url,
            original_url: originalUrl || undefined,
            room_type: row.room_type,
            style: row.style,
            created_at: row.created_at
          });
        }
      }
      return creationsList;
    } catch (error) {
      console.warn('Native SQLite fetch failed, falling back to IndexedDB...', error);
    }
  }

  // Web Fallback: IndexedDB
  const db = await openIndexedDB();
  return new Promise<Creation[]>((resolve, reject) => {
    const tx = db.transaction('creations', 'readonly');
    const store = tx.objectStore('creations');
    const request = store.getAll();
    
    request.onsuccess = () => {
      const sorted = (request.result as Creation[]).sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      resolve(sorted);
    };
    
    request.onerror = () => reject(request.error);
  });
};

/**
 * Delete a design creation.
 * NATIVE: Deletes files from storage and deletes metadata record from SQLite.
 * WEB: Removes the record from IndexedDB.
 */
export const deleteCreation = async (id: string): Promise<void> => {
  if (isNative()) {
    try {
      const db = await initSQLiteDB();
      
      // Get the image filepaths first
      const getQuery = 'SELECT original_image_path, generated_image_path FROM creations WHERE id = ?;';
      const result = await db.query(getQuery, [id]);
      
      if (result.values && result.values.length > 0) {
        const row = result.values[0];
        
        // Delete generated image file
        if (row.generated_image_path && row.generated_image_path.startsWith('creations/')) {
          try {
            await Filesystem.deleteFile({
              path: row.generated_image_path,
              directory: Directory.Data
            });
          } catch (e) {
            console.warn(`File generated_${id}.webp delete failed`, e);
          }
        }
        
        // Delete original image file
        if (row.original_image_path && row.original_image_path.startsWith('creations/')) {
          try {
            await Filesystem.deleteFile({
              path: row.original_image_path,
              directory: Directory.Data
            });
          } catch (e) {
            console.warn(`File original_${id}.webp delete failed`, e);
          }
        }
      }

      // Delete SQLite record
      const deleteQuery = 'DELETE FROM creations WHERE id = ?;';
      await db.run(deleteQuery, [id]);
      return;
    } catch (error) {
      console.warn('Native SQLite delete failed, falling back to IndexedDB...', error);
    }
  }

  // Web Fallback: IndexedDB
  const db = await openIndexedDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction('creations', 'readwrite');
    const store = tx.objectStore('creations');
    const request = store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};
