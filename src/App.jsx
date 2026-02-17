import { Routes, Route, useLocation } from 'react-router-dom';
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
import UserProfile from './Pages/UserProfile';
import Orders from './Pages/Orders';
import Contact from './Pages/Contact';
import AuthOptions from './Pages/AuthOptions';
import WholesalerDashboard from './Pages/WholesalerDashboard';
import Checkout from './Pages/Checkout';
import './App.css';

const ScrollToTop = () => {
  const location = useLocation();

  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }

  return null;
};

function App() {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Product />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/wholesaler-login" element={<WholesalerLogin />} />
        <Route path="/my-profile" element={<UserProfile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/wholesaler-register" element={<WholesalerRegister />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/auth" element={<AuthOptions />} />
        <Route path="/wholesaler-dashboard" element={<WholesalerDashboard />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
