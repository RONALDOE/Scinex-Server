const express = require("express");
const router = express.Router();
const db = require("../../db/connection.js");

router.get("/category/:category", (req, res) => {
    const category = req.params.category;
    const userId = req.query.userId; // Obtener userId de la consulta URL
    const sql = `
      SELECT p.*, 
             (CASE WHEN sp.userId IS NOT NULL THEN true ELSE false END) AS liked,
             (CASE WHEN l.userId IS NOT NULL THEN true ELSE false END) AS saved
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

//Si, ya se que esta al revez los if, pero juro por Dios, que si lo pongo al derecho no me funciona
//Alguna vez has leido sobre el coco de TF2? Pues ya puedes entender mi confusión

  router.get("/popular", (req, res) => {
    const userId = req.query.userId; // Obtener userId de la consulta URL
    const sql = `
      SELECT p.*, 
             u.id as userId,
             u.username,
             u.badge,
             IF(l.userId IS NOT NULL, true, false) AS saved,
             IF(sp.userId IS NOT NULL, true, false) AS liked
      FROM Posts p
      INNER JOIN Users u ON p.userId = u.id
      LEFT JOIN SavedPosts sp ON p.id = sp.postId AND sp.userId = ?
      LEFT JOIN Likes l ON p.id = l.postId AND l.userId = ?
      ORDER BY p.likes DESC
      LIMIT 10`;
  
    db.query(sql, [userId, userId], (err, results) => {
      if (err) {
        console.error("Error al obtener posts populares:", err);
        res.status(500).send("Error al obtener posts populares");
      } else {
        // Transformar los resultados al formato deseado (IPost)
        const formattedResults = results.map((post) => ({
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
          liked: post.liked === 1,
          saved: post.saved === 1,
        }));
        
        console.log(results[0])
        res.json(formattedResults);
      }
    });
  });
  


module.exports = router;
