import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = 'http://127.0.0.1:5000/api';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
      setName(parsed.name || '');
      setEmail(parsed.email || '');
      setPhone(parsed.phone || '');
      const storedAddress = localStorage.getItem('userAddress') || parsed.address || '';
      setAddress(storedAddress);
    } catch {
      setUser(null);
    }
  }, [navigate]);

  const handleSave = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (typeof localStorage === 'undefined') return;
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/auth');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          email,
          phone
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      const updatedUser = data.user || {
        ...(user || {}),
        name,
        email,
        phone
      };

      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      if (address) {
        localStorage.setItem('userAddress', address);
      }
      setMessage(data.message || 'Profile updated successfully');
    } catch (err) {
      setError(err.message || 'Something went wrong while updating profile');
    } finally {
      setSaving(false);
    }
  };

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
                <Form onSubmit={handleSave}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="profileName">
                        <Form.Label className="text-muted small mb-1">Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          placeholder="Enter your name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="profileEmail">
                        <Form.Label className="text-muted small mb-1">Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="Enter your email"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="profilePhone">
                        <Form.Label className="text-muted small mb-1">Phone</Form.Label>
                        <Form.Control
                          type="text"
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          placeholder="Enter your phone"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <div className="mb-2 text-muted small">Customer Type</div>
                      <div className="fw-semibold">Retail Customer</div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="mb-3">
                      <Form.Group controlId="profileAddress">
                        <Form.Label className="text-muted small mb-1">Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={address}
                          onChange={(event) => setAddress(event.target.value)}
                          placeholder="Enter your address"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex gap-2 mt-2">
                    <Button type="submit" variant="success" disabled={saving}>
                      {saving ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={() => {
                        setName(user.name || '');
                        setEmail(user.email || '');
                        setPhone(user.phone || '');
                        const storedAddress =
                          localStorage.getItem('userAddress') || user.address || '';
                        setAddress(storedAddress);
                        setError('');
                        setMessage('');
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserProfile;
