import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AuthOptions = () => {
  return (
    <div className="py-5">
      <Container>
        <Row className="justify-content-center mb-4">
          <Col lg={8} className="text-center">
            <h1 className="mb-2">Login</h1>
            <p className="text-muted mb-0">
              Choose how you want to access your account or create a new one.
            </p>
          </Col>
        </Row>

        <Row className="g-4 justify-content-center">
          <Col md={6} lg={5}>
            <div className="p-4 border rounded-3 h-100">
              <h4 className="mb-2">User</h4>
              <p className="text-muted small mb-4">
                For regular customers shopping on Ashoka.
              </p>
              <div className="d-flex flex-column gap-2">
                <Button as={Link} to="/login" variant="dark">
                  User Login
                </Button>
                <Button as={Link} to="/register" variant="outline-dark">
                  User Registration
                </Button>
              </div>
            </div>
          </Col>

          <Col md={6} lg={5}>
            <div className="p-4 border rounded-3 h-100">
              <h4 className="mb-2">Wholesaler</h4>
              <p className="text-muted small mb-4">
                For wholesale partners and bulk purchasing.
              </p>
              <div className="d-flex flex-column gap-2">
                <Button as={Link} to="/wholesaler-login" variant="dark">
                  Wholesaler Login
                </Button>
                <Button as={Link} to="/wholesaler-register" variant="outline-dark">
                  Wholesaler Registration
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AuthOptions;

