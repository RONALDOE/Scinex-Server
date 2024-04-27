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

// Ruta para seguir un proyecto
router.post("/:projectId/follow", (req, res) => {
  const userId = req.body.userId;
  const projectId = req.params.projectId;

  // Verificar si el usuario ya sigue el proyecto
  const checkQuery = "SELECT COUNT(*) AS count FROM Members WHERE userId = ? AND projectId = ?";
  db.query(checkQuery, [userId, projectId], (err, result) => {
    if (err) {
      console.error("Error al verificar la membresía del usuario:", err);
      res.status(500).send("Error interno del servidor");
    } else {
      const isFollowing = result[0].count > 0;

      if (isFollowing) {
        // Si el usuario ya sigue el proyecto, eliminarlo como miembro
        const deleteQuery = "DELETE FROM Members WHERE userId = ? AND projectId = ?";
        db.query(deleteQuery, [userId, projectId], (err) => {
          if (err) {
            console.error("Error al dejar de seguir el proyecto:", err);
            res.status(500).send("Error interno del servidor");
          } else {
            res.status(200).send("El usuario dejó de seguir el proyecto");
          }
        });
      } else {
        // Si el usuario no sigue el proyecto, agregarlo como miembro
        const insertQuery = "INSERT INTO Members (userId, projectId) VALUES (?, ?)";
        db.query(insertQuery, [userId, projectId], (err) => {
          if (err) {
            console.error("Error al seguir el proyecto:", err);
            res.status(500).send("Error interno del servidor");
          } else {
            res.status(200).send("El usuario empezó a seguir el proyecto");
          }
        });
      }
    }
  });
});

router.get("/", (req, res) => {
  const userId = req.query.userId;
  const sql = `
    SELECT 
      Projects.id AS projectId,
      Projects.name AS projectName,
      Projects.description AS projectDescription,
      Categories.id AS categoryId,
      Categories.name AS categoryName,
      Categories.description AS categoryDescription,
      Users.id AS userId,
      Users.username AS username,
      Users.email AS email,
      Users.image AS userImage,
      Users.badge AS userBadge,
      Projects.backgroundImgUrl AS backgroundUrl,
      Projects.imgUrl AS image,
      Projects.createdAt AS projectCreatedAt,
      Projects.updatedAt AS projectUpdatedAt,
      COUNT(Members.userId) AS membersQuantity,
      EXISTS (
        SELECT 1 FROM Members WHERE projectId = Projects.id AND userId = ?
      ) AS isUserMember
    FROM 
      Projects
    INNER JOIN 
      Categories ON Projects.categoryId = Categories.id
    INNER JOIN 
      Users ON Projects.userId = Users.id
    LEFT JOIN 
      Members ON Projects.id = Members.projectId
    GROUP BY 
      Projects.id;
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error al obtener los proyectos:", err);
      res.status(500).send("Error al obtener los proyectos");
    } else {
      if (results.length > 0) {
        const projects = results.map((result) => {
          return {
            id: result.projectId,
            name: result.projectName,
            description: result.projectDescription,
            category: {
              id: result.categoryId,
              name: result.categoryName,
              description: result.categoryDescription,
              createdAt: result.projectCreatedAt,
              updatedAt: result.projectUpdatedAt
            },
            user: {
              id: result.userId,
              username: result.username,
              email: result.email,
              image: result.userImage,
              badge: result.userBadge
            },
            backgroundUrl: result.backgroundUrl,
            image: result.image,
            createdAt: result.projectCreatedAt,
            updatedAt: result.projectUpdatedAt,
            membersQuantity: result.membersQuantity,
            isUserMember: result.isUserMember === 1
          };
        });
        res.json(projects);
      } else {
        res.status(404).send("No se encontraron proyectos");
      }
    }
  });
});



router.get("/category/:categoryId", (req, res) => {
  const categoryId = req.params.categoryId;
  const sql = "SELECT * FROM Projects WHERE categoryId = ?";
  db.query(sql, [categoryId], (err, result) => {
    if (err) {
      console.error("Error al obtener el proyecto por ID:", err);
      res.status(500).send("Error al obtener el proyecto por ID");
    } else {
      if (result.length > 0) {
        console.log(result);
        res.json(result);
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
