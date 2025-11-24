import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const initDB = async () => {
    try {
        db = await SQLite.openDatabaseAsync('wifi.db');
        await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS networks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ssid TEXT NOT NULL,
        password TEXT NOT NULL,
        security TEXT DEFAULT 'WPA',
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Database initialized');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

export const addNetwork = async (ssid: string, password: string, security: string = 'WPA', color: string = '#FF5733') => {
    if (!db) await initDB();
    if (!db) throw new Error('Database not initialized');

    try {
        const result = await db.runAsync(
            'INSERT INTO networks (ssid, password, security, color) VALUES (?, ?, ?, ?)',
            ssid, password, security, color
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error adding network:', error);
        throw error;
    }
};

export const getNetworks = async () => {
    if (!db) await initDB();
    if (!db) throw new Error('Database not initialized');

    try {
        const result = await db.getAllAsync('SELECT * FROM networks ORDER BY created_at DESC');
        return result;
    } catch (error) {
        console.error('Error getting networks:', error);
        return [];
    }
};

export const deleteNetwork = async (id: number) => {
    if (!db) await initDB();
    if (!db) throw new Error('Database not initialized');

    try {
        await db.runAsync('DELETE FROM networks WHERE id = ?', id);
    } catch (error) {
        console.error('Error deleting network:', error);
        throw error;
    }
};
