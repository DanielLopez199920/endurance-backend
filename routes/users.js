const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("./db");

const router = express.Router();

router.post("/register", (req, res) => {
  const { name, email, password, role, adminId } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  db.query("SELECT * FROM users WHERE id = ?", [adminId], async (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });

    if (results.length === 0 || results[0].role !== "admin") {
      return res.status(403).json({ error: "No autorizado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    const values = [name, email, hashedPassword, role];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("❌ Error registrando usuario:", err);
        return res.status(500).json({ error: "Error en el servidor" });
      }
      res.json({ message: "Usuario registrado con éxito", id: result.insertId });
    });
  });
});

router.get("/", (req, res) => {
  const sql = "SELECT id, name, email, role, createdAt FROM users WHERE role IN ('admin', 'staff')";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error obteniendo usuarios:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT id, name, email, role FROM users WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener usuario" });
    if (results.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(results[0]);
  });
});



router.put("/:id", (req, res) => {
  const { name, email, role } = req.body;
  const { id } = req.params;

  const sql = "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?";
  db.query(sql, [name, email, role, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    res.json({ message: "Usuario actualizado con éxito" });
  });
});



module.exports = router;
