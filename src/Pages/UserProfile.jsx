import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = 'http://127.0.0.1:5000/api';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileType, setProfileType] = useState('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    const userToken = localStorage.getItem('userToken');
    const userInfoRaw = localStorage.getItem('userInfo');
    const wholesalerToken = localStorage.getItem('wholesalerToken');
    const wholesalerInfoRaw = localStorage.getItem('wholesalerInfo');

    if (userToken && userInfoRaw) {
      setProfileType('user');
      try {
        const parsed = JSON.parse(userInfoRaw);
        setUser(parsed);
        setName(parsed.name || '');
        setEmail(parsed.email || '');
        setPhone(parsed.phone || '');
        const storedAddress = localStorage.getItem('userAddress') || parsed.address || '';
        setAddress(storedAddress);
        setBusinessName('');
        setGstNumber('');
        setApprovalStatus('');
        setCity(parsed.city || '');
        setStateName(parsed.state || '');
        setPincode(parsed.pincode || '');
        setIsVerified(false);
      } catch {
        setUser(null);
      }
      return;
    }

    if (wholesalerToken && wholesalerInfoRaw) {
      setProfileType('wholesaler');
      try {
        const parsed = JSON.parse(wholesalerInfoRaw);
        setUser(parsed);
        setName(parsed.name || '');
        setEmail(parsed.email || '');
        setPhone(parsed.phone || '');
        const storedAddress = localStorage.getItem('userAddress') || parsed.address || '';
        setAddress(storedAddress);
        setBusinessName(parsed.business_name || '');
        setGstNumber(parsed.gst_number || '');
        setApprovalStatus(parsed.status || '');
         setCity(parsed.city || '');
         setStateName(parsed.state || '');
         setPincode(parsed.pincode || '');
         setIsVerified(Boolean(parsed.is_verified));
      } catch {
        setUser(null);
      }
      return;
    }

    navigate('/auth');
  }, [navigate]);

  const handleSave = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (typeof localStorage === 'undefined') return;
    const userToken = localStorage.getItem('userToken');
    const wholesalerToken = localStorage.getItem('wholesalerToken');

    let token = null;
    let endpoint = `${API_BASE}/users/profile`;
    let storageKey = 'userInfo';

    if (profileType === 'wholesaler' && wholesalerToken) {
      token = wholesalerToken;
      endpoint = `${API_BASE}/wholesalers/profile`;
      storageKey = 'wholesalerInfo';
    } else if (userToken) {
      token = userToken;
      endpoint = `${API_BASE}/users/profile`;
      storageKey = 'userInfo';
    }

    if (!token) {
      navigate('/auth');
      return;
    }

    setSaving(true);
    try {
      const body =
        profileType === 'wholesaler'
          ? {
              name,
              email,
              phone,
              business_name: businessName,
              gst_number: gstNumber,
              address,
              city,
              state: stateName,
              pincode,
            }
          : {
              name,
              email,
              phone,
            };

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      const updatedUser =
        data.user || data.wholesaler || {
          ...(user || {}),
          name,
          email,
          phone,
          address,
          business_name: businessName,
          gst_number: gstNumber,
          city,
          state: stateName,
          pincode,
        };

      setUser(updatedUser);
      localStorage.setItem(storageKey, JSON.stringify(updatedUser));
      setBusinessName(updatedUser.business_name || '');
      setGstNumber(updatedUser.gst_number || '');
      setApprovalStatus(updatedUser.status || approvalStatus);
      setCity(updatedUser.city || '');
      setStateName(updatedUser.state || '');
      setPincode(updatedUser.pincode || '');
      setIsVerified(Boolean(updatedUser.is_verified));
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
                      <div className="fw-semibold">
                        {profileType === 'wholesaler' ? 'Wholesaler' : 'Retail Customer'}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="profileCompanyName">
                        <Form.Label className="text-muted small mb-1">Company Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={businessName}
                          onChange={(event) => setBusinessName(event.target.value)}
                          placeholder="Enter your company name"
                          disabled={profileType !== 'wholesaler'}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="profileGstNumber">
                        <Form.Label className="text-muted small mb-1">GST Number</Form.Label>
                        <Form.Control
                          type="text"
                          value={gstNumber}
                          onChange={(event) => setGstNumber(event.target.value)}
                          placeholder="Enter your GST number"
                          disabled={profileType !== 'wholesaler'}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} className="mb-3">
                      <div className="mb-2 text-muted small">Approval Status</div>
                      <div className="fw-semibold text-capitalize">
                        {profileType === 'wholesaler' ? approvalStatus || 'pending' : '-'}
                      </div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <div className="mb-2 text-muted small">Verification</div>
                      <div className="fw-semibold">
                        {profileType === 'wholesaler'
                          ? isVerified
                            ? 'Verified'
                            : 'Not Verified'
                          : '-'}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} className="mb-3">
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
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="profileCity">
                        <Form.Label className="text-muted small mb-1">City</Form.Label>
                        <Form.Control
                          type="text"
                          value={city}
                          onChange={(event) => setCity(event.target.value)}
                          placeholder="Enter your city"
                          disabled={profileType !== 'wholesaler'}
                        />
                      </Form.Group>
                      <Form.Group controlId="profileState" className="mt-2">
                        <Form.Label className="text-muted small mb-1">State</Form.Label>
                        <Form.Control
                          type="text"
                          value={stateName}
                          onChange={(event) => setStateName(event.target.value)}
                          placeholder="Enter your state"
                          disabled={profileType !== 'wholesaler'}
                        />
                      </Form.Group>
                      <Form.Group controlId="profilePincode" className="mt-2">
                        <Form.Label className="text-muted small mb-1">Pincode</Form.Label>
                        <Form.Control
                          type="text"
                          value={pincode}
                          onChange={(event) => setPincode(event.target.value)}
                          placeholder="Enter your pincode"
                          disabled={profileType !== 'wholesaler'}
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
