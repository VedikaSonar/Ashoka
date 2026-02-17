import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const API_BASE = 'http://127.0.0.1:5000/api';

const getAuthToken = () => {
  if (typeof localStorage === 'undefined') return null;
  const userToken = localStorage.getItem('userToken');
  if (userToken) return userToken;
  const wholesalerToken = localStorage.getItem('wholesalerToken');
  if (wholesalerToken) return wholesalerToken;
  return null;
};

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [country, setCountry] = useState('India');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [postcode, setPostcode] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [customerTypeLabel, setCustomerTypeLabel] = useState('Retail Customer');

  useEffect(() => {
    const fetchCart = async () => {
      const token = getAuthToken();
      if (!token) {
        navigate('/auth');
        return;
      }
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to load cart');
        }
        setCart(data);
      } catch (err) {
        setError(err.message || 'Something went wrong while loading cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    const userInfoRaw = localStorage.getItem('userInfo');
    const wholesalerInfoRaw = localStorage.getItem('wholesalerInfo');
    const infoRaw = userInfoRaw || wholesalerInfoRaw;
    const wholesalerToken = localStorage.getItem('wholesalerToken');
    if (wholesalerToken) {
      setCustomerTypeLabel('Wholesaler');
    } else {
      setCustomerTypeLabel('Retail Customer');
    }
    if (infoRaw) {
      try {
        const info = JSON.parse(infoRaw);
        const nameValue = info.name || '';
        if (nameValue) {
          const parts = String(nameValue).trim().split(' ');
          setFirstName(parts[0] || '');
          setLastName(parts.slice(1).join(' ') || '');
        }
        if (info.email) {
          setBillingEmail(info.email);
        }
        if (info.phone) {
          setBillingPhone(info.phone);
        }
      } catch {
        setFirstName('');
        setLastName('');
        setBillingEmail('');
        setBillingPhone('');
      }
    }
    const storedAddress = localStorage.getItem('userAddress');
    if (storedAddress) {
      setAddress1(storedAddress);
    }
  }, []);

  const items = cart && Array.isArray(cart.items) ? cart.items : [];
  const subtotal = cart ? Number(cart.total || 0) : 0;
  const shipping = 0;
  const total = subtotal + shipping;

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handlePlaceOrder = async () => {
    const token = getAuthToken();
    if (!token) {
      navigate('/auth');
      return;
    }
    if (!items.length) {
      setError('Your cart is empty. Please add items before placing an order.');
      return;
    }
    setPlacingOrder(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          payment_method: paymentMethod,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }
      const msg = data.message || 'Order placed successfully';
      setMessage(msg);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('app:toast', {
            detail: { message: msg, variant: 'success' },
          }),
        );
      }
      navigate('/orders');
    } catch (err) {
      setError(err.message || 'Something went wrong while placing order');
    } finally {
      setPlacingOrder(false);
    }
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
          <div className="mt-2 small">
            You are logged in as{' '}
            <span className="fw-semibold">{customerTypeLabel}</span>
          </div>
        </Container>
      </section>

      <section className="checkout-main-section py-5">
        <Container>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          {message && (
            <Alert variant="success" className="mb-3">
              {message}
            </Alert>
          )}
          {loading && (
            <div className="text-center mb-4">
              <Spinner animation="border" role="status" size="sm" className="me-2" />
              <span>Loading your cart...</span>
            </div>
          )}
          <Row className="g-4">
            <Col lg={7}>
              <div className="checkout-card">
                <h3 className="checkout-section-title mb-4">Billing Details</h3>
                <Form onSubmit={handleSubmit} className="checkout-form">
                  <Row className="g-3">
                    <Col md={12}>
                      <Form.Group controlId="checkoutCountry">
                        <Form.Label>Country</Form.Label>
                        <Form.Select
                          value={country}
                          onChange={(event) => setCountry(event.target.value)}
                        >
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
                        <Form.Control
                          type="text"
                          placeholder="First name"
                          value={firstName}
                          onChange={(event) => setFirstName(event.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="checkoutLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Last name"
                          value={lastName}
                          onChange={(event) => setLastName(event.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="checkoutCompany">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Company name"
                          value={companyName}
                          onChange={(event) => setCompanyName(event.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="checkoutAddress1">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Street address"
                          value={address1}
                          onChange={(event) => setAddress1(event.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="checkoutAddress2">
                        <Form.Control
                          type="text"
                          placeholder="Apartment, suite, unit etc. (optional)"
                          value={address2}
                          onChange={(event) => setAddress2(event.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="checkoutCity">
                        <Form.Label>Town / City</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Town / City"
                          value={city}
                          onChange={(event) => setCity(event.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group controlId="checkoutState">
                        <Form.Label>State / Country</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="State / Country"
                          value={stateName}
                          onChange={(event) => setStateName(event.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group controlId="checkoutPostcode">
                        <Form.Label>Postcode / Zip</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Postcode / Zip"
                          value={postcode}
                          onChange={(event) => setPostcode(event.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="checkoutEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Email address"
                          value={billingEmail}
                          onChange={(event) => setBillingEmail(event.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="checkoutPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Phone"
                          value={billingPhone}
                          onChange={(event) => setBillingPhone(event.target.value)}
                        />
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
                          value={orderNotes}
                          onChange={(event) => setOrderNotes(event.target.value)}
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
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="checkout-order-row d-flex justify-content-between"
                    >
                      <span>
                        {item.product ? item.product.name : 'Product'} x{' '}
                        {item.quantity || 1}
                      </span>
                      <span>
                        ₹{Number(item.itemTotal || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {!items.length && !loading && (
                    <div className="checkout-order-row d-flex justify-content-between">
                      <span>Your cart is empty</span>
                      <span>₹0.00</span>
                    </div>
                  )}
                  <div className="checkout-order-row d-flex justify-content-between">
                    <span>Cart Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="checkout-order-row d-flex justify-content-between">
                    <span>Shipping</span>
                    <span>₹{shipping.toFixed(2)}</span>
                  </div>
                  <div className="checkout-order-footer d-flex justify-content-between">
                    <span>Order Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="checkout-payment mb-3">
                  <Form.Check
                    id="paymentBank"
                    type="radio"
                    name="paymentMethod"
                    label="Direct Bank Transfer"
                    className="checkout-payment-option"
                    checked={paymentMethod === 'bank'}
                    onChange={() => setPaymentMethod('bank')}
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
                    checked={paymentMethod === 'cheque'}
                    onChange={() => setPaymentMethod('cheque')}
                  />
                  <Form.Check
                    id="paymentPaypal"
                    type="radio"
                    name="paymentMethod"
                    label="PayPal"
                    className="checkout-payment-option"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                  />
                </div>

                <Button
                  type="button"
                  variant="success"
                  className="w-100 checkout-place-order-btn"
                  disabled={placingOrder || loading || !items.length}
                  onClick={handlePlaceOrder}
                >
                  {placingOrder ? 'Placing Order...' : 'Place Order'}
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
