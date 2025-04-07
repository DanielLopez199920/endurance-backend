const express = require("express");
const db = require("./db");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configurar almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: "./uploads/", // Carpeta donde se guardarán las imágenes
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// 🔹 Obtener lista de deportistas
router.get("/", (req, res) => {
  db.query("SELECT * FROM athletes", (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    res.json(results);
  });
});

// 🔹 Registrar un nuevo deportista con imagen
router.post("/register", upload.single("photo"), (req, res) => {
  const { name, email, phone, birthdate, address, status, branch, notes } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !email) {
    return res.status(400).json({ error: "Nombre y correo son obligatorios" });
  }

  const sql = "INSERT INTO athletes (name, email, phone, birthdate, address, status, branch, notes, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [name, email, phone, birthdate, address, status || "Inactivo", branch, notes, photo];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Error registrando deportista:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json({ message: "Deportista registrado con éxito", id: result.insertId, photo });
  });
});

// 🔹 Obtener lista de deportistas (SIN STAFF/ADMIN)
router.get("/", (req, res) => {
  db.query("SELECT * FROM athletes", (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    res.json(results);
  });
});


// 🔹 Obtener detalles de un atleta por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM athletes WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });

    if (results.length === 0) {
      return res.status(404).json({ error: "Atleta no encontrado" });
    }

    res.json(results[0]);
  });
});
// Servir imágenes desde la carpeta uploads
router.use("/uploads", express.static("uploads"));


// 🔹 Actualizar un deportista (con opción de nueva imagen)
router.put("/update/:id", upload.single("photo"), (req, res) => {
  const { id } = req.params;
  const { name, email, phone, birthdate, address, status, branch, notes } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    UPDATE athletes SET 
      name = ?, email = ?, phone = ?, birthdate = ?, 
      address = ?, status = ?, branch = ?, notes = ?
      ${photo ? ", photo = ?" : ""}
    WHERE id = ?
  `;

  const values = [
    name, email, phone, birthdate, address, status, branch, notes,
    ...(photo ? [photo, id] : [id])
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Error actualizando deportista:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json({ message: "Deportista actualizado con éxito" });
  });
});


module.exports = router;
