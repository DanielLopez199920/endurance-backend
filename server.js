const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const athleteRoutes = require("./routes/athletes");
const userRoutes = require("./routes/users"); // 🔹 Agregado
const path = require("path");
const app = express();
const visitRoutes = require("./routes/visits");
// 🔹 Middleware
app.use(cors({
  origin: "https://monumental-wisp-90771f.netlify.app"
}));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // ⚠️ Esto es importante

// 🔹 Rutas
app.use("/api/auth", authRoutes);
app.use("/api/athletes", athleteRoutes);
app.use("/api/users", userRoutes); // 🔹 Nueva ruta
app.use("/api/visits", visitRoutes);
// 🔹 Iniciar Servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
