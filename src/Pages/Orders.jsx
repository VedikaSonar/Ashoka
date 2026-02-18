import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Alert, Spinner, Badge, Button, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
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

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customerType, setCustomerType] = useState('Retail Customer');
  const [scope, setScope] = useState('recent');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const wholesalerToken = localStorage.getItem('wholesalerToken');
      if (wholesalerToken) {
        setCustomerType('Wholesaler');
      } else {
        setCustomerType('Retail Customer');
      }
    }

    const token = getAuthToken();
    if (!token) {
      navigate('/auth');
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const query = scope ? `?scope=${encodeURIComponent(scope)}` : '';
        const response = await fetch(`${API_BASE}/orders${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to load orders');
        }
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Something went wrong while loading orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, scope]);

  const handleScopeChange = (nextScope) => {
    if (nextScope === scope) return;
    setScope(nextScope);
    setActionMessage('');
    setActionError('');
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
    setActionMessage('');
    setActionError('');
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedOrder(null);
    setActionMessage('');
    setActionError('');
  };

  const handleCancelOrder = async (orderId) => {
    const token = getAuthToken();
    if (!token) {
      setActionError('Please login again to manage your orders.');
      return;
    }
    if (typeof window !== 'undefined') {
      const proceed = window.confirm('Are you sure you want to cancel this order?');
      if (!proceed) return;
    }
    setActionMessage('');
    setActionError('');
    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel order');
      }
      const msg = data.message || 'Order cancelled successfully';
      setActionMessage(msg);
      const updated = orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'cancelled',
            }
          : o,
      );
      setOrders(updated);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: 'cancelled',
        });
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('app:toast', {
            detail: { message: msg, variant: 'success' },
          }),
        );
      }
    } catch (err) {
      setActionError(err.message || 'Something went wrong while cancelling order');
    }
  };

  const openInvoice = (orderId) => {
    if (typeof window === 'undefined') return;
    const url = `${API_BASE}/orders/${orderId}/invoice`;
    window.open(url, '_blank', 'noopener');
  };

  return (
    <div className="product-page">
      <section className="product-banner text-center text-white py-5">
        <Container>
          <h1 className="banner-title display-4 fw-bold mb-3">My Orders</h1>
          <nav className="breadcrumb-nav d-flex justify-content-center align-items-center gap-2">
            <span>Home</span>
            <span className="dot">•</span>
            <span className="active">My Orders</span>
          </nav>
          <div className="mt-2 small">
            You are logged in as{' '}
            <span className="fw-semibold">{customerType}</span>
          </div>
        </Container>
      </section>

      <section className="product-content py-5">
        <Container>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" size="sm" className="me-2" />
              <span>Loading your orders...</span>
            </div>
          )}

          {!loading && !error && !orders.length && (
            <div className="text-center py-5">
              <p className="mb-3">You have not placed any orders yet.</p>
              <Link to="/shop" className="btn btn-success">
                Start Shopping
              </Link>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <>
              <Row className="mb-3">
                <Col className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div className="btn-group">
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        scope === 'recent' ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => handleScopeChange('recent')}
                    >
                      Recent Orders
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        scope === 'history' ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => handleScopeChange('history')}
                    >
                      Order History
                    </button>
                  </div>
                  {actionMessage && (
                    <span className="text-success small">{actionMessage}</span>
                  )}
                  {actionError && <span className="text-danger small">{actionError}</span>}
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="table-responsive">
                    <Table striped hover className="cart-table align-middle">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Payment</th>
                          <th>Items</th>
                          <th>Total Amount (₹)</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => {
                          const createdAt = order.created_at || order.createdAt;
                          const dateStr = createdAt
                            ? new Date(createdAt).toLocaleString()
                            : '-';
                          const itemCount = Array.isArray(order.items)
                            ? order.items.reduce((sum, it) => sum + (it.quantity || 0), 0)
                            : 0;
                          const total = Number(order.total_amount || 0);
                          const paymentMethod = (order.payment_method || 'cod').toLowerCase();
                          const paymentStatus = (order.payment_status || 'pending').toLowerCase();

                          let paymentLabel = 'Cash on Delivery';
                          if (paymentMethod !== 'cod') {
                            paymentLabel = 'Online (Razorpay)';
                          }

                          let paymentVariant = 'secondary';
                          if (paymentStatus === 'paid') paymentVariant = 'success';
                          else if (paymentStatus === 'failed') paymentVariant = 'danger';
                          else if (paymentStatus === 'refunded') paymentVariant = 'warning';

                          return (
                            <tr key={order.id}>
                              <td>#{order.id}</td>
                              <td>{dateStr}</td>
                              <td className="text-capitalize">{order.status || 'pending'}</td>
                              <td>
                                <div className="d-flex flex-column gap-1">
                                  <span>{paymentLabel}</span>
                                  <Badge bg={paymentVariant} pill className="text-uppercase">
                                    {paymentStatus}
                                  </Badge>
                                </div>
                              </td>
                              <td>{itemCount}</td>
                              <td>₹{total.toFixed(2)}</td>
                              <td>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  onClick={() => openDetails(order)}
                                >
                                  View
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </section>

      <Modal show={showDetails} onHide={closeDetails} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Order #{selectedOrder?.id}{' '}
            {selectedOrder && (
              <Badge bg="secondary" className="text-uppercase ms-2">
                {selectedOrder.status}
              </Badge>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <div className="mb-2">
                    <strong>Placed On:</strong>{' '}
                    {selectedOrder.created_at || selectedOrder.createdAt
                      ? new Date(
                          selectedOrder.created_at || selectedOrder.createdAt,
                        ).toLocaleString()
                      : '-'}
                  </div>
                  <div className="mb-2">
                    <strong>Payment Method:</strong>{' '}
                    {(selectedOrder.payment_method || 'cod').toLowerCase() === 'cod'
                      ? 'Cash on Delivery'
                      : 'Online (Razorpay)'}
                  </div>
                  <div className="mb-2">
                    <strong>Payment Status:</strong>{' '}
                    <span className="text-capitalize">
                      {selectedOrder.payment_status || 'pending'}
                    </span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-2">
                    <strong>Current Status:</strong>{' '}
                    <span className="text-capitalize">
                      {selectedOrder.status || 'pending'}
                    </span>
                  </div>
                  <div className="mb-2">
                    <strong>Total Amount:</strong>{' '}
                    ₹{Number(selectedOrder.total_amount || 0).toFixed(2)}
                  </div>
                  {selectedOrder.coupon_code && (
                    <div className="mb-2">
                      <strong>Coupon:</strong> {selectedOrder.coupon_code}
                    </div>
                  )}
                  {selectedOrder.discount_amount && (
                    <div className="mb-2">
                      <strong>Discount:</strong>{' '}
                      -₹{Number(selectedOrder.discount_amount || 0).toFixed(2)}
                    </div>
                  )}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <h6>Shipping Address</h6>
                  <div className="p-3 border rounded bg-light">
                    {selectedOrder.shipping_address || '-'}
                  </div>
                </Col>
              </Row>

              {selectedOrder.notes && (
                <Row className="mb-3">
                  <Col>
                    <h6>Notes</h6>
                    <div className="p-3 border rounded bg-light">
                      {selectedOrder.notes}
                    </div>
                  </Col>
                </Row>
              )}

              <Row>
                <Col>
                  <h6>Items</h6>
                  <div className="table-responsive">
                    <Table striped hover size="sm" className="align-middle">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Price (₹)</th>
                          <th>Total (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                          selectedOrder.items.map((item) => {
                            const price = Number(item.price || 0);
                            const qty = Number(item.quantity || 0);
                            return (
                              <tr key={item.id}>
                                <td>{item.product_name || 'Product'}</td>
                                <td>{qty}</td>
                                <td>{price.toFixed(2)}</td>
                                <td>{(price * qty).toFixed(2)}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center text-muted">
                              No items found for this order.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedOrder && selectedOrder.status === 'delivered' && (
            <Button variant="outline-primary" onClick={() => openInvoice(selectedOrder.id)}>
              Invoice
            </Button>
          )}
          {selectedOrder &&
            selectedOrder.status !== 'delivered' &&
            selectedOrder.status !== 'cancelled' && (
              <Button
                variant="outline-danger"
                onClick={() => handleCancelOrder(selectedOrder.id)}
              >
                Cancel Order
              </Button>
            )}
          <Button variant="secondary" onClick={closeDetails}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Orders;
