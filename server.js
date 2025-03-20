const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const athleteRoutes = require("./routes/athletes");
const userRoutes = require("./routes/users");
const path = require("path");
const app = express();
const visitRoutes = require("./routes/visits");

// 🔹 Middleware
app.use(cors({
  origin: "https://monumental-wisp-90771f.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 🔥 SOLUCIÓN CLAVE PARA PREVENT CORS ERRORS
app.options("*", cors());

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔹 Rutas
app.use("/api/auth", authRoutes);
app.use("/api/athletes", athleteRoutes);
app.use("/api/users", userRoutes);
app.use("/api/visits", visitRoutes);

const PORT = process.env.PORT || 5000;
const HOST = process.env.NODE_ENV === "production"
  ? "Render"
  : `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en ${HOST}`);
});

