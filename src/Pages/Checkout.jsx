import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'cart';
  const quantityParam = searchParams.get('qty');
  const isInstant = mode === 'instant';
  const [cart, setCart] = useState(null);
  const [instantItem, setInstantItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
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
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [couponSummary, setCouponSummary] = useState(null);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [customerTypeLabel, setCustomerTypeLabel] = useState('Retail Customer');

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/auth');
      return;
    }

    const loadInstantItem = async () => {
      setLoading(true);
      setError('');
      try {
        if (typeof localStorage === 'undefined') {
          throw new Error('Instant purchase is not available in this environment');
        }
        const raw = localStorage.getItem('instantPurchase');
        if (!raw) {
          throw new Error('No item selected for instant purchase');
        }
        let parsed = null;
        try {
          parsed = JSON.parse(raw);
        } catch {
          throw new Error('Instant purchase data is invalid. Please try again.');
        }
        const pid = parsed.productId || parsed.product_id;
        const qtyRaw = quantityParam || parsed.quantity || 1;
        const qty = Number.isFinite(Number(qtyRaw)) && Number(qtyRaw) > 0 ? Number(qtyRaw) : 1;
        if (!pid) {
          throw new Error('Instant purchase item is missing. Please try again.');
        }

        const response = await fetch(`${API_BASE}/products/${pid}/priced`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to load product for instant purchase');
        }
        const effectivePrice = Number(data.effective_price || 0);
        if (!Number.isFinite(effectivePrice) || effectivePrice <= 0) {
          throw new Error('Price not available for instant purchase');
        }
        setInstantItem({
          productId: data.id,
          name: data.name,
          price: effectivePrice,
          quantity: qty,
        });
      } catch (err) {
        setInstantItem(null);
        setError(err.message || 'Something went wrong while preparing instant purchase');
      } finally {
        setLoading(false);
      }
    };

    const fetchCart = async () => {
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

    if (isInstant) {
      loadInstantItem();
    } else {
      fetchCart();
    }
  }, [navigate, isInstant, quantityParam]);

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

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    const stored = localStorage.getItem('appliedCouponCode');
    if (stored) {
      setAppliedCouponCode(stored);
    }
  }, []);

  useEffect(() => {
    const validateAtCheckout = async () => {
      if (!appliedCouponCode || !cart || isInstant) {
        setCouponSummary(null);
        return;
      }
      const token = getAuthToken();
      if (!token) return;
      setLoadingCoupon(true);
      try {
        const response = await fetch(`${API_BASE}/coupons/validate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code: appliedCouponCode }),
        });
        const data = await response.json();
        if (!response.ok || !data.valid) {
          setCouponSummary(null);
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('appliedCouponCode');
          }
          return;
        }
        setCouponSummary({
          code: data.code,
          subtotal: Number(data.subtotal || 0),
          discountAmount: Number(data.discount_amount || 0),
          totalAfterDiscount: Number(data.total_after_discount || 0),
        });
      } catch {
        setCouponSummary(null);
      } finally {
        setLoadingCoupon(false);
      }
    };
    validateAtCheckout();
  }, [appliedCouponCode, cart, isInstant]);

  const cartItems = cart && Array.isArray(cart.items) ? cart.items : [];
  const instantItems = instantItem
    ? [
        {
          id: instantItem.productId,
          product: { name: instantItem.name },
          quantity: instantItem.quantity,
          itemTotal: instantItem.price * instantItem.quantity,
        },
      ]
    : [];
  const items = isInstant ? instantItems : cartItems;
  const itemsCount = isInstant
    ? instantItem
      ? instantItem.quantity
      : 0
    : cartItems.reduce(
        (sum, item) => sum + (Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 0),
        0,
      );
  const subtotal = isInstant
    ? instantItem
      ? instantItem.price * instantItem.quantity
      : 0
    : couponSummary
      ? couponSummary.subtotal
      : cart
        ? Number(cart.total || 0)
        : 0;
  const shipping = 0;
  const discountAmount = couponSummary ? couponSummary.discountAmount : 0;
  const total = couponSummary
    ? couponSummary.totalAfterDiscount + shipping
    : subtotal + shipping;

  const buildShippingAddress = () => {
    const lines = [];
    const nameLine = `${firstName} ${lastName}`.trim();
    if (nameLine) {
      lines.push(nameLine);
    }
    if (companyName) {
      lines.push(companyName);
    }
    if (address1) {
      lines.push(address1);
    }
    if (address2) {
      lines.push(address2);
    }
    const cityStatePost = [city, stateName, postcode].filter(Boolean).join(', ');
    if (cityStatePost) {
      lines.push(cityStatePost);
    }
    if (country) {
      lines.push(country);
    }
    return lines.join('\n');
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        resolve(false);
        return;
      }
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleRazorpayPayment = async (token, shippingAddress) => {
    setPlacingOrder(true);
    setError('');
    setMessage('');
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Unable to load payment gateway. Please try again.');
      }
      const createResponse = await fetch(`${API_BASE}/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shipping_address: shippingAddress,
          notes: orderNotes,
          coupon_code: appliedCouponCode || undefined,
        }),
      });
      const createData = await createResponse.json();
      if (!createResponse.ok) {
        throw new Error(createData.message || 'Failed to initiate payment');
      }
      if (typeof window === 'undefined' || !window.Razorpay) {
        throw new Error('Payment gateway not available');
      }
      const options = {
        key: createData.key_id,
        amount: createData.amount,
        currency: createData.currency || 'INR',
        name: 'Ashoka',
        description: 'Order payment',
        order_id: createData.razorpay_order_id,
        prefill: {
          name: `${firstName} ${lastName}`.trim() || undefined,
          email: billingEmail || undefined,
          contact: billingPhone || undefined,
        },
        notes: {
          order_id: String(createData.order_id),
        },
        handler: async (response) => {
          try {
            const verifyResponse = await fetch(`${API_BASE}/payment/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                order_id: createData.order_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok) {
              throw new Error(verifyData.message || 'Payment verification failed');
            }
            const msg = verifyData.message || 'Payment successful';
            setMessage(msg);
            if (typeof window !== 'undefined') {
              window.dispatchEvent(
                new CustomEvent('app:toast', {
                  detail: { message: msg, variant: 'success' },
                }),
              );
            }
            if (verifyData && verifyData.order_id) {
              navigate(`/order-confirmation?orderId=${verifyData.order_id}`);
            } else {
              navigate('/orders');
            }
          } catch (err) {
            setError(err.message || 'Payment verification failed');
          } finally {
            setPlacingOrder(false);
          }
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: () => {
            setPlacingOrder(false);
          },
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err.message || 'Something went wrong while initiating payment');
      setPlacingOrder(false);
    }
  };

  const handlePlaceOrder = async () => {
    const token = getAuthToken();
    if (!token) {
      navigate('/auth');
      return;
    }
    if (!isInstant && !items.length) {
      setError('Your cart is empty. Please add items before placing an order.');
      return;
    }
    if (isInstant && !instantItem) {
      setError('No item selected for instant purchase.');
      return;
    }
    if (!address1 || !city || !stateName || !postcode || !billingPhone) {
      setError('Please fill in your address and contact details before placing an order.');
      return;
    }
    const shippingAddress = buildShippingAddress();
    if (paymentMethod === 'razorpay') {
      if (isInstant) {
        setError(
          'Online payment is not available for instant purchase. Please choose Cash on Delivery or use the cart checkout.'
        );
        return;
      }
      await handleRazorpayPayment(token, shippingAddress);
      return;
    }
    setPlacingOrder(true);
    setError('');
    setMessage('');
    try {
      const url = isInstant ? `${API_BASE}/orders/instant` : `${API_BASE}/orders/place`;
      const body = isInstant
        ? {
            product_id: instantItem.productId,
            quantity: instantItem.quantity,
            shipping_address: shippingAddress,
            payment_method: paymentMethod || 'cod',
            notes: orderNotes,
          }
        : {
            shipping_address: shippingAddress,
            payment_method: paymentMethod || 'cod',
            notes: orderNotes,
            coupon_code: appliedCouponCode || undefined,
          };
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
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
      if (isInstant && typeof localStorage !== 'undefined') {
        localStorage.removeItem('instantPurchase');
      }
      if (data && data.orderId) {
        navigate(`/order-confirmation?orderId=${data.orderId}`);
      } else {
        navigate('/orders');
      }
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
          <div className="checkout-summary d-flex flex-wrap align-items-center justify-content-between mb-4">
            <div className="checkout-summary-steps">
              <span className="checkout-summary-step checkout-summary-step-active">Cart</span>
              <span className="checkout-summary-step-separator">›</span>
              <span className="checkout-summary-step checkout-summary-step-active">Checkout</span>
              <span className="checkout-summary-step-separator">›</span>
              <span className="checkout-summary-step">Order Complete</span>
            </div>
            <div className="checkout-summary-totals">
              <span className="checkout-summary-label">Items:</span>
              <span className="checkout-summary-value">{itemsCount}</span>
              <span className="checkout-summary-divider">•</span>
              <span className="checkout-summary-label">Total:</span>
              <span className="checkout-summary-value">₹{total.toFixed(2)}</span>
            </div>
          </div>
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
                <h3 className="checkout-section-title mb-1">Your order</h3>
                <p className="checkout-order-subtitle mb-3">
                  Review your order summary and choose a secure payment method.
                </p>
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
                  {couponSummary && discountAmount > 0 && (
                    <div className="checkout-order-row d-flex justify-content-between text-success">
                      <span>
                        Discount ({couponSummary.code})
                        {loadingCoupon && ' (checking...)'}
                      </span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
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
                    id="paymentCod"
                    type="radio"
                    name="paymentMethod"
                    label="Cash on Delivery (COD)"
                    className="checkout-payment-option"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <p className="checkout-payment-text">
                    Pay in cash when your order is delivered to your doorstep.
                  </p>
                  <Form.Check
                    id="paymentRazorpay"
                    type="radio"
                    name="paymentMethod"
                    label="Razorpay (UPI / Card / Netbanking)"
                    className="checkout-payment-option"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                  />
                  <p className="checkout-payment-text">
                    You will be redirected to Razorpay secure checkout to complete the payment.
                  </p>
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
