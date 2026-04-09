CREATE DATABASE dbClientes;
GO

USE dbClientes;
GO

CREATE TABLE tblCliente (
    idCliente INT IDENTITY(1,1) PRIMARY KEY,
    nombreCliente VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(320) NOT NULL UNIQUE,
    fecha DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE tblProducto (
    idProducto INT IDENTITY(1,1) PRIMARY KEY,
    nombreProducto VARCHAR(50) NOT NULL,
    descripcion VARCHAR(8000) NOT NULL,
    valorUnitario NUMERIC(10,2) NOT NULL CHECK (valorUnitario >= 0),
    stock INT NOT NULL CHECK (stock >= 0)
);
GO

CREATE TABLE tblEncabezado (
    idEncabezado INT IDENTITY(1,1) PRIMARY KEY,
    idCliente INT NOT NULL,
    fecha DATETIME DEFAULT GETDATE(),
    subTotal NUMERIC(10,2) NOT NULL CHECK (subTotal >= 0),
    total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    descuentoTotal NUMERIC(10,2) NOT NULL CHECK (descuentoTotal >= 0),
    FOREIGN KEY (idCliente) REFERENCES tblCliente(idCliente)
);
GO

CREATE TABLE tblDetalles (
    idDetalles INT IDENTITY(1,1) PRIMARY KEY,
    idEncabezado INT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    valor NUMERIC(10,2) NOT NULL CHECK (valor >= 0),
    descuento NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (descuento >= 0),
    FOREIGN KEY (idEncabezado) REFERENCES tblEncabezado(idEncabezado),
    FOREIGN KEY (idProducto) REFERENCES tblProducto(idProducto)
);
GO

CREATE TABLE tblUsuarios (
    idUsuario INT IDENTITY(1,1) PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    idCliente INT NOT NULL,
    FOREIGN KEY (idCliente) REFERENCES tblCliente(idCliente)
);
GO

INSERT INTO tblProducto (nombreProducto, descripcion, valorUnitario, stock)
VALUES
('Mesa Comedor', 'Mesa rectangular de madera con acabado brillante, ideal para 4 personas.', 450000, 12),
('Silla Ergonomica', 'Silla acolchada con respaldo curvo, perfecta para comedor o escritorio.', 120000, 30),
('Matera Decorativa', 'Matera de ceramica con diseno minimalista, ideal para interiores.', 85000, 20),
('Mesa de Centro', 'Mesa baja de madera con compartimiento inferior para almacenamiento.', 220000, 15),
('Estante', 'Estante de 4 niveles en madera y metal, ideal para libros o decoracion.', 310000, 10);
GO
