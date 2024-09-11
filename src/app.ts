import express, {Application, Request, Response} from 'express';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a route
app.get('/', async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({"message":"Hello World"});
});

// Start the server
try {
app.listen(PORT, (): void => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
}
catch (err: unknown) {
    console.error(`Error: ${err}`);
}

