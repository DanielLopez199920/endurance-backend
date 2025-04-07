const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const athleteRoutes = require("./routes/athletes");
const userRoutes = require("./routes/users");
const visitRoutes = require("./routes/visits");

const app = express();

const allowedOrigins = [
  "https://benevolent-travesseiro-c6f116.netlify.app",
  "http://localhost:3000"
];

app.use(cors()); // 🔥 ¡Peligroso para producción!


app.options("*", cors());

app.use(express.json());


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/auth", authRoutes);
app.use("/api/athletes", athleteRoutes);
app.use("/api/users", userRoutes);
app.use("/api/visits", visitRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en puerto ${PORT}`);
});
