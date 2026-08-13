USE brasahouse;

-- Relaciona cada reserva con una mesa específica, para poder
-- bloquear que dos personas reserven la misma mesa a la misma
-- fecha y hora.
ALTER TABLE reserva ADD COLUMN idmesa INT NULL AFTER idusuario;
ALTER TABLE reserva ADD FOREIGN KEY (idmesa) REFERENCES mesa(idmesa);
