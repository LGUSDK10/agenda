const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "events.json";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Carregar eventos
function loadEvents() {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

// Salvar eventos
function saveEvents(events) {
    fs.writeFileSync(FILE, JSON.stringify(events, null, 2));
}

// Rota teste
app.get("/", (req, res) => {
    res.send("API funcionando");
});

// 🔐 LOGIN (NOVO)
app.post("/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        return res.json({ success: true });
    }
    return res.status(401).json({ error: "Senha inválida" });
});

// GET eventos
app.get("/events", (req, res) => {
    res.json(loadEvents());
});

// POST evento
app.post("/events", (req, res) => {
    const { text, date, password } = req.body;
    if (password !== ADMIN_PASSWORD) {
        return res.status(403).json({ error: "Senha inválida" });
    }
    const events = loadEvents();
    events.push({ text, date });
    saveEvents(events);
    res.json(events);
});

// DELETE evento
app.delete("/events/:index", (req, res) => {
    const { password } = req.body;
    if (password !== ADMIN_PASSWORD) {
        return res.status(403).json({ error: "Senha inválida" });
    }
    const events = loadEvents();
    events.splice(req.params.index, 1);
    saveEvents(events);
    res.json(events);
});

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
