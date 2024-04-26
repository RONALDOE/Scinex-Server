DROP DATABASE IF EXISTS scinex;
CREATE DATABASE scinex;
    -- Tabla de Usuarios
USE scinex;

CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    badge VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Posts
CREATE TABLE Posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    image VARCHAR(255),
    userId INT NOT NULL,
    likes INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Tabla de Comentarios
CREATE TABLE Comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT,
    userId INT NOT NULL,
    postId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (postId) REFERENCES Posts(id)
);

-- Tabla de Proyectos
CREATE TABLE Projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    userId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Tabla de Likes
CREATE TABLE Likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    postId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (postId) REFERENCES Posts(id)
);

-- Tabla de Imágenes
CREATE TABLE Images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    imageUrl VARCHAR(255) NOT NULL,
    postId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postId) REFERENCES Posts(id)
);


CREATE TABLE Badges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    imageUrl VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE SavedPosts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    postId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (postId) REFERENCES Posts(id)
);

-- Tabla de Saludos o Mensajes de Usuarios
CREATE TABLE UserGreetings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    userId INT NOT NULL UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id)
);

CREATE TABLE ProjectGreetings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    projectId INT NOT NULL UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (projectId) REFERENCES Projects(id)
);

-- Tabla de Miembros (Relación entre Usuarios y Proyectos)
CREATE TABLE Members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    projectId INT NOT NULL,
    role VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (projectId) REFERENCES Projects(id)
);


-- Datos de Usuarios    
INSERT INTO Users (username, email, image, badge) VALUES
    ('john_doe', 'john@example.com', 'profile1.jpg', 'Beginner'),
    ('alice_smith', 'alice@example.com', 'profile2.jpg', 'Pro'),
    ('sam_jones', 'sam@example.com', 'profile3.jpg', 'Intermediate');

-- Datos de Publicaciones (Posts)
INSERT INTO Posts (title, content, image, userId, likes) VALUES
    ('Mi primer post', '¡Hola mundo!', 'post1.jpg', 1, 10),
    ('Ideas de proyectos', 'Compartiendo algunas ideas geniales...', 'post2.jpg', 2, 15),
    ('Evento próximo', 'No se lo pierdan, será increíble.', 'post3.jpg', 3, 5);

-- Datos de Comentarios (Comments)
INSERT INTO Comments (content, userId, postId) VALUES
    ('¡Gran inicio!', 1, 1),
    ('Me encantan estas ideas.', 2, 2),
    ('No puedo esperar para asistir.', 3, 3);

-- Datos de Proyectos (Projects)
INSERT INTO Projects (name, description, userId) VALUES
    ('Proyecto A', 'Un proyecto emocionante en desarrollo.', 1),
    ('Proyecto B', 'Investigando nuevas tecnologías.', 2),
    ('Proyecto C', 'Colaboración abierta, ¡únete!', 3);

-- Datos de Likes (Likes)
INSERT INTO Likes (userId, postId) VALUES
    (1, 2),
    (2, 1),
    (3, 3),
    (1, 3);

-- Datos de Imágenes (Images)
INSERT INTO Images (imageUrl, postId) VALUES
    ('image1.jpg', 1),
    ('image2.jpg', 2),
    ('image3.jpg', 3);

-- Datos de Insignias (Badges)
INSERT INTO Badges (name, description, imageUrl) VALUES
    ('Principiante', 'Usuario nuevo en la plataforma.', 'badge1.jpg'),
    ('Experto', 'Usuario con experiencia destacada.', 'badge2.jpg'),
    ('Colaborador', 'Contribuidor activo en la comunidad.', 'badge3.jpg');

-- Datos de Posts Guardados (SavedPosts)
INSERT INTO SavedPosts (userId, postId) VALUES
    (1, 2),
    (2, 3),
    (3, 1);

INSERT INTO UserGreetings (title, content, userId) VALUES
    ('Hola', '¡Hola a todos!', 1),
    ('Buenos días', 'Espero que tengan un buen día.', 2),
    ('Saludos', '¡Saludos desde mi parte!', 3);

INSERT INTO ProjectGreetings (title, content, projectId) VALUES
    ('Hola', '¡Hola a todos!', 1),
    ('Buenos días', 'Espero que tengan un buen día.', 2),
    ('Saludos', '¡Saludos desde mi parte!', 3);

-- Datos de Miembros (Members)
INSERT INTO Members (userId, projectId, role) VALUES
    (1, 1, 'Administrador'),
    (2, 1, 'Miembro'),
    (3, 2, 'Miembro'),
    (1, 3, 'Colaborador'),
    (2, 3, 'Colaborador');
