import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import About from './Pages/About';
import Product from './Pages/Product';
import UserLogin from './Pages/UserLogin';
import WholesalerLogin from './Pages/WholesalerLogin';
import UserRegister from './Pages/UserRegister';
import WholesalerRegister from './Pages/WholesalerRegister';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Product />} />
        <Route path="/product" element={<Product />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/wholesaler-login" element={<WholesalerLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/wholesaler-register" element={<WholesalerRegister />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
