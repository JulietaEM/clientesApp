USE dbClientes;
GO

IF COL_LENGTH('dbo.tblDetalles', 'descuento') IS NULL
BEGIN
    ALTER TABLE dbo.tblDetalles
    ADD descuento NUMERIC(10,2) NOT NULL CONSTRAINT DF_tblDetalles_descuento DEFAULT 0;
END;
GO
