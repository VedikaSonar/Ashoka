import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import About from './Pages/About';
import Product from './Pages/Product';
import ProductDetails from './Pages/ProductDetails';
import Cart from './Pages/Cart';
import Wishlist from './Pages/Wishlist';
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
<<<<<<< HEAD
        <Route path="/contact" element={<Contact />} />
        {/* Add more routes as needed */}
=======
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/wholesaler-login" element={<WholesalerLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/wholesaler-register" element={<WholesalerRegister />} />
>>>>>>> 35fb00a078e9ab279b604de62bc815563e105ca1
      </Routes>
      <Footer />
    </>
  );
}

export default App;
