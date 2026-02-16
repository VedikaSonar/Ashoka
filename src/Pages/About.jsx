import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Star, Quote } from 'lucide-react';
import productImg from '../assets/images/product 5.png';
import './About.css';

const About = () => {
  const pillarCards = [
    { title: 'Quality Sourcing' },
    { title: 'Traditional Expertise' },
    { title: 'Modern Manufacturing' },
  ];

  const missionCards = [
    {
      title: 'Our Mission',
      text: 'To provide natural, nutritious and affordable food products for every household.',
    },
    {
      title: 'Our Vision',
      text: 'To become a globally trusted brand for authentic Indian staples.',
    },
    {
      title: 'Our Promise',
      text: 'To keep purity, quality and taste at the heart of everything we make.',
    },
  ];

  const testimonials = [
    {
      name: 'Ralph Edwards',
      role: 'Home Chef',
      text: 'Excellent product quality and taste. Ashoka has become a staple in our kitchen.',
    },
    {
      name: 'Jerome Bell',
      role: 'Restaurant Owner',
      text: 'Ashoka products are consistently fresh and flavourful. Highly recommended!',
    },
    {
      name: 'Annette Black',
      role: 'Food Blogger',
      text: 'We love Ashoka’s besan and dals. Always pure, aromatic and delicious.',
    },
  ];

  return (
    <div className="about-page">
      <section className="about-hero-banner text-center text-white">
        <Container>
          <h1 className="about-hero-title">About</h1>
          <nav className="about-breadcrumb">
            <span>Home</span>
            <span className="dot">•</span>
            <span className="active">About</span>
          </nav>
        </Container>
      </section>

   

      <section className="about-taste-section py-5">
        <Container>
          <Row className="g-4 align-items-center">
            <Col lg={6}>
              <div className="taste-left">
                <h2 className="taste-title">The Taste India Trusts</h2>
                <p className="taste-text">
                  Ashoka Products are dedicated to delivering high‑quality Indian staples
                  crafted with purity, tradition and care. From carefully sourced raw
                  materials to hygienic manufacturing, every product reflects our
                  commitment to authentic taste and trusted quality.
                </p>
                <Button className="taste-btn">Explore Products</Button>
              </div>
            </Col>
            <Col lg={6}>
              <Row className="g-3">
                {pillarCards.map((card) => (
                  <Col md={4} sm={4} xs={12} key={card.title}>
                    <div className="pillar-card">
                      <div className="pillar-image-wrap">
                        <img src={productImg} alt={card.title} className="pillar-image" />
                      </div>
                      <div className="pillar-title">{card.title}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="about-mission-section py-5">
        <Container>
          <Row className="g-4">
            {missionCards.map((card) => (
              <Col lg={4} md={6} key={card.title}>
                <div className="mission-card">
                  <div className="mission-icon" />
                  <h3 className="mission-title">{card.title}</h3>
                  <p className="mission-text">{card.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="about-banner-section">
        <Container>
          <div className="about-banner-inner">
            <h3 className="about-banner-title">Quality You Can Taste. Purity You Can Trust.</h3>
            <Button className="about-banner-btn">Shop Now</Button>
          </div>
        </Container>
      </section>

      <section className="about-testimonials-section py-5">
        <Container>
          <div className="about-testimonials-header">
            <span className="about-testimonials-label">Customer Testimonials</span>
            <h3 className="about-testimonials-title">
              Delivering Authentic Quality, Loved by Many.
            </h3>
          </div>
          <Row className="g-4">
            {testimonials.map((t) => (
              <Col lg={4} md={6} key={t.name}>
                <div className="about-testimonial-card">
                  <div className="about-testimonial-top">
                    <div className="about-avatar-circle">{t.name.charAt(0)}</div>
                    <div>
                      <div className="about-testimonial-name">{t.name}</div>
                      <div className="about-testimonial-role">{t.role}</div>
                    </div>
                  </div>
                  <div className="about-testimonial-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#ffb300" color="#ffb300" />
                    ))}
                  </div>
                  <p className="about-testimonial-text">{t.text}</p>
                  <div className="about-testimonial-quote">
                    <Quote size={20} />
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About;
