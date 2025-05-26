import express, {text} from 'express';
import studentRoutes from "./routes/student.routes.js";
import dotenv from "dotenv";
import {MongoClient} from "mongodb";
import {init} from "./repository/students.repository.js";

dotenv.config();

const app = express();
const port = 8080;
const dbName = 'java59';
const client = new MongoClient(process.env.MONGO_URI);

async function startServer() {
    try {
        await client.connect();
        const db = client.db(dbName);
        init(db);
        app.listen(port, () => console.log(`Server is running on port ${port}. Press Ctrl+C to quit.`));
    } catch (err) {
        console.log('Failed to Connect to MongoDB.', err)
    }
}

app.use(express.json());
app.use(studentRoutes);
app.use((req, res) => {
    res.status(404).type('text/plain').send('404 - Not Found')
})

startServer()
