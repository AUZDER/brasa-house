import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import PlatosDestacados from './components/PlatosDestacados';
import Promociones from './components/Promociones';
import Reservas from './components/Reservas';
import Admin from './components/Admin';
import Login from './components/Login';
import Footer from './components/Footer';
import Menu from './components/Menu';
import Carrito from './components/Carrito';
import { CarritoProvider } from './context/CarritoContext';
import './index.css';

function App() {
  return (
    <CarritoProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/" element={
            <>
              <Hero />
              <PlatosDestacados />
              <Promociones />
            </>
          } />
        </Routes>
        <Footer />
      </Router>
    </CarritoProvider>
  );
}

export default App;
