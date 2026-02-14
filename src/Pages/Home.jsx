import React from 'react';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { ChevronRight, ChevronLeft, GlassWater, Drumstick, Apple, Carrot, Milk } from 'lucide-react';
import './Home.css';

const Home = () => {
  const slides = [
    {
      id: 1,
      badge: "100% ORGANIC PRODUCT",
      title: <>Buy Delicious <br /> produce <br /> Enjoy Free <br /> Shipping</>,
      image: "https://img.freepik.com/free-photo/fresh-vegetables-basket_144627-16474.jpg?t=st=1739550000&exp=1739553600&hmac=placeholder",
      sale: "30%"
    },
    {
      id: 2,
      badge: "FRESH FROM FARM",
      title: <>Healthy Fruits <br /> For Your <br /> Daily <br /> Nutrition</>,
      image: "https://img.freepik.com/free-photo/fresh-fruit-basket_144627-17441.jpg?t=st=1739550000&exp=1739553600&hmac=placeholder",
      sale: "25%"
    },
    {
      id: 3,
      badge: "BEST QUALITY GUARANTEED",
      title: <>Organic Greens <br /> Freshly <br /> Picked For <br /> You</>,
      image: "https://img.freepik.com/free-photo/variety-green-vegetables_144627-24835.jpg?t=st=1739550000&exp=1739553600&hmac=placeholder",
      sale: "20%"
    }
  ];

  const categories = [
    { id: 1, name: "Drinks", count: "10 items", icon: <GlassWater size={40} strokeWidth={1.5} /> },
    { id: 2, name: "Meat", count: "17 items", icon: <Drumstick size={40} strokeWidth={1.5} /> },
    { id: 3, name: "Fresh Fruits", count: "24 items", icon: <Apple size={40} strokeWidth={1.5} /> },
    { id: 4, name: "Vegetable", count: "16 items", icon: <Carrot size={40} strokeWidth={1.5} /> },
    { id: 5, name: "Milk & dairy", count: "16 items", icon: <Milk size={40} strokeWidth={1.5} /> },
  ];

  return (
    <div className="home-page">
      {/* Hero Section with Slider */}
      <section className="hero-section p-0">
        <Carousel fade indicators={true} controls={true} interval={5000} className="hero-carousel">
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
    </div>
  );
};

export default Home;
