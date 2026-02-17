import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Alert, Spinner } from 'react-bootstrap';
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

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/auth');
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
  }, [navigate]);

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
            <Row>
              <Col>
                <div className="table-responsive">
                  <Table striped hover className="cart-table align-middle">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Items</th>
                        <th>Total Amount (₹)</th>
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
                        return (
                          <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>{dateStr}</td>
                            <td className="text-capitalize">{order.status || 'pending'}</td>
                            <td>{itemCount}</td>
                            <td>₹{total.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </div>
  );
};

export default Orders;

