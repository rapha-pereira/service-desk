const { pool } = require("../db");

async function login(req, res) {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ message: "No e-mail or psswd provided!" });
  }

  try {
    const query = `
      select 
        cod_usuario,
        nome,
        email,
        nivel
      from usuarios
      where email = ? and senha = ?
    `;
    const [rows] = await pool.execute(query, [email, senha]);

    if (rows.length > 0) {
      console.log("Succesfully loged in:", email);
      res.status(200).json({ message: "Login success!", user: rows[0] });
    } else {
      console.log("Failed login:", email);
      res.status(401).json({ message: "Invalid credentials." });
    }
  } catch (err) {
    console.error("Login route error:", err);
    res.status(500).json({ message: "Server internal error." });
  }
}

module.exports = {
  login,
};
