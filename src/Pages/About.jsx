import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./About.css";
import productImg from "../assets/images/about us img.png";
import aboutbg from "../assets/images/aboutbg.png";
import bg from "../assets/images/bg.png";
import fssaiLogo from "../assets/images/fassi logo.png";
import keepCleanLogo from "../assets/images/keep clean logo.png";
import makeInIndiaLogo from "../assets/images/make in india logo.png";
import swachBharatLogo from "../assets/images/swach bharat.png";
import foodManufacturingLogo from "../assets/images/food manufacturing.png";

const journeySteps = [
  { icon: "🌱", title: "Founded", desc: "Founded with a vision of purity" },
  { icon: "🏭", title: "Modern Facility", desc: "Modern manufacturing setup" },
  { icon: "📦", title: "Expanded Range", desc: "Expanded product range" },
  { icon: "🏆", title: "Trusted Brand", desc: "Trusted by thousands of customers" },
];

const diffCards = [
  { icon: "🌾", title: "Farm-Sourced Ingredients", desc: "Best grains harvested from top farms" },
  { icon: "🔍", title: "Quality Tested & Certified", desc: "Rigorous quality checks for purity" },
  { icon: "⚙️", title: "Modern Processing", desc: "Advanced facilities ensure hygiene" },
  { icon: "💚", title: "Customer-First Approach", desc: "Your needs and feedback matter most." },
];

export default function About() {
  return (
    <div className="about-page">
      <section
        className="hero"
        style={{
          backgroundImage: `url(${aboutbg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* ── Who We Are ── */}
      <section className="who">
        <div className="who__text">
          <h2 className="section-title">Who We Are</h2>
          <p>
            Ashoka is a trusted name in nutritious food products, committed to
            bringing <strong>purity from farms</strong> to your kitchen. Our
            priority is transparency, quality sourcing, and uncompromising hygiene.
          </p>
          <p className="who__tagline">
            <strong>We believe good food</strong> builds strong families.
          </p>
        </div>
        <div className="who__imgs">
          <div className="who__img-main">
            <img
              src={productImg}
              alt="Farmers"
            />
          </div>
         
        </div>
      </section>

      {/* ── Our Journey ── */}
      <section className="journey">
        <h2 className="section-title">Our Journey</h2>
        <div className="journey__track">
          <div className="journey__line" />
          {journeySteps.map((s, i) => (
            <div className="journey__step" key={i}>
              <div className="journey__circle">{s.icon}</div>
              <h4 className="journey__step-title">{s.title}</h4>
              <p className="journey__step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="vm">
        <h2 className="section-title with-line">Vision & Mission</h2>
        <div className="vm__grid">
          <div className="vm__card">
            <h3 className="vm__title">Vision</h3>
            <p>
              To be India’s most trusted food products brand, connecting homes with pure,
              naturally processed ingredients that nourish families every day.
            </p>
          </div>
          <div className="vm__card">
            <h3 className="vm__title">Mission</h3>
            <ul className="vm__list">
              <li>Adopt rigorous sourcing and quality practices.</li>
              <li>Maintain hygienic processing and modern packaging.</li>
              <li>Continuously improve with a customer‑first mindset.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── What Makes Ashoka Different ── */}
      <section className="diff">
        <h2 className="section-title with-line">What Makes Ashoka Different</h2>
        <div className="diff__grid">
          {diffCards.map((c, i) => (
            <div className="diff__card" key={i}>
              <div className="diff__icon">{c.icon}</div>
              <h4>{c.title}</h4>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="py-4"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Container>
          <Row className="g-5 justify-content-center align-items-center text-center py-4">
            <Col xs="auto">
              <img src={fssaiLogo} alt="FSSAI" style={{ height: 54, width: "auto" }} />
            </Col>
            <Col xs="auto">
              <img src={keepCleanLogo} alt="Keep Clean" style={{ height: 54, width: "auto" }} />
            </Col>
            <Col xs="auto">
              <img src={makeInIndiaLogo} alt="Make in India" style={{ height: 54, width: "auto" }} />
            </Col>
            <Col xs="auto">
              <img src={swachBharatLogo} alt="Swachh Bharat" style={{ height: 54, width: "auto" }} />
            </Col>
            <Col xs="auto">
              <img src={foodManufacturingLogo} alt="Food Manufacturing" style={{ height: 54, width: "auto" }} />
            </Col>
          </Row>
        </Container>
      </section>

    </div>
  );
}
