const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database(path.join(__dirname, "training.db"));

db.serialize(() =>
{
    db.run(
        `CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            athleteName TEXT NOT NULL,
            email TEXT NOT NULL,
            sessionDate TEXT NOT NULL,
            workoutType TEXT NOT NULL,
            intensity TEXT NOT NULL,
            didMobility INTEGER NOT NULL,
            goal TEXT NOT NULL,
            notes TEXT NOT NULL,
            createdAt TEXT NOT NULL
        )`
    );
});

app.get("/api/health", (req, res) =>
{
    res.json({ ok: true, time: new Date().toISOString() });
});

app.get("/api/sessions", (req, res) =>
{
    db.all(
        "SELECT * FROM sessions ORDER BY id DESC LIMIT 100",
        [],
        (err, rows) =>
        {
            if (err) return res.status(500).json({ error: "Database error." });
            res.json(rows);
        }
    );
});

app.get("/api/sessions/:id", (req, res) =>
{
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id." });

    db.get(
        "SELECT * FROM sessions WHERE id = ?",
        [id],
        (err, row) =>
        {
            if (err) return res.status(500).json({ error: "Database error." });
            if (!row) return res.status(404).json({ error: "Not found." });
            res.json(row);
        }
    );
});

app.post("/api/sessions", (req, res) =>
{
    const athleteName = String(req.body.athleteName || "").trim();
    const email = String(req.body.email || "").trim();
    const sessionDate = String(req.body.sessionDate || "").trim();
    const workoutType = String(req.body.workoutType || "").trim();
    const intensity = String(req.body.intensity || "").trim();
    const didMobility = req.body.didMobility ? 1 : 0;
    const goal = String(req.body.goal || "").trim();
    const notes = String(req.body.notes || "").trim();

    if (!athleteName || !email || !sessionDate || !workoutType || !intensity || !goal || !notes)
        return res.status(400).json({ error: "Missing required fields." });

    const createdAt = new Date().toISOString();

    db.run(
        `INSERT INTO sessions
            (athleteName, email, sessionDate, workoutType, intensity, didMobility, goal, notes, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [athleteName, email, sessionDate, workoutType, intensity, didMobility, goal, notes, createdAt],
        function(err)
        {
            if (err) return res.status(500).json({ error: "Database error." });
            res.status(201).json({ id: this.lastID });
        }
    );
});

app.delete("/api/sessions/:id", (req, res) =>
{
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id." });

    db.run("DELETE FROM sessions WHERE id = ?", [id], function(err)
    {
        if (err) return res.status(500).json({ error: "Database error." });
        res.json({ deleted: this.changes });
    });
});

app.get("*", (req, res) =>
{
    res.status(404).sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () =>
{
    console.log(`Server running on http://localhost:${PORT}`);
});
