import express from 'express';
import router from './routes/student.routes.js';

const app = express();

app.use(express.json());
app.use(router);

app.use((req, res) => {
    res.status(404).type('text/plain').send('404 - Not Found');
});

export default app;