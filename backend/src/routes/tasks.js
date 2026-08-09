import { Router } from "express";
import crypto from "crypto";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", (req, res) => {
    const { title, isDone } = req.query;

    let query = "SELECT * FROM tasks WHERE userId = ?";
    const params = [req.userId];

    if (title) {
        query += " AND title LIKE ?";
        params.push(`%${title}%`);
    }

    if (isDone !== undefined) {
        query += " AND isDone = ?";
        params.push(isDone === "true" ? 1 : 0);
    }

    query += " ORDER BY createdAt DESC";

    const rows = db.prepare(query).all(...params);
    res.json({ success: true, tasks: rows.map(toTaskResponse) });
});

router.post("/", (req, res) => {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: "Title is required." });
    }

    const task = {
        id: crypto.randomUUID(),
        userId: req.userId,
        title: title.trim(),
        description: description ? description.trim() : "",
        isDone: 0,
        createdAt: new Date().toISOString(),
    };

    db.prepare(
        "INSERT INTO tasks (id, userId, title, description, isDone, createdAt) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(task.id, task.userId, task.title, task.description, task.isDone, task.createdAt);

    res.json({ success: true, task: toTaskResponse(task) });
});

router.post("/toggle/:id", (req, res) => {
    const task = db
        .prepare("SELECT * FROM tasks WHERE id = ? AND userId = ?")
        .get(req.params.id, req.userId);

    if (!task) {
        return res.status(404).json({ success: false, message: "Task not found." });
    }

    db.prepare("UPDATE tasks SET isDone = ? WHERE id = ?").run(task.isDone ? 0 : 1, task.id);
    res.json({ success: true });
});

router.delete("/:id", (req, res) => {
    const result = db
        .prepare("DELETE FROM tasks WHERE id = ? AND userId = ?")
        .run(req.params.id, req.userId);

    if (result.changes === 0) {
        return res.status(404).json({ success: false, message: "Task not found." });
    }

    res.json({ success: true });
});

function toTaskResponse(task) {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        isDone: Boolean(task.isDone),
        createdAt: task.createdAt,
    };
}

export default router;
