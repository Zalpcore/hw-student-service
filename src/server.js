import express from 'express';
import studentRoutes from "./routes/student.routes.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = 8080;

app.use(express.json());
app.use(studentRoutes);
app.use((req, res) => {
    res.status(404).type('text/plain').send('404 - Not Found')
})
async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME,
        });
        console.log('Connected to MongoDB.');
        app.listen(port, () => console.log(`Server is running on port ${port}. Press Ctrl+C to quit.`));
    } catch (err) {
        console.log('Failed to Connect to MongoDB.', err)
    }
}

startServer();
