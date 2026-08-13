import './assets/css/App.css';

import Header from './components/Header';
import Hero from './components/Hero';
import PlatosDestacados from './components/PlatosDestacados';
import Promociones from './components/Promociones';
import Nosotros from './components/Nosotros';
import Contacto from './components/Contacto';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <Hero />
      <PlatosDestacados />
      <Promociones />
      <Nosotros />
      <Contacto />
      <Footer />
    </>
  );
}

export default App;