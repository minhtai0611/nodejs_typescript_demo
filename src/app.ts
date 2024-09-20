import express, {Application, Request, Response} from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema';
import { getMessages, saveMessage, createDatabaseAndTable } from './mariadb';
import http from 'http';
import { Server } from 'socket.io';

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT: string | number = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: {
    headerEditorEnabled: true,
  },
}));

try {
    // Socket.IO connection handling
    io.on('connection', (socket) => {
        console.log('New client connected');
        socket.on('sendMessage', async ({ content, senderId }) => {
        // Save message in DB then emit it back to all clients.
        const messageId = await saveMessage(content, senderId);
        // Emit event to all clients with the new message data.
        io.emit('newMessage', { id : messageId , content , senderId });
        });
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
    // Start the server
    // Call function to create database and table on server start
    createDatabaseAndTable().then(() => {
        app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}/graphql`);
        });
    }).catch(err => {
        console.error("Error creating database or table:", err);
    });
}
catch (err: unknown) {
    console.error(`Error: ${err}`);
}

