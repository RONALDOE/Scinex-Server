const express = require("express");
const router = express.Router();
const db = require("../../db/connection.js");

// Ruta para obtener un post por id
router.get("/post/:postId", (req, res) => {
  const postId = req.params.postId;
  const userId = req.query.userId; // Obtener userId de la consulta URL
  const sql = `
    SELECT p.*, 
           (CASE WHEN sp.userId IS NOT NULL THEN true ELSE false END) AS saved,
           (CASE WHEN l.userId IS NOT NULL THEN true ELSE false END) AS liked
    FROM Posts p
    LEFT JOIN SavedPosts sp ON p.id = sp.postId AND sp.userId = ?
    LEFT JOIN Likes l ON p.id = l.postId AND l.userId = ?
    WHERE p.id = ?`;
  db.query(sql, [userId, userId, postId], (err, result) => {
    if (err) {
      console.error("Error al obtener el post por ID:", err);
      res.status(500).send("Error al obtener el post por ID");
    } else {
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.status(404).send("Post no encontrado");
      }
    }
  });
});


// Ruta para obtener todos los posts por usuario o proyecto
router.get("/:type/:id/posts", (req, res) => {
  const { type, id } = req.params;
  let sql;

  if (type === "user") {
    // Búsqueda por usuario
    sql = `
      SELECT p.*, 
             (CASE WHEN sp.userId IS NOT NULL THEN true ELSE false END) AS saved,
             (CASE WHEN l.userId IS NOT NULL THEN true ELSE false END) AS liked
      FROM Posts p
      LEFT JOIN SavedPosts sp ON p.id = sp.postId AND sp.userId = ?
      LEFT JOIN Likes l ON p.id = l.postId AND l.userId = ?
      WHERE p.userId = ?
      ORDER BY p.createdAt DESC`;
  } else if (type === "project") {
    // Búsqueda por proyecto (asumiendo que hay una relación userId en la tabla Projects)
    sql = `
      SELECT p.*, 
             (CASE WHEN sp.userId IS NOT NULL THEN true ELSE false END) AS saved,
             (CASE WHEN l.userId IS NOT NULL THEN true ELSE false END) AS liked
      FROM Posts p
      LEFT JOIN SavedPosts sp ON p.id = sp.postId AND sp.userId = ?
      LEFT JOIN Likes l ON p.id = l.postId AND l.userId = ?
      WHERE p.userId IN (SELECT userId FROM Projects WHERE id = ?)
      ORDER BY p.createdAt DESC`;
  } else {
    return res.status(400).send("Tipo de búsqueda no válido");
  }

  db.query(sql, [id, id, id], (err, results) => {
    if (err) {
      console.error("Error al obtener los posts:", err);
      res.status(500).send("Error al obtener los posts");
    } else {
      res.json(results);
    }
  });
});



// Ruta para crear un nuevo post
router.post("/", (req, res) => {
  console.log(req.body);
  const { title, content, image, userId } = req.body;
  const sql = "INSERT INTO Posts (title, content, image, userId) VALUES (?, ?, ?, ?)";
  db.query(sql, [title, content, image, userId], (err, result) => {
    if (err) {
      console.error("Error al crear un nuevo post:", err);
      res.status(500).send("Error al crear un nuevo post");
    } else {
      res.status(201).send("Post creado correctamente");
    }
  });
});

// Ruta para eliminar un post por ID
router.delete("/:id", (req, res) => {
  const postId = req.params.id;
  const sql = "DELETE FROM Posts WHERE id = ?";
  db.query(sql, [postId], (err, result) => {
    if (err) {
      console.error("Error al eliminar el post:", err);
      res.status(500).send("Error al eliminar el post");
    } else {
      res.send("Post eliminado correctamente");
    }
  });
});

// Ruta para actualizar un post por ID
router.put("/:id", (req, res) => {
  const postId = req.params.id;
  const { title, content, image } = req.body;
  const sql = "UPDATE Posts SET title = ?, content = ?, image = ? WHERE id = ?";
  db.query(sql, [title, content, image, postId], (err, result) => {
    if (err) {
      console.error("Error al actualizar el post:", err);
      res.status(500).send("Error al actualizar el post");
    } else {
      res.send("Post actualizado correctamente");
    }
  });
});

module.exports = router;
