import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./routes/users.js";
import tasksRouter from "./routes/tasks.js";

dotenv.config();

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not set. Add it to backend/.env before starting the server.");
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);

app.get("/", (req, res) => {
    res.json({ success: true, message: "To-Do List API is running." });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Not found." });
});

app.listen(PORT, () => {
    console.log(`To-Do List API listening on port ${PORT}`);
});
