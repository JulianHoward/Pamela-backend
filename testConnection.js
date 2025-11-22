import sequelize from "./db.js";

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos exitosa");
  } catch (error) {
    console.error("❌ Error conectando a la base de datos:", error);
  }
}

testConnection();
