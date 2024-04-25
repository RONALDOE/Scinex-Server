const express = require("express");
const router = express.Router();
const db = require("../db/connection.js");

// Ruta para obtener todos los mensajes de saludo
router.get("/:id", (req, res) => {
    const greetingId = req.params.id;

  const sql = "SELECT * FROM Greetings where userId = ?";
  db.query(sql,greetingId ,(err, results) => {
    if (err) {
      console.error("Error al obtener los mensajes de saludo:", err);
      res.status(500).send("Error al obtener los mensajes de saludo");
    } else {
      res.json(results);
    }
  });
});

// Ruta para crear un nuevo mensaje de saludo
router.post("/", (req, res) => {
  const { title, content, userId } = req.body;
  const sql = "INSERT INTO Greetings (title, content, userId) VALUES (?, ?, ?)";
  db.query(sql, [title, content, userId], (err, result) => {
    if (err) {
      console.error("Error al crear un nuevo mensaje de saludo:", err);
      res.status(500).send("Error al crear un nuevo mensaje de saludo");
    } else {
      res.status(201).send("Mensaje de saludo creado correctamente");
    }
  });
});

// Ruta para actualizar un mensaje de saludo por ID
router.put("/:id", (req, res) => {
  const greetingId = req.params.id;
  const { title, content } = req.body;
  const sql = "UPDATE Greetings SET title = ?, content = ? WHERE id = ?";
  db.query(sql, [title, content, greetingId], (err, result) => {
    if (err) {
      console.error("Error al actualizar el mensaje de saludo:", err);
      res.status(500).send("Error al actualizar el mensaje de saludo");
    } else {
      res.send("Mensaje de saludo actualizado correctamente");
    }
  });
});

// Ruta para eliminar un mensaje de saludo por ID
router.delete("/:id", (req, res) => {
  const greetingId = req.params.id;
  const sql = "DELETE FROM Greetings WHERE id = ?";
  db.query(sql, [greetingId], (err, result) => {
    if (err) {
      console.error("Error al eliminar el mensaje de saludo:", err);
      res.status(500).send("Error al eliminar el mensaje de saludo");
    } else {
      res.send("Mensaje de saludo eliminado correctamente");
    }
  });
});

module.exports = router;
