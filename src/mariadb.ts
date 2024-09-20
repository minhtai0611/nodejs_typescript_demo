import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: '127.0.0.1',
    user:'minhtai',
    password: 'root',
    database: 'chat'
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
        console.log("Database and table created or already exist.");
    } catch (err) {
        console.error(err);
    } finally {
        if (conn) conn.release(); // Release connection back to pool
    }
}

export async function getMessages() {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM messages");
        return rows;
    } finally {
        if (conn) conn.release(); // Release connection back to pool
    }
}

export async function saveMessage(content: string, senderId: string) {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("INSERT INTO messages (content, senderId) VALUES (?, ?)", [content, senderId]);
        // Retrieve and return the inserted message
        const newMessage = {
            id: result.insertId,
            content,
            senderId
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