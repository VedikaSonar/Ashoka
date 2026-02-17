import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { ShoppingBag, Eye, Heart, Star } from 'lucide-react';
import './Product.css';

const API_BASE = 'http://127.0.0.1:5000/api';
const FALLBACK_DETAIL_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500"><rect width="100%" height="100%" fill="%23f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="24">No Image</text></svg>';

const getAuthToken = () => {
  if (typeof localStorage === 'undefined') return null;
  const userToken = localStorage.getItem('userToken');
  if (userToken) return userToken;
  const wholesalerToken = localStorage.getItem('wholesalerToken');
  if (wholesalerToken) return wholesalerToken;
  return null;
};

const getInitialWishlist = () => {
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

const buildImageUrl = (imagePath) => {
  if (!imagePath) return FALLBACK_DETAIL_IMAGE;
  if (typeof imagePath !== 'string') return FALLBACK_DETAIL_IMAGE;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const baseUrl = API_BASE.replace('/api', '');
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${normalizedPath}`;
};

const mapApiProductToView = (product) => {
  const images = product.images || [];
  const orderedImages = [...images].sort((a, b) => {
    const aOrder = typeof a.sort_order === 'number' ? a.sort_order : 0;
    const bOrder = typeof b.sort_order === 'number' ? b.sort_order : 0;
    return aOrder - bOrder;
  });
  const primaryImage = orderedImages.find((img) => img.is_primary) || orderedImages[0];
  const primaryImageUrl = primaryImage ? buildImageUrl(primaryImage.image_url) : FALLBACK_DETAIL_IMAGE;
  const allImageUrls = orderedImages.map((img) => buildImageUrl(img.image_url));
  const categoryName =
    product.category && product.category.category_name ? product.category.category_name : 'CATEGORY';
  const retailPrice = product.customer_price ? Number(product.customer_price) : 0;
  const wholesalePrice = product.wholesaler_price ? Number(product.wholesaler_price) : 0;
  let price = retailPrice;
  if (typeof localStorage !== 'undefined') {
    const wholesalerToken = localStorage.getItem('wholesalerToken');
    if (wholesalerToken && wholesalePrice > 0) {
      price = wholesalePrice;
    } else if (retailPrice > 0) {
      price = retailPrice;
    } else if (wholesalePrice > 0) {
      price = wholesalePrice;
    }
  } else if (retailPrice > 0) {
    price = retailPrice;
  } else if (wholesalePrice > 0) {
    price = wholesalePrice;
  }
  const oldPrice = price > 0 ? price * 1.1 : 0;
  const discount =
    oldPrice > price && oldPrice > 0 ? `${Math.round(((oldPrice - price) / oldPrice) * 100)}% Off` : '';

  return {
    id: product.id,
    name: product.name,
    category: categoryName.toUpperCase(),
    price,
    oldPrice,
    discount,
    image: primaryImageUrl,
    images: allImageUrls,
    description: product.description || '',
  };
};

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState('');
  const [wishlistIds, setWishlistIds] = useState(getInitialWishlist);
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const navigate = useNavigate();

  const fetchRelatedProducts = async (baseProduct) => {
    setRelatedLoading(true);
    setRelatedError('');
    try {
      const response = await fetch(`${API_BASE}/products?limit=20&page=1`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to load related products');
      }
      const list = Array.isArray(data.products) ? data.products : [];
      const filtered = list.filter((p) => {
        if (!p || p.id === baseProduct.id) return false;
        if (p.category && baseProduct.category && p.category.id === baseProduct.category.id) return true;
        if (p.category && baseProduct.category && p.category.name === baseProduct.category.name) return true;
        return false;
      });
      const mapped = filtered.map(mapApiProductToView);
      setRelatedProducts(mapped);
    } catch (err) {
      setRelatedError(err.message || 'Something went wrong while loading related products');
    } finally {
      setRelatedLoading(false);
    }
  };

  useEffect(() => {
    const handleWishlistUpdate = () => {
      setWishlistIds(getInitialWishlist());
    };
    window.addEventListener('wishlist:update', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlist:update', handleWishlistUpdate);
    };
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE}/products/${id}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to load product');
        }
        const viewProduct = mapApiProductToView(data);
        setProduct(viewProduct);
        setActiveImageIndex(0);
        setQuantity(1);
        if (data && data.category) {
          fetchRelatedProducts(data);
        } else {
          setRelatedProducts([]);
        }
      } catch (err) {
        setError(err.message || 'Something went wrong while loading product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const persistWishlist = (ids) => {
    setWishlistIds(ids);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('wishlistIds', JSON.stringify(ids));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('wishlist:update'));
    }
  };

  const handleToggleWishlist = (productId) => {
    setActionMessage('');
    setActionError('');
    const token = getAuthToken();
    if (!token) {
      const msg = 'Please login as customer or wholesaler to use wishlist';
      setActionError(msg);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('app:toast', {
            detail: { message: msg, variant: 'danger' },
          }),
        );
      }
      return;
    }
    const exists = wishlistIds.includes(productId);
    const updated = exists
      ? wishlistIds.filter((pid) => pid !== productId)
      : [...wishlistIds, productId];
    persistWishlist(updated);
    const msg = exists ? 'Removed from wishlist' : 'Added to wishlist';
    setActionMessage(msg);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('app:toast', {
          detail: { message: msg, variant: 'success' },
        }),
      );
    }
  };

  const handleAddToCart = async (productId, qty = 1) => {
    setActionMessage('');
    setActionError('');
    const token = getAuthToken();
    if (!token) {
      setActionError('Please login as customer or wholesaler to add items to cart');
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId, quantity: qty }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add item to cart');
      }
      const msg = 'Item added to cart';
      setActionMessage(msg);
      try {
        const countResponse = await fetch(`${API_BASE}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const countData = await countResponse.json();
        if (countResponse.ok) {
          const items = countData && Array.isArray(countData.items) ? countData.items : [];
          const count = items.length;
          const safeCount = Number.isNaN(count) || count < 0 ? 0 : count;
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('cartCount', String(safeCount));
          }
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('cart:update'));
          }
        }
      } catch (error) {
        console.error(error);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('app:toast', {
            detail: { message: msg, variant: 'success' },
          }),
        );
      }
    } catch (err) {
      setActionError(err.message || 'Something went wrong while adding to cart');
    }
  };

  const handleBuyNow = async (productId, qty = 1) => {
    setActionMessage('');
    setActionError('');
    const token = getAuthToken();
    if (!token) {
      setActionError('Please login as customer or wholesaler to buy products');
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId, quantity: qty }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add item for purchase');
      }
      const msg = 'Item added. Redirecting to checkout.';
      setActionMessage(msg);
      try {
        const countResponse = await fetch(`${API_BASE}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const countData = await countResponse.json();
        if (countResponse.ok) {
          const items = countData && Array.isArray(countData.items) ? countData.items : [];
          const count = items.length;
          const safeCount = Number.isNaN(count) || count < 0 ? 0 : count;
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('cartCount', String(safeCount));
          }
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('cart:update'));
          }
        }
      } catch (error) {
        console.error(error);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('app:toast', {
            detail: { message: msg, variant: 'success' },
          }),
        );
      }
      navigate('/checkout');
    } catch (err) {
      setActionError(err.message || 'Something went wrong while processing buy now');
    }
  };

  return (
    <div className="product-page">
      <section className="product-banner text-center text-white py-5">
        <Container>
          <h1 className="banner-title display-4 fw-bold mb-3">Product Details</h1>
          <nav className="breadcrumb-nav d-flex justify-content-center align-items-center gap-2">
            <span>Home</span>
            <span className="dot">•</span>
            <span>Product</span>
            <span className="dot">•</span>
            <span className="active">Details</span>
          </nav>
        </Container>
      </section>

      <section className="product-content py-5">
        <Container>
          {actionError && (
            <Alert variant="danger" className="mb-3">
              {actionError}
            </Alert>
          )}
          {actionMessage && (
            <Alert variant="success" className="mb-3">
              {actionMessage}
            </Alert>
          )}
          {loading && (
            <div className="text-center py-5">
              <span>Loading product...</span>
            </div>
          )}
          {!loading && error && (
            <div className="text-center py-5 text-danger">
              <span>{error}</span>
            </div>
          )}
          {!loading && !error && product && (
            <>
              <Row className="g-4 align-items-start">
                <Col md={5}>
                  <div className="product-detail-gallery d-flex">
                    <div className="product-detail-thumbs me-3">
                      {(product.images && product.images.length > 0
                        ? product.images
                        : [product.image]
                      ).map((url, index) => (
                        <button
                          type="button"
                          key={index}
                          className={`product-detail-thumb-btn${
                            index === activeImageIndex ? ' active' : ''
                          }`}
                          onClick={() => setActiveImageIndex(index)}
                        >
                          <img
                            src={url || FALLBACK_DETAIL_IMAGE}
                            alt={`${product.name} ${index + 1}`}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="product-detail-main-img-wrapper position-relative flex-grow-1">
                      {product.discount && (
                        <span className="discount-badge">
                          {product.discount}
                        </span>
                      )}
                      <div className="product-detail-main-img">
                        <img
                          src={
                            (product.images && product.images.length > 0
                              ? product.images[activeImageIndex]
                              : product.image) || FALLBACK_DETAIL_IMAGE
                          }
                          alt={product.name}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={7}>
                  <div className="product-info">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge-detail-status">
                        Featured
                      </span>
                      <div className="product-detail-rating d-flex align-items-center gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <Star
                            key={value}
                            size={16}
                            fill="#ffc107"
                            stroke="#ffc107"
                          />
                        ))}
                        <span className="small text-muted ms-1">
                          (0 Reviews)
                        </span>
                      </div>
                    </div>
                    <p className="product-category text-uppercase small fw-bold mb-2">
                      {product.category}
                    </p>
                    <h2 className="product-name fw-bold mb-3">{product.name}</h2>
                    <div className="product-price d-flex align-items-center gap-2 mb-3">
                      {product.oldPrice > 0 && (
                        <span className="old-price text-muted text-decoration-line-through">
                          ₹{product.oldPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="current-price fw-bold fs-4">
                        ₹{product.price.toFixed(2)}
                      </span>
                    </div>
                    {product.description && (
                      <p className="mb-4">
                        {product.description}
                      </p>
                    )}
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <span className="small fw-semibold text-muted">
                        Quantity
                      </span>
                      <div className="qty-control">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() =>
                            setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                          }
                        >
                          −
                        </button>
                        <span className="qty-value">{quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() =>
                            setQuantity((prev) => prev + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap gap-3">
                      <Button
                        variant="success"
                        onClick={() => handleAddToCart(product.id, quantity)}
                      >
                        <ShoppingBag size={18} className="me-2" />
                        Add To Cart
                      </Button>
                      <Button
                        variant="outline-success"
                        onClick={() => handleBuyNow(product.id, quantity)}
                      >
                        Buy Now
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleToggleWishlist(product.id)}
                      >
                        <Heart
                          size={18}
                          className="me-2"
                          color={
                            wishlistIds.includes(product.id) && getAuthToken()
                              ? '#ff4d4f'
                              : undefined
                          }
                          fill={
                            wishlistIds.includes(product.id) && getAuthToken()
                              ? '#ff4d4f'
                              : 'none'
                          }
                        />
                        Add to Wishlist
                      </Button>
                    </div>
                    <div className="product-detail-meta mt-4 small text-muted">
                      <div>
                        <span className="meta-label">SKU:</span>
                        <span className="meta-value">N/A</span>
                      </div>
                      <div>
                        <span className="meta-label">Categories:</span>
                        <span className="meta-value">{product.category}</span>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="mt-5">
                <Col lg={12}>
                  <div className="product-detail-tabs">
                    <div className="product-detail-tab-headers d-flex flex-wrap">
                      <button
                        type="button"
                        className={`product-detail-tab-btn${
                          activeTab === 'description' ? ' active' : ''
                        }`}
                        onClick={() => setActiveTab('description')}
                      >
                        Description
                      </button>
                      <button
                        type="button"
                        className={`product-detail-tab-btn${
                          activeTab === 'additional' ? ' active' : ''
                        }`}
                        onClick={() => setActiveTab('additional')}
                      >
                        Additional Information
                      </button>
                      <button
                        type="button"
                        className={`product-detail-tab-btn${
                          activeTab === 'reviews' ? ' active' : ''
                        }`}
                        onClick={() => setActiveTab('reviews')}
                      >
                        Reviews
                      </button>
                    </div>
                    <div className="product-detail-tab-body">
                      {activeTab === 'description' && (
                        <div className="product-detail-tab-pane">
                          <p>
                            {product.description ||
                              'No description available for this product.'}
                          </p>
                        </div>
                      )}
                      {activeTab === 'additional' && (
                        <div className="product-detail-tab-pane">
                          <ul className="list-unstyled mb-0">
                            <li>
                              <span className="meta-label">Category:</span>
                              <span className="meta-value">{product.category}</span>
                            </li>
                            <li>
                              <span className="meta-label">Price:</span>
                              <span className="meta-value">
                                ₹{product.price.toFixed(2)}
                              </span>
                            </li>
                          </ul>
                        </div>
                      )}
                      {activeTab === 'reviews' && (
                        <div className="product-detail-tab-pane">
                          <h5 className="mb-4">
                            03 reviews for "{product.name}"
                          </h5>
                          <div className="product-review-list mb-4">
                            {[1, 2, 3].map((value) => (
                              <div
                                key={value}
                                className="product-review-item d-flex gap-3 mb-3"
                              >
                                <div className="product-review-avatar">
                                  {product.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="product-review-content">
                                  <div className="d-flex justify-content-between mb-1">
                                    <strong>Sample Customer</strong>
                                    <div className="product-detail-rating d-flex align-items-center gap-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          size={14}
                                          fill="#ffc107"
                                          stroke="#ffc107"
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <div className="small text-muted mb-1">
                                    March 10, 2024
                                  </div>
                                  <p className="mb-0">
                                    This is a sample review block to showcase how
                                    customer feedback will appear on this page.
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="product-review-form">
                            <h5 className="mb-3">Add a review</h5>
                            <form
                              onSubmit={(event) => {
                                event.preventDefault();
                                setActionMessage('Review submitted');
                              }}
                            >
                              <div className="mb-3">
                                <label className="form-label small">
                                  Your review
                                </label>
                                <textarea
                                  className="form-control"
                                  rows={4}
                                  required
                                />
                              </div>
                              <Row className="g-3">
                                <Col md={6}>
                                  <label className="form-label small">
                                    Your name
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    required
                                  />
                                </Col>
                                <Col md={6}>
                                  <label className="form-label small">
                                    Your email
                                  </label>
                                  <input
                                    type="email"
                                    className="form-control"
                                    required
                                  />
                                </Col>
                              </Row>
                              <div className="form-check mt-3 mb-3">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="review-save-info"
                                />
                                <label
                                  className="form-check-label small"
                                  htmlFor="review-save-info"
                                >
                                  Save my name and email in this browser for
                                  the next time I comment.
                                </label>
                              </div>
                              <Button type="submit" variant="success">
                                Submit Now
                              </Button>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </>
          )}

          {!loading && !error && (
            <div className="mt-5">
              <h3 className="mb-4 text-center">Related Products</h3>
              {relatedLoading && (
                <div className="text-center py-3">
                  <span>Loading related products...</span>
                </div>
              )}
              {!relatedLoading && relatedError && (
                <div className="text-center py-3 text-danger">
                  <span>{relatedError}</span>
                </div>
              )}
              {!relatedLoading && !relatedError && relatedProducts.length > 0 && (
                <Row className="g-4">
                  {relatedProducts.map((item) => (
                    <Col key={item.id} lg={3} md={6}>
                      <Link
                        to={`/product/${item.id}`}
                        className="text-decoration-none text-dark"
                      >
                        <div className="product-card text-center h-100">
                          <div className="product-img-wrapper position-relative mb-1">
                            {item.discount && (
                              <span className="discount-badge">{item.discount}</span>
                            )}
                            <img src={item.image} alt={item.name} className="img-fluid product-img" />
                            <div className="product-actions d-flex justify-content-center gap-2">
                              <div className="action-btn cart-btn">
                                <ShoppingBag size={20} />
                              </div>
                              <div className="action-btn view-btn">
                                <Eye size={20} />
                              </div>
                              <div className="action-btn wishlist-btn">
                                <Heart size={20} />
                              </div>
                            </div>
                          </div>
                          <div className="product-info border-top pt-4">
                            <p className="product-category text-uppercase small fw-bold mb-2">
                              {item.category}
                            </p>
                            <h5 className="product-name fw-bold mb-3">
                              {item.name}
                            </h5>
                            <div className="product-price d-flex justify-content-center gap-2">
                              {item.oldPrice > 0 && (
                                <span className="old-price text-muted text-decoration-line-through">
                                  ₹{item.oldPrice.toFixed(2)}
                                </span>
                              )}
                              <span className="current-price fw-bold">
                                ₹{item.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Col>
                  ))}
                </Row>
              )}
              {!relatedLoading && !relatedError && relatedProducts.length === 0 && (
                <div className="text-center py-3 text-muted">
                  <span>No related products found.</span>
                </div>
              )}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
};

export default ProductDetails;
