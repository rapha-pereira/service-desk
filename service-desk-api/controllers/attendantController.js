const { pool } = require("../db");

async function getAttendants(req, res) {
  try {
    const query = `
      select cod_usuario, nome from usuarios
      where nivel = 'Atendente' or nivel = 'Administrador'
    `;
    const [attendants] = await pool.execute(query);
    res.status(200).json(attendants);
  } catch (err) {
    console.error("Error finding attendants:", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = {
  getAttendants,
};
