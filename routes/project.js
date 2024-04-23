const express = require("express");
const router = express.Router();
const db = require("../db/connection.js");

// Ruta para crear un nuevo proyecto
router.post("/", (req, res) => {
  const { name, description, userId } = req.body;
  const sql = "INSERT INTO Projects (name, description, userId) VALUES (?, ?, ?)";
  db.query(sql, [name, description, userId], (err, result) => {
    if (err) {
      console.error("Error al crear un nuevo proyecto:", err);
      res.status(500).send("Error al crear un nuevo proyecto");
    } else {
      res.status(201).send("Proyecto creado correctamente");
    }
  });
});

// Ruta para obtener todos los proyectos de un usuario
router.get("/user/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT * FROM Projects WHERE userId = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error al obtener los proyectos del usuario:", err);
      res.status(500).send("Error al obtener los proyectos del usuario");
    } else {
      res.json(results);
    }
  });
});

// Ruta para obtener un proyecto por su ID
router.get("/:projectId", (req, res) => {
  const projectId = req.params.projectId;
  const sql = "SELECT * FROM Projects WHERE id = ?";
  db.query(sql, [projectId], (err, result) => {
    if (err) {
      console.error("Error al obtener el proyecto por ID:", err);
      res.status(500).send("Error al obtener el proyecto por ID");
    } else {
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.status(404).send("Proyecto no encontrado");
      }
    }
  });
});

// Ruta para actualizar un proyecto por su ID
router.put("/:projectId", (req, res) => {
  const projectId = req.params.projectId;
  const { name, description } = req.body;
  const sql = "UPDATE Projects SET name = ?, description = ? WHERE id = ?";
  db.query(sql, [name, description, projectId], (err, result) => {
    if (err) {
      console.error("Error al actualizar el proyecto:", err);
      res.status(500).send("Error al actualizar el proyecto");
    } else {
      res.send("Proyecto actualizado correctamente");
    }
  });
});

// Ruta para eliminar un proyecto por su ID
router.delete("/:projectId", (req, res) => {
  const projectId = req.params.projectId;
  const sql = "DELETE FROM Projects WHERE id = ?";
  db.query(sql, [projectId], (err, result) => {
    if (err) {
      console.error("Error al eliminar el proyecto:", err);
      res.status(500).send("Error al eliminar el proyecto");
    } else {
      res.send("Proyecto eliminado correctamente");
    }
  });
});

module.exports = router;
