const express = require("express");
const router = express.Router();
const db = require("../../db/connection.js");


// Ruta para guardar un post por un usuario
router.post("/:postId/save", (req, res) => {
    const userId = req.body.userId;
    const postId = req.params.postId;
    const sql = "INSERT INTO SavedPosts (userId, postId) VALUES (?, ?)";
    db.query(sql, [userId, postId], (err, result) => {
      if (err) {
        console.error("Error al guardar el post:", err);
        res.status(500).send("Error al guardar el post");
      } else {
        res.status(201).send("Post guardado correctamente");
      }
    });
  });
  
  router.delete("/:postId/save/", (req, res) => {
      const userId = req.query.userId;
      const postId = req.params.postId;
      const sql = "DELETE FROM Likes WHERE userId = ? AND postId = ?";
      db.query(sql, [userId, postId], (err, result) => {
        if (err) {
          console.error("Error al desguardar el post:", err);
          res.status(500).send("Error al desguardar el post");
        } else {
          res.status(201).send("Post desguardado correctamente");
        }
      });
    });
  
  // Ruta para likear un post por un usuario
  router.post("/:postId/like", (req, res) => {
    const userId = req.body.userId;
    const postId = req.params.postId;
    const sql = "INSERT INTO Likes (userId, postId) VALUES (?, ?)";
    db.query(sql, [userId, postId], (err, result) => {
      if (err) {
        console.error("Error al dar like al post:", err);
        res.status(500).send("Error al dar like al post");
      } else {
        res.status(201).send("Like agregado al post");
      }
    });
  });

  
// Ruta para deslikear un post por un usuario
router.delete("/:postId/like", (req, res) => {
  const userId = req.query.userId;
  const postId = req.params.postId;
    const sql = "DELETE FROM Likes WHERE userId = ? AND postId = ?";
    db.query(sql, [userId, postId], (err, result) => {
      if (err) {
        console.error("Error al quitar like al post:", err);
        res.status(500).send("Error al quitar like al post");
      } else {
        res.send("Like removido del post");
      }
    });
  });
  
module.exports = router;
