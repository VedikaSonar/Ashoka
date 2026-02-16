import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Checkout.css';

const sampleItems = [
  { name: 'Alexander Sofa x 1', total: 24 },
  { name: 'Curadian Light x 1', total: 19 },
  { name: 'Leather Chair x 1', total: 22 },
];

const Checkout = () => {
  const subtotal = sampleItems.reduce((sum, item) => sum + item.total, 0);
  const shipping = 7;
  const total = subtotal + shipping;

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="checkout-page">
      <section className="checkout-hero-section text-center text-white">
        <Container>
          <h1 className="checkout-hero-title">Checkout</h1>
          <nav className="checkout-breadcrumb">
            <span>Home</span>
            <span className="dot">•</span>
            <span className="active">Checkout</span>
          </nav>
        </Container>
      </section>

      <section className="checkout-main-section py-5">
        <Container>
          <Row className="g-4">
            <Col lg={7}>
              <div className="checkout-card">
                <h3 className="checkout-section-title mb-4">Billing Details</h3>
                <Form onSubmit={handleSubmit} className="checkout-form">
                  <Row className="g-3">
                    <Col md={12}>
                      <Form.Group controlId="checkoutCountry">
                        <Form.Label>Country</Form.Label>
                        <Form.Select>
                          <option>United States</option>
                          <option>India</option>
                          <option>United Kingdom</option>
                          <option>Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="checkoutFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="First name" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="checkoutLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Last name" />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="checkoutCompany">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control type="text" placeholder="Company name" />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="checkoutAddress1">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" placeholder="Street address" />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="checkoutAddress2">
                        <Form.Control
                          type="text"
                          placeholder="Apartment, suite, unit etc. (optional)"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="checkoutCity">
                        <Form.Label>Town / City</Form.Label>
                        <Form.Control type="text" placeholder="Town / City" />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group controlId="checkoutState">
                        <Form.Label>State / Country</Form.Label>
                        <Form.Control type="text" placeholder="State / Country" />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group controlId="checkoutPostcode">
                        <Form.Label>Postcode / Zip</Form.Label>
                        <Form.Control type="text" placeholder="Postcode / Zip" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="checkoutEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" placeholder="Email address" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="checkoutPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type="text" placeholder="Phone" />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Check
                        id="checkoutCreateAccount"
                        type="checkbox"
                        label="Create an account?"
                        className="mb-2"
                      />
                      <Form.Check
                        id="checkoutShipDifferent"
                        type="checkbox"
                        label="Ship to a different address?"
                      />
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="checkoutOrderNotes">
                        <Form.Label>Order Notes</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Notes about your order, e.g. special notes for delivery."
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>

            <Col lg={5}>
              <div className="checkout-card checkout-order-card">
                <h3 className="checkout-section-title mb-3">Your order</h3>
                <div className="checkout-order-table mb-3">
                  <div className="checkout-order-header d-flex justify-content-between">
                    <span>Product</span>
                    <span>Total</span>
                  </div>
                  {sampleItems.map((item) => (
                    <div
                      key={item.name}
                      className="checkout-order-row d-flex justify-content-between"
                    >
                      <span>{item.name}</span>
                      <span>${item.total.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="checkout-order-row d-flex justify-content-between">
                    <span>Cart Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="checkout-order-row d-flex justify-content-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="checkout-order-footer d-flex justify-content-between">
                    <span>Order Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="checkout-payment mb-3">
                  <Form.Check
                    id="paymentBank"
                    type="radio"
                    name="paymentMethod"
                    label="Direct Bank Transfer"
                    defaultChecked
                    className="checkout-payment-option"
                  />
                  <p className="checkout-payment-text">
                    Make your payment directly into our bank account. Please use your
                    Order ID as the payment reference. Your order will not be shipped
                    until the funds have cleared in our account.
                  </p>
                  <Form.Check
                    id="paymentCheque"
                    type="radio"
                    name="paymentMethod"
                    label="Cheque Payment"
                    className="checkout-payment-option"
                  />
                  <Form.Check
                    id="paymentPaypal"
                    type="radio"
                    name="paymentMethod"
                    label="PayPal"
                    className="checkout-payment-option"
                  />
                </div>

                <Button
                  type="button"
                  variant="success"
                  className="w-100 checkout-place-order-btn"
                >
                  Place Order
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Checkout;

