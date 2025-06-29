const express = require("express");
const cors = require("cors");
const dbPool = require("./db");

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// "Health" route
app.get("/", (req, res) => {
  res.send("Service Desk API up and running!");
});

// --- Login endpoint ---
app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res
      .status(400)
      .json({ message: "No e-mail or psswd provided bro!" });
  }

  let conn;
  try {
    conn = await dbPool.getConnection();
    console.log("Got pool connection succesfully");

    const query =
      "select cod_usuario, nome, email, nivel from usuarios where email = ? AND senha = ?";
    const rows = await conn.query(query, [email, senha]);

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
  } finally {
    if (conn) {
      console.log("Freeing poll connection.");
      conn.release();
    }
  }
});

// --- Incidents endpoint ---
app.get("/api/incidentes", async (req, res) => {
  const { atendenteId } = req.query;

  let conn;
  try {
    conn = await dbPool.getConnection();

    let query = `
      select 
        incidentes.cod_incidente, 
        incidentes.assunto, 
        incidentes.descricao, 
        incidentes.data_abertura, 
        incidentes.status,
        usuarios.nome as nome_solicitante 
      from incidentes
      inner join usuarios on incidentes.usuario = usuarios.cod_usuario 
    `;

    const queryParams = [];

    if (atendenteId) {
      // If atendenteId was given, filter table by it
      query += " where incidentes.atendente = ?";
      queryParams.push(atendenteId);
      console.log(`Finding atendente incidents by ID: ${atendenteId}`);
    } else {
      query +=
        " where incidentes.atendente is null or incidentes.atendente = 0";
      console.log("Finding incidentes without atendente.");
    }

    query += " order by incidentes.data_abertura desc";

    const rows = await conn.query(query, queryParams);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Incidentes route error:", err);
    res.status(500).json({ message: "Server internal error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

// --- Endpoint to get Atendentes ---
app.get("/api/atendentes", async (req, res) => {
  let conn;
  try {
    conn = await dbPool.getConnection();
    // Get all that can be an atendente
    const query =
      "select cod_usuario, nome from usuarios where nivel = 'Atendente' or nivel = 'Administrador'";
    const atendentes = await conn.query(query);
    res.status(200).json(atendentes);
  } catch (err) {
    console.error("Error finding atendentes:", err);
    res.status(500).json({ message: "Internal server error." });
  } finally {
    if (conn) conn.release();
  }
});

// --- Endpoint to create a new incident ---
app.post("/api/incidentes", async (req, res) => {
  const { usuario, atendente, assunto, descricao, data_previsao } = req.body;

  if (!usuario || !assunto || !descricao) {
    return res
      .status(400)
      .json({ message: "Usuário, assunto e descrição are needed." });
  }

  let conn;
  try {
    conn = await dbPool.getConnection();
    const query = `
      insert into incidentes (usuario, atendente, assunto, descricao, data_abertura, data_previsao, status) 
      values (?, ?, ?, ?, CURDATE(), ?, 'Aberto')
    `;
    // If atendente or data_previsao arent received, pass as null
    const params = [
      usuario,
      atendente || null,
      assunto,
      descricao,
      data_previsao || null,
    ];
    await conn.query(query, params);
    res.status(201).json({ message: "Incidente created successfully!" });
  } catch (err) {
    console.error("Error creating incident:", err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    if (conn) conn.release();
  }
});

// --- Endpoint to update an incident ---
app.put("/api/incidentes/:id", async (req, res) => {
  const { id } = req.params;
  const { atendente, data_previsao } = req.body;

  let conn;
  try {
    conn = await dbPool.getConnection();
    const query =
      "update incidentes set atendente = ?, data_previsao = ? where cod_incidente = ?";
    const params = [atendente || null, data_previsao || null, id];
    const result = await conn.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Incidente not found." });
    }
    res.status(200).json({ message: "Incidente updated!" });
  } catch (err) {
    console.error("Error updating incidente:", err);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    if (conn) conn.release();
  }
});

// --- Endpoint to delete an incident ---
app.delete("/api/incidentes/:id", async (req, res) => {
  const { id } = req.params;

  let conn;
  try {
    conn = await dbPool.getConnection();
    const query = "delete from incidentes where cod_incidente = ?";
    const result = await conn.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Incidente not found." });
    }
    res.status(200).json({ message: "Incidente deleted!" });
  } catch (err) {
    console.error("Error deleting incidente:", err);
    res.status(500).json({ message: "Internal Server Error." });
  } finally {
    if (conn) conn.release();
  }
});

app.listen(port, () => {
  console.log(`API Server running at: http://localhost:${port}`);
});
