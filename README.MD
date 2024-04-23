### API de Gestión de Publicaciones y Usuarios

Este repositorio contiene una API para gestionar publicaciones, interacciones con publicaciones y usuarios. A continuación se detallan las rutas disponibles y su uso.

---

### Ruta para Guardar un Post por un Usuario

**Descripción:** Permite a un usuario guardar un post especificado por postId.

- **Verbo HTTP y Ruta:** `POST /:postId/save`
- **Valores Necesarios:**
  - `userId`: ID del usuario que está guardando el post (se espera en `req.body`).
  - `postId`: ID del post que se desea guardar (se extrae de los parámetros de la URL).
- **Ejemplo de Uso:**
  ```json
  POST /123/save
  {
    "userId": 456
  }
  ```

---

### Ruta para Eliminar el Guardado de un Post por un Usuario

**Descripción:** Permite a un usuario eliminar el guardado de un post especificado por postId.

- **Verbo HTTP y Ruta:** `DELETE /:postId/save`
- **Valores Necesarios:**
  - `userId`: ID del usuario que quiere eliminar el guardado del post (se espera en `req.body`).
  - `postId`: ID del post del cual se desea eliminar el guardado (se extrae de los parámetros de la URL).
- **Ejemplo de Uso:**
  ```json
  DELETE /123/save
  {
    "userId": 456
  }
  ```

---

### Ruta para Dar Like a un Post por un Usuario

**Descripción:** Permite a un usuario dar like a un post especificado por postId.

- **Verbo HTTP y Ruta:** `POST /:postId/like`
- **Valores Necesarios:**
  - `userId`: ID del usuario que está dando like al post (se espera en `req.body`).
  - `postId`: ID del post al cual se desea dar like (se extrae de los parámetros de la URL).
- **Ejemplo de Uso:**
  ```json
  POST /123/like
  {
    "userId": 456
  }
  ```

---

### Ruta para Quitar el Like de un Post por un Usuario

**Descripción:** Permite a un usuario quitar el like de un post especificado por postId.

- **Verbo HTTP y Ruta:** `DELETE /:postId/like`
- **Valores Necesarios:**
  - `userId`: ID del usuario que quiere quitar el like del post (se espera en `req.body`).
  - `postId`: ID del post del cual se desea quitar el like (se extrae de los parámetros de la URL).
- **Ejemplo de Uso:**
  ```json
  DELETE /123/like
  {
    "userId": 456
  }
  ```

---

### Ruta para Obtener un Post por ID

**Descripción:** Busca un post específico por su ID (postId) y verifica si el usuario (userId) proporcionado ha guardado o dado like al post.

- **Verbo HTTP y Ruta:** `GET /post/:postId`
- **Valores Necesarios:**
  - `postId`: ID del post que se desea obtener (se espera en los parámetros de la URL).
  - `userId`: ID del usuario para verificar si ha guardado o dado like al post (se espera como un parámetro de consulta).
- **Ejemplo de Uso:** `GET /post/123?userId=456`

---

### Ruta para Obtener Todos los Posts por Usuario o Proyecto

**Descripción:** Busca todos los posts asociados a un usuario o proyecto específico, y verifica si el usuario (id) proporcionado ha guardado o dado like a cada post.

- **Verbo HTTP y Ruta:** `GET /:type/:id/posts`
- **Valores Necesarios:**
  - `type`: Tipo de búsqueda (`user` para buscar por usuario, `project` para buscar por proyecto).
  - `id`: ID del usuario o proyecto del cual se desean obtener los posts (se espera en los parámetros de la URL).
- **Ejemplo de Uso:**
  - `GET /user/456/posts` para obtener posts de un usuario específico.
  - `GET /project/789/posts` para obtener posts asociados a un proyecto específico.

---

### Ruta para Crear un Nuevo Post

**Descripción:** Permite crear un nuevo post con título, contenido, imagen y asociado a un usuario específico.

- **Verbo HTTP y Ruta:** `POST /`
- **Valores Necesarios en el Cuerpo de la Solicitud (`req.body`):**
  - `title`: Título del post.
  - `content`: Contenido del post.
  - `image`: URL de la imagen asociada al post.
  - `userId`: ID del usuario que crea el post.
- **Ejemplo de Uso:**
  ```json
  POST /
  {
    "title": "Nuevo Post",
    "content": "Contenido del nuevo post",
    "image": "https://example.com/image.jpg",
    "userId": 456
  }
  ```

---

### Ruta para Eliminar un Post por ID

**Descripción:** Permite eliminar un post específico por su ID (postId).

- **Verbo HTTP y Ruta:** `DELETE /:id`
- **Valores Necesarios:**
  - `id`: ID del post que se desea eliminar (se espera en los parámetros de la URL).
- **Ejemplo de Uso:** `DELETE /123

` para eliminar el post con ID `123`.

---

### Ruta para Actualizar un Post por ID

**Descripción:** Permite actualizar un post existente por su ID (postId), modificando su título, contenido y/o imagen.

- **Verbo HTTP y Ruta:** `PUT /:id`
- **Valores Necesarios:**
  - `id`: ID del post que se desea actualizar (se espera en los parámetros de la URL).
  - Datos actualizados del post en el cuerpo de la solicitud (`req.body`): `title`, `content`, `image`.
- **Ejemplo de Uso:**
  ```json
  PUT /123
  {
    "title": "Post Actualizado",
    "content": "Nuevo contenido del post",
    "image": "https://example.com/new_image.jpg"
  }
  ```

---

### Ruta para Obtener Posts por Categoría

**Descripción:** Busca posts filtrados por una categoría específica.

- **Verbo HTTP y Ruta:** `GET /category/:category`
- **Valores Necesarios:**
  - `category`: Categoría por la cual se desea filtrar los posts (se espera en los parámetros de la URL).
  - `userId`: ID del usuario para verificar si ha guardado o dado like a cada post (se espera como un parámetro de consulta en la URL).
- **Ejemplo de Uso:** `GET /category/technology?userId=456`

---

### Ruta para Obtener Posts Más Populares

**Descripción:** Busca los posts más populares ordenados por cantidad de likes.

- **Verbo HTTP y Ruta:** `GET /popular`
- **Valores Necesarios:**
  - `userId`: ID del usuario para verificar si ha guardado o dado like a cada post (se espera como un parámetro de consulta en la URL).
- **Ejemplo de Uso:** `GET /popular?userId=456`

---

### Rutas para Gestión de Comentarios y Proyectos

Para gestionar comentarios y proyectos, consulta las rutas definidas en el [README.md](#) del repositorio.