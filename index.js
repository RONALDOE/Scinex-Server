const express = require('express')
const app = express();
const db = require('./db/connection.js');
const bodyParser = require('body-parser')
const cors = require('cors');
require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(cors());
app.use(bodyParser.json())
app.get('/check-db-connection', async (req, res) => {
  try {
      // Crea una conexión a la base de datos usando mysql2
    
      // Realiza una consulta simple para verificar la conexión
      const query = 'SELECT 1 + 1 AS result'
        db.query(query, (error, results) => {
          if (error) {
            console.error(error);
            res.sendStatus(500);
            return;
          }
       
          if (results.length > 0) {
      
            res.send("Everithing is ok!");
          } else {
      
            res.sendStatus(401);
          }
        });
      
      

      // Cierra la conexión
  } catch (error) {
      console.error('Error al verificar la conexión a la base de datos:', error);
      res.status(500).send('Error al verificar la conexión a la base de datos.');
  }
});



app.get("/categories", (req, res) => {
  const sql = "SELECT * FROM Categories";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener las categorías:", err);
      res.status(500).send("Error interno del servidor");
    } else {
      res.json(results);
    }
  });
});
app.use('/user', require('./routes/user.js'));
app.use('/comments', require('./routes/comment.js'));
app.use('/project', require('./routes/project.js'));
app.use('/greetings', require('./routes/greetings.js'));
app.use('/', require('./routes/posts/postsIndex.js'));

app.listen( process.env.PORT || 3000, () => {
  console.log('Server running ');
});

 
app.get('/', (req, res) => {
  res.send('Hello World!');
});




console.log('Server running on port 3000');
