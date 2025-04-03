const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const athleteRoutes = require("./routes/athletes");
const userRoutes = require("./routes/users");
const visitRoutes = require("./routes/visits");

const app = express();

// Middleware CORS robusto
app.use(cors({
  origin: "https://monumental-wisp-90771f.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Preflight para todas las rutas
app.options("*", cors());

app.use(express.json());

// Servir imágenes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/athletes", athleteRoutes);
app.use("/api/users", userRoutes);
app.use("/api/visits", visitRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en puerto ${PORT}`);
});