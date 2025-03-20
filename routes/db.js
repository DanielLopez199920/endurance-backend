const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "mysql.railway.internal",
  user: "root",
  password: "NbytqYDBcxUGjJjRikERzKqRwjmyzeRU",
  database: "railway",
  port: 3306, // ¡IMPORTANTE agregar el puerto!
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err);
    return;
  }
  console.log("✅ Conectado a la base de datos Railway MySQL");
});

module.exports = db;
