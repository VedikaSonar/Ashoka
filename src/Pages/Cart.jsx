import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import './Product.css';

const API_BASE = 'http://127.0.0.1:5000/api';

const getAuthToken = () => {
  if (typeof localStorage === 'undefined') return null;
  const userToken = localStorage.getItem('userToken');
  if (userToken) return userToken;
  const wholesalerToken = localStorage.getItem('wholesalerToken');
  if (wholesalerToken) return wholesalerToken;
  return null;
};

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadCart = async () => {
    const token = getAuthToken();
    if (!token) {
      setError('Please login as customer or wholesaler to view your cart');
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

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = async (item, quantity) => {
    const token = getAuthToken();
    if (!token) {
      setError('Please login to update cart');
      return;
    }
    setMessage('');
    setError('');
    try {
      const response = await fetch(`${API_BASE}/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: item.product_id, quantity }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update cart');
      }
      await loadCart();
      setMessage('Cart updated');
    } catch (err) {
      setError(err.message || 'Something went wrong while updating cart');
    }
  };

  const handleRemoveItem = async (item) => {
    const token = getAuthToken();
    if (!token) {
      setError('Please login to update cart');
      return;
    }
    setMessage('');
    setError('');
    try {
      const response = await fetch(`${API_BASE}/cart/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: item.product_id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove item');
      }
      await loadCart();
      setMessage('Item removed from cart');
    } catch (err) {
      setError(err.message || 'Something went wrong while removing item');
    }
  };

  const items = cart && Array.isArray(cart.items) ? cart.items : [];

  return (
    <div className="product-page">
      <section className="product-banner text-center text-white py-5">
        <Container>
          <h1 className="banner-title display-4 fw-bold mb-3">Shopping Cart</h1>
          <nav className="breadcrumb-nav d-flex justify-content-center align-items-center gap-2">
            <span>Home</span>
            <span className="dot">•</span>
            <span className="active">Cart</span>
          </nav>
        </Container>
      </section>

      <section className="product-content py-5">
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
            <div className="text-center py-5">
              <span>Loading cart...</span>
            </div>
          )}

          {!loading && !items.length && !error && (
            <div className="text-center py-5">
              <p className="mb-3">Your cart is empty.</p>
              <Button as={Link} to="/shop" variant="success">
                Go to Shop
              </Button>
            </div>
          )}

          {!loading && items.length > 0 && (
            <>
              <Row className="justify-content-center mb-4">
                <Col lg={10}>
                  <Table responsive bordered hover className="align-middle cart-table">
                    <thead>
                      <tr>
                        <th className="text-center">Images</th>
                        <th>Product</th>
                        <th className="text-center">Unit Price</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-center">Total</th>
                        <th className="text-center">Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className="text-center">
                            <div className="cart-img-wrapper mx-auto">
                              {item.product && item.product.images && item.product.images.length ? (
                                <img
                                  src={`${API_BASE.replace('/api', '')}/${item.product.images[0].image_url}`}
                                  alt={item.product.name}
                                  className="img-fluid"
                                />
                              ) : (
                                <span className="small text-muted">No Image</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <Link
                              to={`/product/${item.product_id}`}
                              className="text-decoration-none text-dark"
                            >
                              <div className="fw-semibold">
                                {item.product ? item.product.name : 'Product'}
                              </div>
                            </Link>
                            <div className="small text-muted">
                              {item.product && item.product.category
                                ? item.product.category.name
                                : ''}
                            </div>
                          </td>
                          <td className="text-center">
                            ${Number(item.price || 0).toFixed(2)}
                          </td>
                          <td className="text-center">
                            <div className="qty-control">
                              <button
                                type="button"
                                className="qty-btn"
                                onClick={() =>
                                  handleQuantityChange(
                                    item,
                                    item.quantity > 1 ? item.quantity - 1 : 1,
                                  )
                                }
                              >
                                −
                              </button>
                              <span className="qty-value">{item.quantity}</span>
                              <button
                                type="button"
                                className="qty-btn"
                                onClick={() =>
                                  handleQuantityChange(item, item.quantity + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="text-center">
                            ${Number(item.itemTotal || 0).toFixed(2)}
                          </td>
                          <td className="text-center">
                            <button
                              type="button"
                              className="cart-remove-btn"
                              onClick={() => handleRemoveItem(item)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>

              <Row className="justify-content-center mb-4">
                <Col lg={6}>
                  <div className="cart-coupon-box d-flex flex-column flex-md-row gap-3 align-items-md-center">
                    <input
                      type="text"
                      className="form-control cart-coupon-input"
                      placeholder="Coupon code"
                      disabled
                    />
                    <div className="d-flex gap-2">
                      <Button variant="outline-secondary" disabled>
                        Apply Coupon
                      </Button>
                      <Button variant="outline-secondary" onClick={loadCart}>
                        Update Cart
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="justify-content-center">
                <Col lg={4}>
                  <div className="cart-summary-box">
                    <h5 className="mb-3">Cart Totals</h5>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal</span>
                      <span className="fw-bold">
                        ${cart ? Number(cart.total || 0).toFixed(2) : '0.00'}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Total</span>
                      <span className="fw-bold">
                        ${cart ? Number(cart.total || 0).toFixed(2) : '0.00'}
                      </span>
                    </div>
                    <Button variant="success" className="w-100">
                      Proceed to Checkout
                    </Button>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </section>
    </div>
  );
};

export default Cart;
