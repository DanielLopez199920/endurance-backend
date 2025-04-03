const express = require("express");
const db = require("./db");

const router = express.Router();

// Añadir nueva visita
router.post("/add", (req, res) => {
  const { athlete_id, visit_date, comment, physical_status, progress } = req.body;

  if (!athlete_id || !visit_date) {
    return res.status(400).json({ error: "Campos requeridos faltantes" });
  }

  const sql = `INSERT INTO visits (athlete_id, visit_date, comment, physical_status, progress)
               VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [athlete_id, visit_date, comment, physical_status, progress], (err, result) => {
    if (err) {
      console.error("Error guardando visita:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json({ message: "Visita registrada correctamente" });
  });
});

// Obtener visitas por atleta
router.get("/:athleteId", (req, res) => {
  const { athleteId } = req.params;
  db.query("SELECT * FROM visits WHERE athlete_id = ? ORDER BY visit_date DESC", [athleteId], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener visitas" });
    res.json(results);
  });
});

module.exports = router;