const express = require("express");
const router = express.Router();
const db = require("../../db/connection.js");
router.post("/:postId/save", (req, res) => {
  const userId = req.body.userId;
  const postId = req.params.postId;

  // Consultar si el usuario ya ha guardado el post
  const checkSaveSql = "SELECT * FROM SavedPosts WHERE userId = ? AND postId = ?";
  db.query(checkSaveSql, [userId, postId], (err, rows) => {
    if (err) {
      console.error("Error al verificar si el post está guardado:", err);
      res.status(500).send("Error al verificar si el post está guardado");
      return;
    }

    if (rows.length > 0) {
      // Si el usuario ya ha guardado el post, eliminar la entrada
      const deleteSaveSql = "DELETE FROM SavedPosts WHERE userId = ? AND postId = ?";
      db.query(deleteSaveSql, [userId, postId], (err, result) => {
        if (err) {
          console.error("Error al eliminar la entrada de guardado del post:", err);
          res.status(500).send("Error al eliminar la entrada de guardado del post");
        } else {
          res.status(200).send("Post eliminado de guardados correctamente");
        }
      });
    } else {
      // Si el usuario no ha guardado el post, agregar una nueva entrada
      const addSaveSql = "INSERT INTO SavedPosts (userId, postId) VALUES (?, ?)";
      db.query(addSaveSql, [userId, postId], (err, result) => {
        if (err) {
          console.error("Error al guardar el post:", err);
          res.status(500).send("Error al guardar el post");
        } else {
          res.status(201).send("Post guardado correctamente");
        }
      });
    }
  });
});


// // Ruta para desguardar un post por un usuario
// router.delete("/:postId/save", (req, res) => {
//   const userId = req.query.userId;
//   const postId = req.params.postId;

//   const sql = "DELETE FROM SavedPosts WHERE userId = ? AND postId = ?";
//   db.query(sql, [userId, postId], (err, result) => {
//     if (err) {
//       console.error("Error al desguardar el post:", err);
//       res.status(500).send("Error al desguardar el post");
//     } else {
//       res.status(200).send("Post desguardado correctamente");
//     }
//   });
// });

// Ruta para likear un post por un usuario
router.post("/:postId/like", (req, res) => {
  const userId = req.body.userId;
  const postId = req.params.postId;

  // Consultar si el usuario ya ha dado like al post
  const checkLikeSql = "SELECT * FROM Likes WHERE userId = ? AND postId = ?";
  db.query(checkLikeSql, [userId, postId], (err, rows) => {
    if (err) {
      console.error("Error al verificar el like del usuario:", err);
      res.status(500).send("Error al verificar el like del usuario");
      return;
    }

    if (rows.length > 0) {
      // Si el usuario ya ha dado like, eliminar el like existente
      const deleteLikeSql = "DELETE FROM Likes WHERE userId = ? AND postId = ?";
      db.query(deleteLikeSql, [userId, postId], (err, result) => {
        if (err) {
          console.error("Error al eliminar el like del usuario:", err);
          res.status(500).send("Error al eliminar el like del usuario");
        } else {
          // Disminuir el contador de likes del post
          const decreaseLikesSql = "UPDATE Posts SET likes = likes - 1 WHERE id = ?";
          db.query(decreaseLikesSql, [postId], (err, result) => {
            if (err) {
              console.error("Error al disminuir los likes del post:", err);
              res.status(500).send("Error al disminuir los likes del post");
            } else {
              res.status(200).send("Like eliminado del post");
            }
          });
        }
      });
    } else {
      // Si el usuario no ha dado like, agregar un nuevo like
      const addLikeSql = "INSERT INTO Likes (userId, postId) VALUES (?, ?)";
      db.query(addLikeSql, [userId, postId], (err, result) => {
        if (err) {
          console.error("Error al dar like al post:", err);
          res.status(500).send("Error al dar like al post");
        } else {
          // Aumentar el contador de likes del post
          const increaseLikesSql = "UPDATE Posts SET likes = likes + 1 WHERE id = ?";
          db.query(increaseLikesSql, [postId], (err, result) => {
            if (err) {
              console.error("Error al aumentar los likes del post:", err);
              res.status(500).send("Error al aumentar los likes del post");
            } else {
              res.status(201).send("Like agregado al post");
            }
          });
        }
      });
    }
  });
});

  // // Ruta para deshacer like en un post por un usuario
  // router.delete("/:postId/like", (req, res) => {
  //   const userId = req.query.userId;
  //   const postId = req.params.postId;

  //   const sql = "DELETE FROM Likes WHERE userId = ? AND postId = ?";
  //   db.query(sql, [userId, postId], (err, result) => {
  //     if (err) {
  //       console.error("Error al quitar like al post:", err);
  //       res.status(500).send("Error al quitar like al post");
  //     } else {
  //       const sql2 = "UPDATE Posts SET likes = likes - 1 WHERE id = ?";
  //       db.query(sql2, [postId], (err, result) => {
  //         if (err) {
  //           console.error("Error al actualizar likes del post:", err); 
  //           res.status(500).send("Error al actualizar likes del post");
  //         }else{

  //           res.status(201).send("Like desagregado al post");
  //         }
  //       }
      
  //     );
  //     }
  //   });
  // });

module.exports = router;
