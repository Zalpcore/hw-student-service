import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

dotenv.config();

const port = 8080;

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME,
        });
        console.log('Connected to MongoDB.');

        app.listen(port, () =>
            console.log(`Server is running on port ${port}. Press Ctrl+C to quit.`)
        );
    } catch (err) {
        console.log('Failed to Connect to MongoDB.', err);
    }
}

startServer();
