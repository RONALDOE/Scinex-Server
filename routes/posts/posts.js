const express = require("express");
const router = express.Router();
const db = require("../../db/connection.js");

// Ruta para obtener un post por su ID con comentarios
router.get("/:postId", (req, res) => {
  const postId = req.params.postId;
  const userId = req.query.userId; // Obtener userId de la consulta URL

  // Consulta para obtener el post y verificar la interacción del usuario
  const postSql = `
    SELECT p.*, 
           u.id AS userId,
           u.username,
           u.badge,
           IF(l.userId IS NOT NULL, true, false) AS saved,
             IF(sp.userId IS NOT NULL, true, false) AS liked
    FROM Posts p
    INNER JOIN Users u ON p.userId = u.id
    LEFT JOIN SavedPosts sp ON p.id = sp.postId AND sp.userId = ?
    LEFT JOIN Likes l ON p.id = l.postId AND l.userId = ?
    WHERE p.id = ?`;

  // Consulta para obtener los comentarios asociados al post con detalles del usuario
  const commentsSql = `
    SELECT c.*, 
           u.id AS userId,
           u.username,
           u.badge
    FROM Comments c
    INNER JOIN Users u ON c.userId = u.id
    WHERE c.postId = ?`;

  // Ejecutar ambas consultas en paralelo
  db.query(postSql, [userId, userId, postId], (err, postResult) => {
    if (err) {
      console.error("Error al obtener el post por ID:", err);
      res.status(500).send("Error al obtener el post por ID");
      return;
    }

    if (postResult.length === 0) {
      res.status(404).send("Post no encontrado");
      return;
    }

    const post = postResult[0]; // Obtener el post del resultado

    // Ejecutar la consulta de comentarios
    db.query(commentsSql, [postId], (err, commentsResult) => {
      if (err) {
        console.error("Error al obtener los comentarios del post:", err);
        res.status(500).send("Error al obtener los comentarios del post");
        return;
      }

      // Mapear los comentarios al formato deseado con el usuario representado
      const comentarios = commentsResult.map(comment => ({
        id: comment.id.toString(),
        content: comment.content,
        user: {
          id: comment.userId.toString(),
          username: comment.username,
          badge: comment.badge
        },
        postId: comment.postId.toString(),
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString()
      }));

      // Obtener el usuario del post
      const user = {
        id: post.userId.toString(),
        username: post.username,
        badge: post.badge
      };

      // Construir el objeto de respuesta con el post, usuario y comentarios
      const response = {
        post: {
          id: post.id.toString(),
          title: post.title,
          content: post.content,
          image: post.image || null,
          user,
          likes: post.likes,
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
          liked: post.liked,
          saved: post.saved
        },
        comments: comentarios // Array de comentarios en el formato deseado
      };

      res.json(response);
    });
  });
});

