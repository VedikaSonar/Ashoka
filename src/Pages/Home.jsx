import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Carousel, Nav } from 'react-bootstrap';
import { ChevronRight, ChevronLeft, Wheat, Box, Container as PackageIcon, Layers, ShoppingBag, Star, Heart, Eye, Leaf, Award, ShieldCheck, Quote } from 'lucide-react';
import productImg from '../assets/images/product 5.png';
import Footer from '../Components/Footer';
import './Home.css';

const Home = () => {
  const slides = [
    {
      id: 1,
      badge: "100% ORGANIC PRODUCT",
      title: <>The Heart of Authentic Indian Cooking</>,
      image: productImg,
      sale: "30%"
    },
    {
      id: 2,
      badge: "FRESH FROM FARM",
      title: <>Healthy Grains <br /> For Your <br /> Daily <br /> Nutrition</>,
      image: productImg,
      sale: "25%"
    },
    {
      id: 3,
      badge: "BEST QUALITY GUARANTEED",
      title: <>Authentic Taste. <br /> Trusted <br /> Quality.</>,
      image: productImg,
      sale: "20%"
    }
  ];

  const categories = [
    { id: 1, name: "Ashoka Besan", count: "3 items", icon: <Layers size={40} strokeWidth={1.5} /> },
    { id: 2, name: "Ashoka Dals", count: "6 items", icon: <ShoppingBag size={40} strokeWidth={1.5} /> },
    { id: 3, name: "Ashoka Flours", count: "3 items", icon: <Wheat size={40} strokeWidth={1.5} /> },
    { id: 4, name: "Ashoka Pulses", count: "5 items", icon: <Box size={40} strokeWidth={1.5} /> },
    { id: 5, name: "Ashoka Staples", count: "10+ items", icon: <PackageIcon size={40} strokeWidth={1.5} /> },
  ];

  const products = [
    { id: 1, name: "Organic Avocado", price: "USD 150.00", badge: "10% Off", badgeType: "sale" },
    { id: 2, name: "Cheddar Fries", price: "USD 190.00" },
    { id: 3, name: "Broccoli Organic", price: "USD 300.00", badge: "15% Off", badgeType: "sale" },
    { id: 4, name: "Broccoli Farms", price: "USD 129.00" },
    { id: 5, name: "Fresh Orange", price: "USD 150.00", badge: "10% Off", badgeType: "sale" },
    { id: 6, name: "Organic Avocado", price: "USD 150.00" },
    { id: 7, name: "Fresh Orange", price: "USD 80.00", badge: "NEW", badgeType: "new" },
    { id: 8, name: "Read Apple", price: "USD 49.00" },
  ];
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 7);
    const tick = () => {
      const now = new Date();
      let diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        target.setDate(now.getDate() + 7);
        diff = target.getTime() - now.getTime();
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, mins, secs });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section with Slider */}
      <section className="hero-section p-0">
        <Carousel fade indicators={true} controls={true} interval={3000} pause="hover" className="hero-carousel">
          {slides.map((slide) => (
            <Carousel.Item key={slide.id}>
              <div className="hero-slide-content">
                <Container>
                  <Row className="align-items-center py-5">
                    <Col lg={6} md={12}>
                      <div className="hero-content">
                        <span className="hero-badge">{slide.badge}</span>
                        <h1 className="hero-title">
                          {slide.title}
                        </h1>
                        <Button className="hero-btn">
                          BUY NOW <ChevronRight size={18} />
                        </Button>
                      </div>
                    </Col>
                    <Col lg={6} md={12}>
                      <div className="hero-image-container">
                        <img 
                          src={slide.image} 
                          alt="Fresh Products" 
                          className="hero-image"
                        />
                        <div className="sale-badge">
                          <span className="text">Sale Up To</span>
                          <span className="percentage">{slide.sale}</span>
                          <span className="off">OFF</span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>
      
    

      {/* Categories Section */}
      <section className="category-section py-5">
        <Container className="position-relative">
          <div className="category-nav prev">
            <ChevronLeft size={20} />
          </div>
          <div className="category-nav next">
            <ChevronRight size={20} />
          </div>
          
          <Row className="justify-content-center g-4">
            {categories.map((cat) => (
              <Col key={cat.id} lg={2} md={4} sm={6} xs={12} className="category-col">
                <div className="category-card">
                  <div className="category-icon-wrapper">
                    <div className="icon-circle">
                      {cat.icon}
                    </div>
                  </div>
                  <h5 className="category-name">{cat.name}</h5>
                  <p className="category-count">{cat.count}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Trendy Products Section */}
      <section className="trendy-products-section py-5">
        <Container>
          <div className="section-header d-flex flex-wrap justify-content-between align-items-end mb-4">
            <div className="title-area">
              <span className="subtitle">THIS MONTH</span>
              <h2 className="section-title">Trendy Products</h2>
            </div>
            <Nav className="product-filters" defaultActiveKey="all">
              <Nav.Item>
                <Nav.Link eventKey="all" className="active">
                  <span className="count-badge">8</span> All Products
                </Nav.Link>
              </Nav.Item>
              <Nav.Item><Nav.Link eventKey="new">New In</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="top">Top Rated</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="tensing">Tensing Products</Nav.Link></Nav.Item>
            </Nav>
          </div>

          <Row className="g-4">
            {products.map((product) => (
              <Col key={product.id} lg={3} md={4} sm={6}>
                <div className="product-card">
                  <div className="product-image-wrapper">
                    <div className="product-actions">
                      <button className="action-btn" aria-label="Add to Wishlist">
                        <Heart size={18} />
                      </button>
                      <button className="action-btn" aria-label="Add to Cart">
                        <ShoppingBag size={18} />
                      </button>
                      <button className="action-btn" aria-label="View Details">
                        <Eye size={18} />
                      </button>
                    </div>
                    {product.badge && (
                      <span className={`product-badge ${product.badgeType}`}>
                        {product.badge}
                      </span>
                    )}
                    <img src={productImg} alt={product.name} className="product-image" />
                  </div>
                  <div className="product-info">
                    <h5 className="product-name">{product.name}</h5>
                    <div className="product-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="#ddd" color="#ddd" />
                      ))}
                    </div>
                    <p className="product-price">{product.price}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      
      <section className="offer-section py-5">
        <Container>
          <Row className="g-4 align-items-stretch">
            <Col md={6} className="">
              <div className="offer-banner offer-light d-flex align-items-center justify-content-between p-4 p-lg-5 h-100">
                <div className="offer-content">
                  <span className="offer-subtitle">GET 30% OFF</span>
                  <h3 className="offer-title">Fresh Vegetables</h3>
                  <Button className="offer-btn">
                    BUY NOW <ChevronRight size={16} />
                  </Button>
                </div>
                <div className="offer-image veg-img" />
              </div>
            </Col>
            <Col md={6} className="d-flex">
              <div className="offer-banner offer-dark d-flex align-items-center justify-content-between p-4 p-lg-5 h-100">
                <div className="offer-content">
                  <span className="offer-subtitle">Limited Offer</span>
                  <h3 className="offer-title">Don't Miss 25% Off On All Fruits</h3>
                  <Button className="offer-btn">
                    BUY NOW <ChevronRight size={16} />
                  </Button>
                </div>
                <div className="offer-image fruit-img" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
        <section className="deal-section py-5">
        <Container>
          <div className="deal-content text-center">
            <span className="deal-badge">THIS WEEK</span>
            <span className="deal-badge">THIS WEEK</span>
            <h2 className="deal-title">Weekly Best Deals</h2>
            <div className="deal-countdown d-flex justify-content-center gap-3 gap-sm-4 mt-3">
              <div className="time-box">
                <div className="value">{String(timeLeft.days).padStart(2, '0')}</div>
                <div className="label">Days</div>
              </div>
              <div className="time-box">
                <div className="value">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="label">Hrs</div>
              </div>
              <div className="time-box">
                <div className="value">{String(timeLeft.mins).padStart(2, '0')}</div>
                <div className="label">Mins</div>
              </div>
              <div className="time-box">
                <div className="value">{String(timeLeft.secs).padStart(2, '0')}</div>
                <div className="label">Secs</div>
              </div>
            </div>
            <Button className="deal-btn mt-4">
              BUY NOW <ChevronRight size={16} />
            </Button>
          </div>
        </Container>
      </section>
      
      <section className="why-choose-section py-5">
        <Container>
          <div className="text-center mb-4">
            <span className="why-badge">Why Choose Ashoka</span>
            <h2 className="why-title mt-2 mb-5">Trusted Quality. Natural Goodness.</h2>
          </div>
          <Row className="g-4">
            <Col lg={3} md={6}>
              <div className="why-card">
                <div className="why-icon"><Leaf size={28} /></div>
                <h5 className="why-heading">100% Natural & Pure</h5>
                <p className="why-text">Sourced from the best farms for real, authentic taste.</p>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="why-card">
                <div className="why-icon"><Wheat size={28} /></div>
                <h5 className="why-heading">High Protein & Nutrient‑Rich</h5>
                <p className="why-text">Packed with essential nutrients for everyday wellness.</p>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="why-card">
                <div className="why-icon"><Award size={28} /></div>
                <h5 className="why-heading">Best Quality Ingredients</h5>
                <p className="why-text">Carefully selected grains and pulses for top quality.</p>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="why-card">
                <div className="why-icon"><ShieldCheck size={28} /></div>
                <h5 className="why-heading">Trusted Manufacturing</h5>
                <p className="why-text">Hygienic practices that meet strict safety standards.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      <section className="testimonial-section py-5">
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="testi-badge">Testimonials</span>
              <h2 className="testi-title mt-2">Client Feedback</h2>
            </div>
            <div className="testi-nav d-none d-md-flex gap-2">
              <button className="testi-nav-btn" aria-label="Previous">
                <ChevronLeft size={18} />
              </button>
              <button className="testi-nav-btn" aria-label="Next">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <Row className="g-4">
            <Col lg={4} md={6}>
              <div className="testimonial-card">
                <div className="stars">
                  {[...Array(4)].map((_, i) => <Star key={i} size={16} fill="#ffb300" color="#ffb300" />)}
                  <Star size={16} color="#ffb300" />
                </div>
                <h5 className="testi-name">Ralph Edwards</h5>
                <div className="testi-role">UI/UX Designer</div>
                <p className="testi-text">Lorem ipsum dolor sit amet consectetur adipiscing elit vestibulum viverra eget felis interdum fusce odio lacus.</p>
                <div className="testi-quote"><Quote size={28} /></div>
              </div>
            </Col>
            <Col lg={4} md={6}>
              <div className="testimonial-card">
                <div className="stars">
                  {[...Array(4)].map((_, i) => <Star key={i} size={16} fill="#ffb300" color="#ffb300" />)}
                  <Star size={16} color="#ffb300" />
                </div>
                <h5 className="testi-name">Jerome Bell</h5>
                <div className="testi-role">Web Designer</div>
                <p className="testi-text">Lorem ipsum dolor sit amet consectetur adipiscing elit vestibulum viverra eget felis interdum fusce odio lacus.</p>
                <div className="testi-quote"><Quote size={28} /></div>
              </div>
            </Col>
            <Col lg={4} md={6}>
              <div className="testimonial-card">
                <div className="stars">
                  {[...Array(4)].map((_, i) => <Star key={i} size={16} fill="#ffb300" color="#ffb300" />)}
                  <Star size={16} color="#ffb300" />
                </div>
                <h5 className="testi-name">Annette Black</h5>
                <div className="testi-role">Dog Trainer</div>
                <p className="testi-text">Lorem ipsum dolor sit amet consectetur adipiscing elit vestibulum viverra eget felis interdum fusce odio lacus.</p>
                <div className="testi-quote"><Quote size={28} /></div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
    </div>
  );
};

export default Home;
