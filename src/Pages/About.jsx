import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import productImg from '../assets/images/product 5.png';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero-strip">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="about-hero-text-block">
                <p className="about-hero-quote">
                  “Celebrating <span className="highlight">Health</span>
                  <br />
                  from decades”
                </p>
              </div>
            </Col>
            <Col lg={6}>
              <div className="about-hero-image-block">
                <div className="about-hero-people" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="about-principles-section">
        <Container>
          <h2 className="about-section-heading text-center">Principles</h2>
          <div className="about-principles-text">
            <p>
              Quality food products require unwavering dedication to quality at every level of
              operation – from inspecting wheat and buying it, through transport, storage,
              processing, packaging and distribution. Our decades of experience in wheat and wheat
              products have taught us that the journey is a never ending one, there are always new
              facts to learn, new practices to implement, and more sophisticated and productive
              machinery to install.
            </p>
            <p>
              We pride ourselves in being open to learning, willing to change, eager to verify – as
              long as we believe these efforts will result in higher quality products that are
              meaningful to our consumers.
            </p>
            <p>
              Recognising that consumer expectations, too, are always changing, a key part of our
              management effort is to be in constant touch with our customers. Our organization and
              delivery systems are designed to ensure that this is built into our way of being.
            </p>
          </div>
        </Container>
      </section>

      <section className="about-vision-mission-section">
        <Container>
          <Row className="g-4 align-items-start">
            <Col lg={5}>
              <div className="about-grain-image-wrap">
                <img src={productImg} alt="Grains in hands" className="about-grain-image" />
              </div>
            </Col>
            <Col lg={7}>
              <div className="about-vision-block">
                <h3 className="about-subheading">Vision</h3>
                <h4 className="about-vision-title">“TO BE FINEST FOOD PRODUCTS BRAND IN INDIA”</h4>
                <p>
                  To become a leading food providing brand in India. We aspire to motivate people to
                  connect to natural food ingredients that cause no harm to the body as well as the
                  environment. We solely promote health through our products and wish to keep
                  delivering great-tasting, healthy, naturally processed food to every home.
                </p>
              </div>

              <div className="about-mission-block">
                <h3 className="about-subheading">Mission</h3>
                <p>
                  We aim to adopt the international practices of procurement, processing, and
                  packaging of wheat products and combine them with the highest standards of honesty
                  and fairness. Our brand has become one of the most sought after brands of food
                  products available in the market. It is the result of hard work, consistency, and
                  dedication that we have managed to follow from decades.
                </p>
                <p>
                  As a result, we have brought a dramatic change in certain aspects of flour milling
                  industry in India. We are driven by a strong set of shared values and beliefs that
                  practices need to undergo a consistent change in order to match the need of time.
                  Our organizational culture enmeshes with great values and we have sustained it
                  ever since.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="about-certification-strip">
        <Container>
          <Row className="justify-content-center g-3">
            <Col xs={6} md={2}>
              <div className="about-cert-badge">ISO 22000</div>
            </Col>
            <Col xs={6} md={2}>
              <div className="about-cert-badge">ISO 9001</div>
            </Col>
            <Col xs={6} md={2}>
              <div className="about-cert-badge">FSSAI</div>
            </Col>
            <Col xs={6} md={2}>
              <div className="about-cert-badge">FSSC 22000</div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About;
