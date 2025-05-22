import express, {text} from 'express';
import studentRoutes from "./routes/student.routes.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(studentRoutes);
app.use((req, res) => {
    res.status(404).type('text/plain').send('404 - Not Found')
})

app.listen(port, () => console.log(`Server is running on port ${port}. Press Ctrl+C to quit.`));