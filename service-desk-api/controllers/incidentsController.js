const { pool } = require("../db");

async function getIncidents(req, res) {
  const { attendantId } = req.query;

  try {
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

    if (attendantId) {
      // If attendantId was given, filter table by it
      query += " where incidentes.atendente = ?";
      queryParams.push(attendantId);
      console.log(`Finding attendant incidents by ID: ${attendantId}`);
    } else {
      query +=
        " where incidentes.atendente is null or incidentes.atendente = 0";
      console.log("Finding incidents without attendant.");
    }

    query += " order by incidentes.data_abertura desc";
    const rows = await pool.query(query, queryParams);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Incidents route error:", err);
    res.status(500).json({ message: "Server internal error" });
  }
}

async function createIncident(req, res) {
  const { usuario, atendente, assunto, descricao, data_previsao } = req.body;

  if (!usuario || !assunto || !descricao) {
    return res
      .status(400)
      .json({ message: "'usuario', 'assunto' and 'descrição' are needed." });
  }

  try {
    const query = `
      insert into incidentes (
        usuario,
        atendente,
        assunto,
        descricao,
        data_abertura,
        data_previsao,
        data_resolucao,
        status
      ) 
      values (?, ?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), '0000-00-00', 'Aberto')
    `;
    // If atendente or data_previsao arent received, pass as null
    const params = [
      usuario,
      atendente || null,
      assunto,
      descricao,
      data_previsao || null,
    ];
    await pool.query(query, params);
    res.status(201).json({ message: "Incident created successfully!" });
  } catch (err) {
    console.error("Error creating incident:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateIncident(req, res) {
  const { id } = req.params;
  const { atendente, data_previsao } = req.body;
  try {
    const query = `
      update incidentes 
      set atendente = ?, data_previsao = ? where cod_incidente = ?
    `;
    const params = [atendente || null, data_previsao || null, id];
    const result = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Incident not found." });
    }
    res.status(200).json({ message: "Incident updated!" });
  } catch (err) {
    console.error("Error updating incident:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteIncident(req, res) {
  const { id } = req.params;
  try {
    const query = "delete from incidentes where cod_incidente = ?";
    const result = await pool.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Incident not found." });
    }
    res.status(200).json({ message: "Incident deleted!" });
  } catch (err) {
    console.error("Error deleting incident:", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
}

module.exports = {
  getIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
};