// Ruta para obtener todos los posts por usuario o proyecto
router.get("/:type/:id/posts", (req, res) => {
  const { type, id } = req.params;
  let sql;

  const userId = req.query.userId;

  if (type === "user") {
    // Búsqueda por usuario
    sql = `
      SELECT p.*, 
             (sp.userId IS NOT NULL) AS liked,
             (l.userId IS NOT NULL) AS saved,
             u.id AS userId,
             u.username,
             u.badge
             
      FROM Posts p
      LEFT JOIN SavedPosts sp ON p.id = sp.postId AND sp.userId = ?
      LEFT JOIN Likes l ON p.id = l.postId AND l.userId = ?
      INNER JOIN Users u ON p.userId = u.id
      WHERE p.userId = ?
      ORDER BY p.createdAt DESC`;
  } else if (type === "project") {
    // Búsqueda por proyecto (asumiendo que hay una relación userId en la tabla Projects)
    sql = `
      SELECT p.*, 
             (sp.userId IS NOT NULL) AS saved,
             (l.userId IS NOT NULL) AS liked,
             u.id AS userId,
             u.username,
             u.badge
      FROM Posts p
      LEFT JOIN SavedPosts sp ON p.id = sp.postId AND sp.userId = ?
      LEFT JOIN Likes l ON p.id = l.postId AND l.userId = ?
      INNER JOIN Users u ON p.userId = u.id
      WHERE p.userId IN (SELECT userId FROM Projects WHERE id = ?)
      ORDER BY p.createdAt DESC`;
  } else {
    return res.status(400).send("Tipo de búsqueda no válido");
  }

  db.query(sql, [userId, userId, id], (err, results) => {
    if (err) {
      console.error("Error al obtener los posts:", err);
      res.status(500).send("Error al obtener los posts");
    } else {
      // Formatear resultados como en /popular
      const formattedResults = results.map(post => ({
        id: post.id.toString(),
        title: post.title,
        content: post.content,
        image: post.image || null,
        user: {
          id: post.userId.toString(),
          username: post.username,
          badge: post.badge
        },
        likes: post.likes,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        liked: post.liked,
        saved: post.saved
      }));

      res.json(formattedResults);
    }
  });
});

// Ruta para obtener posts recientes por usuario o proyecto
router.get("/:type/:id/posts/recent", (req, res) => {
  const { type, id } = req.params;
  let sql;

  const userId = req.query.userId;

  if (type === "user") {
    // Búsqueda por usuario
    sql = `
      SELECT p.*, 
             (sp.userId IS NOT NULL) AS saved,
             (l.userId IS NOT NULL) AS liked,
             u.id AS userId,
             u.username,
             u.badge
      FROM Posts p
      LEFT JOIN SavedPosts sp ON p.id = sp.postId AND sp.userId = ?
      LEFT JOIN Likes l ON p.id = l.postId AND l.userId = ?
      INNER JOIN Users u ON p.userId = u.id
      WHERE p.userId = ?
      ORDER BY p.createdAt DESC
      LIMIT 5`;
  } else if (type === "project") {
    // Búsqueda por proyecto (asumiendo que hay una relación userId en la tabla Projects)
    sql = `
      SELECT p.*, 
             (sp.userId IS NOT NULL) AS saved,
             (l.userId IS NOT NULL) AS liked,
             u.id AS userId,
             u.username,
             u.badge
      FROM Posts p
      LEFT JOIN SavedPosts sp ON p.id = sp.postId AND sp.userId = ?
      LEFT JOIN Likes l ON p.id = l.postId AND l.userId = ?
      INNER JOIN Users u ON p.userId = u.id
      WHERE p.userId IN (SELECT userId FROM Projects WHERE id = ?)
      ORDER BY p.createdAt DESC
      LIMIT 5`;
  } else {
    return res.status(400).send("Tipo de búsqueda no válido");
  }

  db.query(sql, [userId, userId, id], (err, results) => {
    if (err) {
      console.error("Error al obtener los posts:", err);
      res.status(500).send("Error al obtener los posts");
    } else {
      // Formatear resultados como en /popular
      const formattedResults = results.map(post => ({
        id: post.id.toString(),
        title: post.title,
        content: post.content,
        image: post.image || null,
        user: {
          id: post.userId.toString(),
          username: post.username,
          badge: post.badge
        },
        likes: post.likes,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        liked: post.liked,
        saved: post.saved
      }));

      res.json(formattedResults);
    }
  });
});

// Ruta para crear un nuevo post
router.post("/:userId", (req, res) => {
  const { title, content, image } = req.body;
  const userId = req.params.userId;
  const sql = "INSERT INTO Posts (title, content, image, userId) VALUES (?, ?, ?, ?)";
  db.query(sql, [title, content, image, userId], (err, result) => {
    if (err) {
      console.error("Error al crear un nuevo post:", err);
      res.status(500).send("Error al crear un nuevo post");
    } else {
      console.log("Post creado correctamente"); 
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
