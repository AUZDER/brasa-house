import React, { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const guardado = localStorage.getItem('carritoBrasaHouse');
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('carritoBrasaHouse', JSON.stringify(items));
  }, [items]);

  const agregarItem = (plato) => {
    setItems(prev => {
      const existente = prev.find(i => i.idplato === plato.idplato);
      if (existente) {
        return prev.map(i =>
          i.idplato === plato.idplato ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { idplato: plato.idplato, nombre: plato.nombre, precio: parseFloat(plato.precio), cantidad: 1 }];
    });
  };

  const quitarItem = (idplato) => {
    setItems(prev => prev.filter(i => i.idplato !== idplato));
  };

  const cambiarCantidad = (idplato, cantidad) => {
    if (cantidad <= 0) {
      quitarItem(idplato);
      return;
    }
    setItems(prev => prev.map(i => (i.idplato === idplato ? { ...i, cantidad } : i)));
  };

  const vaciarCarrito = () => setItems([]);

  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const cantidadTotal = items.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <CarritoContext.Provider value={{ items, agregarItem, quitarItem, cambiarCantidad, vaciarCarrito, total, cantidadTotal }}>
      {children}
    </CarritoContext.Provider>
  );
};
