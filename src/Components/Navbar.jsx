import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar as BootstrapNavbar, NavDropdown, Button, Alert } from 'react-bootstrap';
import { Phone, ChevronDown, Heart, ShoppingBag, Menu, Salad, User } from 'lucide-react';
import logo from '../assets/images/ashoka logo .png';
import './Navbar.css';

const API_BASE = 'http://127.0.0.1:5000/api';

const getWishlistCountFromStorage = () => {
  if (typeof localStorage === 'undefined') return 0;
  try {
    const data = localStorage.getItem('wishlistIds');
    if (!data) return 0;
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) return parsed.length;
    return 0;
  } catch {
    return 0;
  }
};

const getCartCountFromStorage = () => {
  if (typeof localStorage === 'undefined') return 0;
  const raw = localStorage.getItem('cartCount');
  const parsed = parseInt(raw || '0', 10);
  if (Number.isNaN(parsed) || parsed < 0) return 0;
  return parsed;
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [authType, setAuthType] = useState(null);
  const [authName, setAuthName] = useState('');
  const [wishlistCount, setWishlistCount] = useState(getWishlistCountFromStorage);
  const [cartCount, setCartCount] = useState(getCartCountFromStorage);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;

    const userToken = localStorage.getItem('userToken');
    const userInfoRaw = localStorage.getItem('userInfo');
    const wholesalerToken = localStorage.getItem('wholesalerToken');
    const wholesalerInfoRaw = localStorage.getItem('wholesalerInfo');

    if (userToken && userInfoRaw) {
      setAuthType('user');
      try {
        const userInfo = JSON.parse(userInfoRaw);
        const name = userInfo.name || userInfo.email || '';
        setAuthName(name);
      } catch {
        setAuthName('');
      }
    } else if (wholesalerToken && wholesalerInfoRaw) {
      setAuthType('wholesaler');
      try {
        const wholesalerInfo = JSON.parse(wholesalerInfoRaw);
        const name = wholesalerInfo.name || wholesalerInfo.email || '';
        setAuthName(name);
      } catch {
        setAuthName('');
      }
    } else {
      setAuthType(null);
      setAuthName('');
    }
  }, [location]);

  useEffect(() => {
    const updateWishlistCount = () => {
      setWishlistCount(getWishlistCountFromStorage());
    };

    const updateCartCount = () => {
      setCartCount(getCartCountFromStorage());
    };

    updateWishlistCount();
    updateCartCount();

    const handleWishlistEvent = () => updateWishlistCount();
    const handleCartEvent = () => updateCartCount();
    const handleStorage = (event) => {
      if (event.key === 'wishlistIds') {
        updateWishlistCount();
      }
      if (event.key === 'cartCount') {
        updateCartCount();
      }
    };

    window.addEventListener('wishlist:update', handleWishlistEvent);
    window.addEventListener('cart:update', handleCartEvent);
    window.addEventListener('storage', handleStorage);

    if (typeof localStorage !== 'undefined') {
      const token =
        localStorage.getItem('userToken') || localStorage.getItem('wholesalerToken');
      if (token) {
        fetch(`${API_BASE}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) =>
            response
              .json()
              .then((data) => ({ ok: response.ok, data }))
              .catch(() => ({ ok: false })),
          )
          .then((result) => {
            if (!result || !result.ok) return;
            const items = Array.isArray(result.data.items) ? result.data.items : [];
            const count = items.reduce(
              (sum, item) => sum + (typeof item.quantity === 'number' ? item.quantity : 0),
              0,
            );
            const safeCount = Number.isNaN(count) || count < 0 ? 0 : count;
            localStorage.setItem('cartCount', String(safeCount));
            setCartCount(safeCount);
          })
          .catch(() => {});
      }
    }

    return () => {
      window.removeEventListener('wishlist:update', handleWishlistEvent);
      window.removeEventListener('cart:update', handleCartEvent);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    const handleToast = (event) => {
      const detail = event.detail || {};
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
      setToast({
        message: detail.message || '',
        variant: detail.variant || 'success',
      });
      const duration =
        typeof detail.duration === 'number' && detail.duration > 0 ? detail.duration : 2500;
      toastTimerRef.current = setTimeout(() => {
        setToast(null);
        toastTimerRef.current = null;
      }, duration);
    };

    window.addEventListener('app:toast', handleToast);
    return () => {
      window.removeEventListener('app:toast', handleToast);
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
    };
  }, []);

  const getInitial = (value) => {
    if (!value || typeof value !== 'string') return '';
    return value.trim().charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userAddress');
      localStorage.removeItem('wholesalerToken');
      localStorage.removeItem('wholesalerInfo');
      localStorage.removeItem('cartCount');
      window.dispatchEvent(new Event('wishlist:update'));
      window.dispatchEvent(new Event('cart:update'));
    }
    setAuthType(null);
    setAuthName('');
    navigate('/');
  };

  return (
    <div className={`navbar-wrapper${scrolled ? ' scrolled' : ''}`}>
      {/* Top Bar */}
      <div className="top-bar bg-dark text-white py-2">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="top-bar-left d-flex align-items-center gap-2 small">
            <Phone size={14} />
            <span>+91 99709 30890 | +91 88881 88194</span>
          </div>
          <div className="top-bar-center  small d-none d-md-block">
            CUSTOMER CARE:{' '}
            <span className="fw-bold">+91 77410 90767</span>
            {'  •  '}
            EMAIL:{' '}
            <span className="fw-bold">ashokproducts.sales@gmail.com</span>
          </div>
          <div className="top-bar-right d-flex gap-3 small">
           
           
          
          </div>
        </Container>
      </div>

      {/* Main Navbar */}
      <BootstrapNavbar bg="white" expand="lg" className="main-nav py-2 border-bottom">
        <Container>
          <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img 
              src={logo} 
              alt="Ashoka Logo" 
              className="navbar-logo-img"
            />
          </BootstrapNavbar.Brand>

          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
          
          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto gap-lg-4">
              <Nav.Link 
                as={Link} 
                to="/" 
                active={location.pathname === '/'}
                className="fw-semibold text-dark nav-link-custom"
              >
                Home
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/about" 
                active={location.pathname === '/about'}
                className="fw-semibold text-dark nav-link-custom"
              >
                About
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/shop" 
                active={location.pathname === '/shop' || location.pathname === '/product'}
                className="fw-semibold text-dark nav-link-custom"
              >
                Products
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="fw-semibold text-dark nav-link-custom">Contact</Nav.Link>
            </Nav>

            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              <Link
                to="/wishlist"
                className="position-relative cursor-pointer text-decoration-none text-dark"
              >
                <Heart size={24} />
                {authType && wishlistCount > 0 && (
                  <span className="badge-custom">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="position-relative cursor-pointer text-decoration-none text-dark"
              >
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="badge-custom">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              {authType ? (
                <NavDropdown
                  align="end"
                  id="profile-dropdown"
                  title={
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle bg-success text-white"
                        style={{ width: 32, height: 32 }}
                      >
                        {authName ? (
                          <span className="small fw-bold">
                            {getInitial(authName)}
                          </span>
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                    </div>
                  }
                >
                  <NavDropdown.Item
                    onClick={() => {
                      if (authType === 'wholesaler') {
                        navigate('/wholesaler-dashboard');
                      } else {
                        navigate('/my-profile');
                      }
                    }}
                  >
                    My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => {
                      navigate('/orders');
                    }}
                  >
                    Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/wishlist">
                    My Wishlist
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/cart">
                    My Cart
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Button
                  as={Link}
                  to="/auth"
                  variant="success"
                  size="sm"
                  className="fw-semibold px-3"
                >
                  Login / Register
                </Button>
              )}
            </div>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
      {toast && toast.message && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 2000 }}>
          <Alert
            variant={toast.variant}
            className="shadow-sm mb-0 d-flex align-items-center justify-content-between"
          >
            <span>{toast.message}</span>
            <button
              type="button"
              className="btn-close ms-2"
              aria-label="Close"
              onClick={() => setToast(null)}
            />
          </Alert>
        </div>
      )}
    </div>
  );
};

export default Navbar;
