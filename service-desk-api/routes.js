const { login } = require("./controllers/loginController");
const { getAttendants } = require("./controllers/attendantController");
const {
  getIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
} = require("./controllers/incidentsController");

const express = require("express");
const router = express.Router();

router.route("/login").post(login);

router.route("/attendants").get(getAttendants);

router.route("/incidents").get(getIncidents).post(createIncident);

router.route("/incidents/:id").put(updateIncident).delete(deleteIncident);

module.exports = router;
