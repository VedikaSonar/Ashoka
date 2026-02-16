import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Truck, RotateCcw, Headphones, ShieldCheck, MapPin, Phone, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import './Footer.css';
import logo from '../assets/images/ashoka logo .png';

const Footer = () => {
  return (
    <footer className="site-footer mt-5 ">
      <div className="service-strip mb-4">
        <Container>
          <Row className="g-4">
            <Col lg={3} md={6}>
              <div className="service-item">
                <div className="icon-wrap"><Truck size={22} /></div>
                <div>
                  <h6 className="service-title">Free Delivery</h6>
                  <div className="service-text">Free shipping on all order</div>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="service-item">
                <div className="icon-wrap"><RotateCcw size={22} /></div>
                <div>
                  <h6 className="service-title">Money Return</h6>
                  <div className="service-text">Back guarantee under 7 day</div>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="service-item">
                <div className="icon-wrap"><Headphones size={22} /></div>
                <div>
                  <h6 className="service-title">Online Support 24/7</h6>
                  <div className="service-text">Support online 24 hours a day</div>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="service-item">
                <div className="icon-wrap"><ShieldCheck size={22} /></div>
                <div>
                  <h6 className="service-title">Reliable</h6>
                  <div className="service-text">Trusted by 1000+ brands</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="footer-main">
        <Container>
          <Row className="g-4">
            <Col lg={4} md={12}>
              <div className="brand-block">
                <img src={logo} alt="Ashoka" className="footer-logo" />
                <p className="brand-text">It helps designers plan out where the content will sit, the content to be written and approved.</p>
                <div className="socials">
                  <a href="#" aria-label="Facebook" className="social-btn"><Facebook size={18} /></a>
                  <a href="#" aria-label="Twitter" className="social-btn"><Twitter size={18} /></a>
                  <a href="#" aria-label="LinkedIn" className="social-btn"><Linkedin size={18} /></a>
                  <a href="#" aria-label="Instagram" className="social-btn"><Instagram size={18} /></a>
                </div>
              </div>
            </Col>
            <Col lg={2} md={4} sm={6}>
              <div className="link-block">
                <h6 className="block-title">Services</h6>
                <ul className="footer-links">
                  <li><a href="#">Log In</a></li>
                  <li><a href="#">Wishlist</a></li>
                  <li><a href="#">Return Policy</a></li>
                  <li><a href="#">Testimonial</a></li>
                  <li><a href="#">Shopping FAQs</a></li>
                  <li><a href="#">Privacy policy</a></li>
                </ul>
              </div>
            </Col>
            <Col lg={2} md={4} sm={6}>
              <div className="link-block">
                <h6 className="block-title">Company</h6>
                <ul className="footer-links">
                  <li><a href="#">Home</a></li>
                  <li><a href="#">About us</a></li>
                  <li><a href="#">How it works</a></li>
                  <li><a href="#">Pages</a></li>
                  <li><a href="#">Blog</a></li>
                  <li><a href="#">Contact us</a></li>
                </ul>
              </div>
            </Col>
            <Col lg={4} md={4} sm={12}>
              <div className="contact-block">
                <h6 className="block-title">Contact</h6>
                <div className="contact-line">4517 Washington Ave. Manchester, Kentucky 39495</div>
                <div className="contact-item">
                  <div className="contact-icon"><MapPin size={16} /></div>
                  <div>711-2880 Nulla St.</div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon"><Phone size={16} /></div>
                  <div>+964 742 44 763 <span className="muted">Mon - Sat: 9 AM - 5 PM</span></div>
                </div>
              </div>
            </Col>
          </Row>
          <div className="footer-sep" />
          <Row className="align-items-center">
            <Col md={6}>
              <div className="copyright">© All Copyright 2024 by Ashoka</div>
            </Col>
            <Col md={6}>
              <div className="foot-links">
                <a href="#">Terms & Condition</a>
                <span className="dot">•</span>
                <a href="#">Privacy Policy</a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
