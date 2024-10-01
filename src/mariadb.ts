import mariadb from 'mariadb';
import { config } from 'dotenv';
config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!
});

export async function createDatabaseAndTable() {
    let conn;
    try {
        conn = await pool.getConnection();
        // Create database if it does not exist
        await conn.query("CREATE DATABASE IF NOT EXISTS chat");
        // Use the newly created database
        await conn.query("USE chat");
        // Create messages table if it does not exist
        await conn.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                content VARCHAR(255) NOT NULL,
                senderId INT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }
    catch (err) {
        console.error(err);
    }
    finally {
        if (conn) conn.release(); // Release connection back to pool
    }
}

export async function getMessages() {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM messages");
        return rows;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error getting messages");
    }
    finally {
        if (conn) conn.release(); // Release connection back to pool
    }
}

export async function saveMessage(content: string, senderId: string) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("INSERT INTO messages (content, senderId) VALUES (?, ?)", [content, senderId]);
        // Fetching the newly inserted message along with its timestamp
        const [{id, timestamp}] = await conn.query("SELECT * FROM messages WHERE id = ?", [rows.insertId]);
        // Retrieve and return the inserted message
        const newMessage = {
            id,
            content,
            senderId,
            timestamp
        };
        return newMessage;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error adding message");
    }
    finally {
        if (conn) conn.release();
    }
}