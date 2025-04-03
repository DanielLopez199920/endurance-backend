const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");
require("dotenv").config();

const router = express.Router();

// 🔹 Ruta para iniciar sesión
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });

    if (results.length === 0) {
      return res.status(401).json({ error: "Correo no registrado" });
    }

    const user = results[0];

    // 🔹 Comparar la contraseña hasheada con la ingresada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // 🔹 Crear el token
    const token = jwt.sign({ id: user.id, role: user.role }, "secreto123", { expiresIn: "1h" });

    res.json({ message: "Login exitoso", token, user });
  });
});


// 🔹 Obtener lista de usuarios (admin/staff)
router.get("/users", (req, res) => {
  const sql = "SELECT id, name, email, role, createdAt FROM users";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    res.json(results);
  });
});
router.post("/logout", (req, res) => {
    res.json({ message: "Sesión cerrada con éxito" });
  });
  
module.exports = router;