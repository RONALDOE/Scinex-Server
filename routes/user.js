const express = require("express");
const router = express.Router();
const db = require("../db/connection.js");

// Rutas de Usuarios
// Añadir un usuario
router.post("/", (req, res) => {
  const { username, email, image, badge } = req.body;
  const sql =
    "INSERT INTO Users (username, email, image, badge) VALUES (?, ?, ?, ?)";
  db.query(sql, [username, email, image, badge], (err, result) => {
    if (err) {
      console.error("Error al añadir usuario:", err);
      res.status(500).send("Error al añadir usuario");
    } else {
      res.status(201).send("Usuario añadido correctamente");
    }
  });
});

// Leer un usuario por ID
router.get("/:id", (req, res) => {
  const userId = req.params.id;
  const sql = "SELECT * FROM Users WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error al obtener usuario:", err);
      res.status(500).send("Error al obtener usuario");
    } else {
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.status(404).send("Usuario no encontrado");
      }
    }
  });
});

// Eliminar un usuario por ID
router.delete("/:id", (req, res) => {
  const userId = req.params.id;
  const sql = "DELETE FROM Users WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error al eliminar usuario:", err);
      res.status(500).send("Error al eliminar usuario");
    } else {
      if (result.affectedRows > 0) {
        res.send("Usuario eliminado correctamente");
      } else {
        res.status(404).send("Usuario no encontrado");
      }
    }
  });
});

module.exports = router;
