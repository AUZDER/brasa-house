USE brasahouse;

-- Evita que se puedan crear dos platos con el mismo nombre
ALTER TABLE plato ADD UNIQUE (nombre);
