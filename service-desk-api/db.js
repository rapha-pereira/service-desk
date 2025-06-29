const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "service_desk",
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to database");
    connection.release();
  } catch (error) {
    console.error("❌ Error connecting to database:", error.message);
    process.exit(1);
  }
}

module.exports = { pool, testConnection };
