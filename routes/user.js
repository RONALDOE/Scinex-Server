const express = require("express");
const router = express.Router();
const db = require("../db/connection.js");

router.get("/:id", async (req, res) => {
                         try {
  } catch (error) {
    console.error("Error al verificar la conexión a la base de datos:", error);
    res.status(500).send("Error al verificar la conexión a la base de datos.");
  }
});

module.exports = router;
 