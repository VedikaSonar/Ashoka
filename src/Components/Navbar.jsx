import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar as BootstrapNavbar, NavDropdown } from 'react-bootstrap';
import { Phone, ChevronDown, Heart, ShoppingBag, Menu, Salad } from 'lucide-react';
import logo from '../assets/images/ashoka logo .png';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <div className="navbar-wrapper">
      {/* Top Bar */}
      <div className="top-bar bg-dark text-white py-2">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="top-bar-left d-flex align-items-center gap-2 small">
            <Phone size={14} />
            <span>+380961381876</span>
          </div>
          <div className="top-bar-center text-uppercase small d-none d-md-block">
            TAKE CARE OF YOUR Health <span className="text-success fw-bold">25% OFF</span> USE CODE " <span className="fw-bold">DOFIX03</span> "
          </div>
          <div className="top-bar-right d-flex gap-3 small">
            <div className="d-flex align-items-center gap-1 cursor-pointer">
              English <ChevronDown size={14} />
            </div>
            <div className="d-flex align-items-center gap-1 cursor-pointer">
              USD <ChevronDown size={14} />
            </div>
            <div className="d-flex align-items-center gap-1 cursor-pointer">
              Setting <ChevronDown size={14} />
            </div>
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
                Shop
              </Nav.Link>
              <Nav.Link as={Link} to="/pages" className="fw-semibold text-dark nav-link-custom">Pages</Nav.Link>
              <Nav.Link as={Link} to="/blog" className="fw-semibold text-dark nav-link-custom">Blog</Nav.Link>
              <Nav.Link as={Link} to="/contact" className="fw-semibold text-dark nav-link-custom">Contact</Nav.Link>
            </Nav>

            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              <div className="position-relative cursor-pointer">
                <Heart size={24} />
                <span className="badge-custom">3</span>
              </div>
              <div className="position-relative cursor-pointer">
                <ShoppingBag size={24} />
                <span className="badge-custom">12</span>
              </div>
            </div>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
    </div>
  );
};

export default Navbar;
