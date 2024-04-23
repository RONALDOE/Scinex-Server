const express = require("express");
const router = express.Router();
const db = require("../db/connection.js");

// Ruta para obtener todos los comentarios de un post
router.get("/:postId/comments", (req, res) => {
    const postId = req.params.postId;
    const sql = "SELECT * FROM Comments WHERE postId = ?";
    db.query(sql, [postId], (err, results) => {
      if (err) {
        console.error("Error al obtener los comentarios del post:", err);
        res.status(500).send("Error al obtener los comentarios del post");
      } else {
        res.json(results);
      }
    });
  });

// Ruta para agregar un comentario a un post
router.post("/:postId/comments", (req, res) => {
  const { postId, content, userId } = req.body;
  const sql = "INSERT INTO Comments (content, userId, postId) VALUES (?, ?, ?)";
  db.query(sql, [content, userId, postId], (err, result) => {
    if (err) {
      console.error("Error al agregar el comentario:", err);
      res.status(500).send("Error al agregar el comentario");
    } else {
      res.status(201).send("Comentario agregado correctamente");
    }
  });
});

// Ruta para actualizar un comentario por su ID
router.put("/:commentId", (req, res) => {
  const commentId = req.params.commentId;
  const { content } = req.body;
  const sql = "UPDATE Comments SET content = ? WHERE id = ?";
  db.query(sql, [content, commentId], (err, result) => {
    if (err) {
      console.error("Error al actualizar el comentario:", err);
      res.status(500).send("Error al actualizar el comentario");
    } else {
      res.send("Comentario actualizado correctamente");
    }
  });
});

// Ruta para eliminar un comentario por su ID
router.delete("/:commentId", (req, res) => {
  const commentId = req.params.commentId;
  const sql = "DELETE FROM Comments WHERE id = ?";
  db.query(sql, [commentId], (err, result) => {
    if (err) {
      console.error("Error al eliminar el comentario:", err);
      res.status(500).send("Error al eliminar el comentario");
    } else {
      res.send("Comentario eliminado correctamente");
    }
  });
});

module.exports = router;
