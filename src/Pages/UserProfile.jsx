import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    const token = localStorage.getItem('userToken');
    const infoRaw = localStorage.getItem('userInfo');
    if (!token || !infoRaw) {
      navigate('/auth');
      return;
    }
    try {
      const parsed = JSON.parse(infoRaw);
      setUser(parsed);
    } catch {
      setUser(null);
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Alert variant="warning" className="text-center">
                Please login to view your profile.{' '}
                <Link to="/auth">Go to Login / Register</Link>
              </Alert>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  const address = localStorage.getItem('userAddress') || user.address || '';

  return (
    <div className="py-5" style={{ backgroundColor: '#f7fbf2' }}>
      <Container>
        <Row className="justify-content-center mb-4">
          <Col md={8}>
            <h2 className="mb-3">My Profile</h2>
            <p className="text-muted mb-0">
              View your account information and manage your shopping activity.
            </p>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Row>
                  <Col md={6} className="mb-3">
                    <div className="mb-2 text-muted small">Name</div>
                    <div className="fw-semibold">{user.name || '-'}</div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="mb-2 text-muted small">Email</div>
                    <div className="fw-semibold">{user.email || '-'}</div>
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3">
                    <div className="mb-2 text-muted small">Phone</div>
                    <div className="fw-semibold">{user.phone || '-'}</div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="mb-2 text-muted small">Customer Type</div>
                    <div className="fw-semibold">Retail Customer</div>
                  </Col>
                </Row>
                <Row>
                  <Col className="mb-3">
                    <div className="mb-2 text-muted small">Address</div>
                    <div className="fw-semibold">{address || '-'}</div>
                  </Col>
                </Row>
                <div className="d-flex gap-2 mt-3">
                  <Button as={Link} to="/orders" variant="success">
                    View Orders
                  </Button>
                  <Button as={Link} to="/wishlist" variant="outline-success">
                    My Wishlist
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserProfile;

