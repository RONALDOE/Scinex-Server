DROP DATABASE IF EXISTS scinex;
CREATE DATABASE scinex;
    -- Tabla de Usuarios
USE scinex;

CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    backgroundImgUrl VARCHAR(255),
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

CREATE TABLE Categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Proyectos
CREATE TABLE Projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    categoryId INT NOT NULL,
    userId INT NOT NULL,
    backgroundImgUrl VARCHAR(255),
    imgUrl VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (categoryID) REFERENCES Categories(id)
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

-- Crear la tabla de Categorías


INSERT INTO Categories (name, description) VALUES
    ('Tecnología', 'Categoría relacionada con avances tecnológicos y gadgets.'),
    ('Ciencia', 'Categoría dedicada a descubrimientos científicos y avances en la investigación.'),
    ('Arte', 'Categoría para expresiones artísticas y creatividad.'),
    ('Deportes', 'Categoría para temas relacionados con el mundo del deporte.');

INSERT INTO Users (username, email, image, badge) VALUES
    ('john_doe', 'john@example.com', 'profile1.jpg', 'Beginner'),
    ('alice_smith', 'alice@example.com', 'profile2.jpg', 'Pro'),
    ('sam_jones', 'sam@example.com', 'profile3.jpg', 'Intermediate');

INSERT INTO Posts (title, content, image, userId, likes) VALUES
    ('Mi primer post', '¡Hola mundo!', 'post1.jpg', 1, 10),
    ('Ideas de proyectos', 'Compartiendo algunas ideas geniales...', 'post2.jpg', 2, 15),
    ('Evento próximo', 'No se lo pierdan, será increíble.', 'post3.jpg', 3, 5);

INSERT INTO Comments (content, userId, postId) VALUES
    ('¡Gran inicio!', 1, 1),
    ('Me encantan estas ideas.', 2, 2),
    ('No puedo esperar para asistir.', 3, 3);

INSERT INTO Projects (name, description, userId, categoryId) VALUES
    ('Proyecto A', 'Un proyecto emocionante en desarrollo.', 1, 1),
    ('Proyecto B', 'Investigando nuevas tecnologías.', 2, 1),
    ('Proyecto C', 'Colaboración abierta, ¡únete!', 3, 2);


INSERT INTO Likes (userId, postId) VALUES
    (1, 2),
    (2, 1),
    (3, 3),
    (1, 3);

INSERT INTO Images (imageUrl, postId) VALUES
    ('image1.jpg', 1),
    ('image2.jpg', 2),
    ('image3.jpg', 3);


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

INSERT INTO Members (userId, projectId, role) VALUES
    (1, 1, 'Administrador'),
    (2, 1, 'Miembro'),
    (3, 2, 'Miembro'),
    (1, 3, 'Colaborador'),
    (2, 3, 'Colaborador');
