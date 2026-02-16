import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const hours = [
    {
      label: 'Monday - Friday',
      time: '09:00 AM - 07:00 PM',
    },
    {
      label: 'Saturday',
      time: '09:00 AM - 05:00 PM',
    },
    {
      label: 'Sunday',
      time: 'Closed',
    },
  ];

  return (
    <div className="contact-page">
      <section className="contact-hero-section text-center text-white">
        <Container>
          <h1 className="contact-hero-title">Contact</h1>
          <nav className="contact-breadcrumb">
            <span>Home</span>
            <span className="dot">•</span>
            <span className="active">Contact</span>
          </nav>
        </Container>
      </section>

      <section className="contact-main-section py-5">
        <Container>
          <Row className="g-4 align-items-stretch">
            <Col lg={6}>
              <div className="contact-card h-100">
                <h2 className="contact-title">Send Us a Message</h2>
                <p className="contact-subtitle">
                  Fill out the form below and our team will get back to you as soon as
                  possible.
                </p>
                <Form className="contact-form">
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group controlId="contactName">
                        <Form.Control type="text" placeholder="Your Name" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="contactEmail">
                        <Form.Control type="email" placeholder="Your Email" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mt-3" controlId="contactSubject">
                    <Form.Control type="text" placeholder="Subject" />
                  </Form.Group>
                  <Form.Group className="mt-3" controlId="contactMessage">
                    <Form.Control as="textarea" rows={4} placeholder="Your Message" />
                  </Form.Group>
                  <Button type="submit" className="contact-btn mt-4">
                    Send Message
                  </Button>
                </Form>
              </div>
            </Col>
            <Col lg={6}>
              <div className="contact-map-card h-100">
                <div className="contact-map-wrap">
                  <iframe
                    title="Ashoka Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.228884795953!2d-122.419415!3d37.774929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzMwLjciTiAxMjLCsDI1JzA2LjAiVw!5e0!3m2!1sen!2sus!4v1700000000000"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="contact-info">
                  <div className="contact-info-line">
                    <MapPin size={18} />
                    <span>
                      GAT NO 1567, Near Shelar Crane Service Shelarvasti,
                      Chikhali, Maharashtra – 411062
                    </span>
                  </div>
                  <div className="contact-info-line">
                    <MapPin size={18} />
                    <span>
                      Nano Spaces, ‘C’ Wing, Flat No. C-402, Near D.Y. Patil
                      College, Ravet, Pune – 412101
                    </span>
                  </div>
                  <div className="contact-info-line">
                    <Phone size={18} />
                    <span>Contact: +91 99709 30890 | +91 88881 88194</span>
                  </div>
                  <div className="contact-info-line">
                    <Phone size={18} />
                    <span>Customer Care: +91 77410 90767</span>
                  </div>
                  <div className="contact-info-line">
                    <Mail size={18} />
                    <span>
                      ashokproducts.sales@gmail.com, jaydeepthakur55@gmail.com
                    </span>
                  </div>
                  <div className="contact-info-line">
                    <Clock size={18} />
                    <span>Mon–Sat: 09:00 AM – 07:00 PM | Sun: Closed</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="contact-hours-section py-5">
        <Container>
          <div className="hours-header text-center mb-4">
            <h3 className="hours-title">Our Hours Of Operation</h3>
            <p className="hours-subtitle">
              We&apos;re available at the times below to assist you.
            </p>
          </div>
          <Row className="g-3 justify-content-center">
            {hours.map((item) => (
              <Col lg={3} md={4} sm={6} key={item.label}>
                <div className="hours-card">
                  <div className="hours-icon">
                    <Clock size={22} />
                  </div>
                  <div className="hours-day">{item.label}</div>
                  <div className="hours-time">{item.time}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Contact;
