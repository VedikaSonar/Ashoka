import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Alert, Button, Table, Pagination, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ShoppingBag, X } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      const token = getAuthToken();
      if (!token) {
        const msg = 'Please login as customer or wholesaler to use wishlist';
        setError(msg);
        setProducts([]);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('app:toast', {
              detail: { message: msg, variant: 'danger' },
            }),
          );
        }
        return;
      }
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

  useEffect(() => {
    const handleWishlistUpdate = () => {
      setWishlistIds(getStoredWishlistIds());
    };
    window.addEventListener('wishlist:update', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlist:update', handleWishlistUpdate);
    };
  }, []);

  const persistWishlist = (ids) => {
    setWishlistIds(ids);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('wishlistIds', JSON.stringify(ids));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('wishlist:update'));
    }
  };

  const handleRemove = (productId) => {
    setMessage('');
    setError('');
    const updated = wishlistIds.filter((id) => id !== productId);
    persistWishlist(updated);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    const msg = 'Removed from wishlist';
    setMessage(msg);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('app:toast', {
          detail: { message: msg, variant: 'success' },
        }),
      );
    }
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
      const msg = 'Item added to cart';
      setMessage(msg);
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem('cartCount');
        const current = parseInt(raw || '0', 10);
        const next = Number.isNaN(current) || current < 0 ? 1 : current + 1;
        localStorage.setItem('cartCount', String(next));
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cart:update'));
        window.dispatchEvent(
          new CustomEvent('app:toast', {
            detail: { message: msg, variant: 'success' },
          }),
        );
      }
    } catch (err) {
      setError(err.message || 'Something went wrong while adding to cart');
    }
  };

  const itemsPerPage = 5;
  const totalItems = products.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const indexOfLastItem = safePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

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
            <Row className="justify-content-center">
              <Col lg={10}>
                <div className="d-flex justify-content-between align-items-center mb-3 wishlist-header">
                  <div>
                    <h3 className="mb-1">Your Saved Items</h3>
                    <p className="text-muted mb-0">
                      Keep products you love here and move them to cart when you are ready.
                    </p>
                  </div>
                  <Badge bg="success" pill>
                    {totalItems} item{totalItems !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <Table responsive bordered hover className="align-middle wishlist-table wishlist-table-styled">
                  <thead>
                    <tr>
                      <th className="text-center">Images</th>
                      <th>Product</th>
                      <th className="text-center">Unit Price</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map((product) => {
                      const unitPrice = Number(
                        product.customer_price || product.wholesaler_price || 0,
                      );
                      return (
                        <tr key={product.id}>
                          <td className="text-center">
                            <div className="cart-img-wrapper mx-auto">
                              <img
                                src={
                                  product.images && product.images.length
                                    ? `${API_BASE.replace('/api', '')}/${product.images[0].image_url}`
                                    : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="100%" height="100%" fill="%23f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14">No Image</text></svg>'
                                }
                                alt={product.name}
                                className="img-fluid"
                              />
                            </div>
                          </td>
                          <td>
                            <Link
                              to={`/product/${product.id}`}
                              className="text-decoration-none text-dark"
                            >
                              <div className="fw-semibold wishlist-product-name">{product.name}</div>
                            </Link>
                            <div className="small text-muted">
                              {product.category && product.category.name
                                ? product.category.name
                                : 'CATEGORY'}
                            </div>
                          </td>
                          <td className="text-center">
                            ₹{unitPrice.toFixed(2)}
                          </td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleAddToCart(product.id)}
                              >
                                <ShoppingBag size={14} className="me-1" />
                                Add to Cart
                              </Button>
                              <button
                                type="button"
                                className="cart-remove-btn"
                                onClick={() => handleRemove(product.id)}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>

                {totalPages > 1 && (
                  <div className="pagination-wrapper d-flex justify-content-center mt-3">
                    <Pagination>
                      <Pagination.Prev
                        disabled={safePage === 1}
                        onClick={() => {
                          if (safePage > 1) {
                            setCurrentPage(safePage - 1);
                          }
                        }}
                      />
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <Pagination.Item
                            key={pageNumber}
                            active={safePage === pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </Pagination.Item>
                        );
                      })}
                      <Pagination.Next
                        disabled={safePage === totalPages}
                        onClick={() => {
                          if (safePage < totalPages) {
                            setCurrentPage(safePage + 1);
                          }
                        }}
                      />
                    </Pagination>
                  </div>
                )}

                <div className="text-end mt-3" />
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </div>
  );
};

export default Wishlist;
