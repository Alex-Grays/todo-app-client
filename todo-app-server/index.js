const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(cors());
app.use(express.json());

// Створення нової задачі
app.post("/todos", async (req, res) => {
  const { title } = req.body;
  const newTodo = await pool.query(
    "INSERT INTO todos (title) VALUES($1) RETURNING *",
    [title]
  );
  res.json(newTodo.rows[0]);
});

// Отримання всіх задач
app.get("/todos", async (req, res) => {
  const allTodos = await pool.query("SELECT * FROM todos");
  res.json(allTodos.rows);
});

// Оновлення задачі
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const updateTodo = await pool.query(
    "UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *",
    [completed, id]
  );
  res.json(updateTodo.rows[0]);
});

// Видалення задачі
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM todos WHERE id = $1", [id]);
  res.json({ message: "Todo deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
