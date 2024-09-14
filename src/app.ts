import express, {Application, Request, Response} from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema';
import root from './resolvers';
import pool from './mariadb';

const app: Application = express();
const PORT: string | number = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: {
    headerEditorEnabled: true,
  },
}));

// Sample route to get data from the database
app.get('/data', async (req, res) => {
    try {
        const rows = await pool.query('SELECT * FROM yourTableName'); // Replace with your table name.
        res.json(rows);
    } catch (err: unknown) {
        res.status(500).send(err);
    }
});

// Define a route
app.get('/', (req: Request, res: Response): Response => {
    return res.status(200).send({"message":"Hello World"});
});

// Start the server
try {
    app.listen(PORT, (): void => {
        console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
}
catch (err: unknown) {
    console.error(`Error: ${err}`);
}

