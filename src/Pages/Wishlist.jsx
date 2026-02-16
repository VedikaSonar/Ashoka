import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, X } from 'lucide-react';
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

const getStoredWishlistIds = () => {
  if (typeof localStorage === 'undefined') return [];
  try {
    const data = localStorage.getItem('wishlistIds');
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
};

const Wishlist = () => {
  const [wishlistIds, setWishlistIds] = useState(getStoredWishlistIds);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (!wishlistIds.length) {
        setProducts([]);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE}/products?limit=100&page=1`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to load products');
        }
        const list = Array.isArray(data.products) ? data.products : [];
        const filtered = list.filter((p) => wishlistIds.includes(p.id));
        setProducts(filtered);
      } catch (err) {
        setError(err.message || 'Something went wrong while loading wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlistIds]);

  const persistWishlist = (ids) => {
    setWishlistIds(ids);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('wishlistIds', JSON.stringify(ids));
    }
  };

  const handleRemove = (productId) => {
    setMessage('');
    setError('');
    const updated = wishlistIds.filter((id) => id !== productId);
    persistWishlist(updated);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setMessage('Removed from wishlist');
  };

  const handleAddToCart = async (productId) => {
    setMessage('');
    setError('');
    const token = getAuthToken();
    if (!token) {
      setError('Please login as customer or wholesaler to add items to cart');
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add item to cart');
      }
      setMessage('Item added to cart');
    } catch (err) {
      setError(err.message || 'Something went wrong while adding to cart');
    }
  };

  return (
    <div className="product-page">
      <section className="product-banner text-center text-white py-5">
        <Container>
          <h1 className="banner-title display-4 fw-bold mb-3">Wishlist</h1>
          <nav className="breadcrumb-nav d-flex justify-content-center align-items-center gap-2">
            <span>Home</span>
            <span className="dot">•</span>
            <span className="active">Wishlist</span>
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
              <span>Loading wishlist...</span>
            </div>
          )}

          {!loading && !products.length && !error && (
            <div className="text-center py-5">
              <p className="mb-3">Your wishlist is empty.</p>
              <Button as={Link} to="/shop" variant="success">
                Go to Shop
              </Button>
            </div>
          )}

          {!loading && products.length > 0 && (
            <Row className="g-4">
              {products.map((product) => (
                <Col key={product.id} lg={4} md={6}>
                  <div className="product-card h-100">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className="text-uppercase small text-success fw-bold">
                        Wishlist Item
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-light border-0"
                        onClick={() => handleRemove(product.id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="d-flex gap-3">
                      <div className="product-img-wrapper" style={{ flex: '0 0 120px' }}>
                        <img
                          src={
                            product.images && product.images.length
                              ? `${API_BASE.replace('/api', '')}/${product.images[0].image_url}`
                              : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="100%" height="100%" fill="%23f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14">No Image</text></svg>'
                          }
                          alt={product.name}
                          className="img-fluid product-img"
                        />
                      </div>
                      <div className="flex-grow-1">
                        <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                          <h5 className="product-name fw-bold mb-2">{product.name}</h5>
                        </Link>
                        <p className="product-category text-uppercase small mb-2">
                          {product.category && product.category.name
                            ? product.category.name
                            : 'CATEGORY'}
                        </p>
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <span className="current-price fw-bold text-success">
                            ${Number(product.customer_price || product.wholesaler_price || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleAddToCart(product.id)}
                          >
                            <ShoppingBag size={16} className="me-1" />
                            Add To Cart
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => handleRemove(product.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </div>
  );
};

export default Wishlist;

