const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "events.json";
const ADMIN_PASSWORD = "1234";

// carregar eventos
function loadEvents() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

// salvar eventos
function saveEvents(events) {
  fs.writeFileSync(FILE, JSON.stringify(events, null, 2));
}

// GET
app.get("/events", (req, res) => {
  res.json(loadEvents());
});

// POST
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

// DELETE
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

// PORTA (IMPORTANTE PRO RENDER)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando");

app.get("/", (req, res) => {
res.send("API funcionando");
});
});
