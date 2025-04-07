const express = require("express");
const db = require("./db");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-visita${ext}`);
  },
});
const upload = multer({ storage });

router.post("/add", upload.single("archivo"), (req, res) => {
  const {
    athlete_id, visit_date, comment, physical_status, progress,
    institution, nivel_academico, adecuacion, tipo_adecuacion,
    beca, monto_beca, lesiones, enfermedades, tratamientos, atencion, drogas,
    tipo_vivienda, estado_vivienda, monto_vivienda, comentario_vivienda,
    trabaja, empresa_trabajo, salario_trabajo, ingreso_total, gasto_total, utilidades,
    materias, cedula, nacionalidad, telefono1, telefono2, residencia,
    disponibilidad, educacion_institucion, educacion_adecuacion, educacion_tipo, educacion_nivel,
    educacion_beca, educacion_monto, educacion_comentario,
    nombre_familiar, edad_familiar, parentesco_familiar, ocupacion_familiar,
    ingreso_mensual_familiar, lugar_trabajo_familiar
  } = req.body;

  const archivo = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO visits (
      athlete_id, visit_date, comment, physical_status, progress,
      institution, nivel_academico, adecuacion, tipo_adecuacion,
      beca, monto_beca, lesiones, enfermedades, tratamientos, atencion, drogas,
      tipo_vivienda, estado_vivienda, monto_vivienda, comentario_vivienda,
      trabaja, empresa_trabajo, salario_trabajo, ingreso_total, gasto_total, utilidades,
      materias, cedula, nacionalidad, telefono1, telefono2, residencia,
      disponibilidad, educacion_institucion, educacion_adecuacion, educacion_tipo, educacion_nivel,
      educacion_beca, educacion_monto, educacion_comentario,
      archivo,
      nombre_familiar, edad_familiar, parentesco_familiar, ocupacion_familiar,
      ingreso_mensual_familiar, lugar_trabajo_familiar
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    athlete_id, visit_date, comment, physical_status, progress,
    institution, nivel_academico, adecuacion, tipo_adecuacion,
    beca, monto_beca, lesiones, enfermedades, tratamientos, atencion, drogas,
    tipo_vivienda, estado_vivienda, monto_vivienda, comentario_vivienda,
    trabaja, empresa_trabajo, salario_trabajo, ingreso_total, gasto_total, utilidades,
    materias, cedula, nacionalidad, telefono1, telefono2, residencia,
    disponibilidad, educacion_institucion, educacion_adecuacion, educacion_tipo, educacion_nivel,
    educacion_beca, educacion_monto, educacion_comentario,
    archivo,
    nombre_familiar, edad_familiar, parentesco_familiar, ocupacion_familiar,
    ingreso_mensual_familiar, lugar_trabajo_familiar
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Error insertando visita:", err);
      return res.status(500).json({ error: "Error al registrar la visita" });
    }
    res.json({ message: "✅ Visita registrada correctamente" });
  });
});
// Obtener visitas por atleta
router.get("/:athlete_id", (req, res) => {
  const { athlete_id } = req.params;
  const sql = "SELECT * FROM visits WHERE athlete_id = ?";
  db.query(sql, [athlete_id], (err, results) => {
    if (err) {
      console.error("❌ Error obteniendo visitas:", err);
      return res.status(500).json({ error: "Error al obtener visitas" });
    }
    res.json(results);
  });
});

module.exports = router;
