const express = require("express");
const router = express.Router();
const db = require("../../db/connection.js");

router.get("/category/:category", (req, res) => {
    const category = req.params.category;
    const userId = req.query.userId; // Obtener userId de la consulta URL
    const sql = `
      SELECT p.*, 
             (CASE WHEN sp.userId IS NOT NULL THEN true ELSE false END) AS saved,
             (CASE WHEN l.userId IS NOT NULL THEN true ELSE false END) AS liked
      FROM Posts p
      LEFT JOIN SavedPosts sp ON p.id = sp.postId AND sp.userId = ?
      LEFT JOIN Likes l ON p.id = l.postId AND l.userId = ?
      WHERE p.category = ?
      ORDER BY p.createdAt DESC
      LIMIT 10`;
    db.query(sql, [userId, userId, category], (err, results) => {
      if (err) {
        console.error("Error al obtener posts por categoría:", err);
        res.status(500).send("Error al obtener posts por categoría");
      } else {
        res.json(results);
      }
    });
  });
  
  // Ruta para obtener los posts con más likes
  router.get("/popular", (req, res) => {
    const userId = req.query.userId; // Obtener userId de la consulta URL
    const sql = `
      SELECT p.*, 
             (CASE WHEN sp.userId IS NOT NULL THEN true ELSE false END) AS saved,
             (CASE WHEN l.userId IS NOT NULL THEN true ELSE false END) AS liked
      FROM Posts p
      LEFT JOIN SavedPosts sp ON p.id = sp.postId AND sp.userId = ?
      LEFT JOIN Likes l ON p.id = l.postId AND l.userId = ?
      ORDER BY p.likes DESC
      LIMIT 10`;
    db.query(sql, [userId, userId], (err, results) => {
      if (err) {
        console.error("Error al obtener posts populares:", err);
        res.status(500).send("Error al obtener posts populares");
      } else {
        res.json(results);
      }
    });
  });

module.exports = router;
