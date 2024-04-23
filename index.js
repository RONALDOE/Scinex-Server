const express = require('express')
const app = express();
const db = require('./db/connection.js');
require('dotenv').config();

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
      
            res.json({ results });
          } else {
            res.sendStatus(401);
          }
        });
      
      

      // Cierra la conexión
      await db.end();
  } catch (error) {
      console.error('Error al verificar la conexión a la base de datos:', error);
      res.status(500).send('Error al verificar la conexión a la base de datos.');
  }
});

app.listen( process.env.PORT || 3000, () => {
  console.log('Server running ');
});

 
app.get('/', (req, res) => {
  res.send('Hello World!');
});




console.log('Server running on port 3000');
