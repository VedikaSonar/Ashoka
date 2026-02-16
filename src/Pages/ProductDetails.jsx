import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Carousel, Alert } from 'react-bootstrap';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
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

const mapApiProductToView = (product) => {
  const images = product.images || [];
  const baseUrl = API_BASE.replace('/api', '');
  const orderedImages = [...images].sort((a, b) => {
    const aOrder = typeof a.sort_order === 'number' ? a.sort_order : 0;
    const bOrder = typeof b.sort_order === 'number' ? b.sort_order : 0;
    return aOrder - bOrder;
  });
  const primaryImage = orderedImages.find((img) => img.is_primary) || orderedImages[0];
  const primaryImageUrl = primaryImage ? `${baseUrl}/${primaryImage.image_url}` : FALLBACK_DETAIL_IMAGE;
  const allImageUrls = orderedImages.map((img) => `${baseUrl}/${img.image_url}`);
  const categoryName = product.category && product.category.name ? product.category.name : 'CATEGORY';
  const price = product.customer_price ? Number(product.customer_price) : 0;
  const oldPrice = price > 0 ? price * 1.1 : 0;
  const discount = oldPrice > price && oldPrice > 0 ? `${Math.round(((oldPrice - price) / oldPrice) * 100)}% Off` : '';

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
  };

  const handleToggleWishlist = (productId) => {
    setActionMessage('');
    setActionError('');
    const exists = wishlistIds.includes(productId);
    const updated = exists
      ? wishlistIds.filter((pid) => pid !== productId)
      : [...wishlistIds, productId];
    persistWishlist(updated);
    setActionMessage(exists ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleAddToCart = async (productId) => {
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
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add item to cart');
      }
      setActionMessage('Item added to cart');
    } catch (err) {
      setActionError(err.message || 'Something went wrong while adding to cart');
    }
  };

  const handleBuyNow = async (productId) => {
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
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add item for purchase');
      }
      setActionMessage('Item added. You can proceed to checkout from your cart.');
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
            <Row className="g-4">
              <Col md={5}>
                <div className="product-card text-center h-100">
                  <Carousel
                    indicators={
                      product.images && product.images.length > 1
                    }
                    controls={
                      product.images && product.images.length > 1
                    }
                  >
                    {(product.images && product.images.length > 0
                      ? product.images
                      : [product.image]
                    ).map((url, index) => (
                      <Carousel.Item key={index}>
                        <div className="product-detail-img-wrapper position-relative mb-1">
                          {index === 0 && product.discount && (
                            <span className="discount-badge">
                              {product.discount}
                            </span>
                          )}
                          <img
                            src={url}
                            alt={product.name}
                            className="img-fluid product-img"
                          />
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </div>
              </Col>
              <Col md={7}>
                <div className="product-info">
                  <p className="product-category text-uppercase small fw-bold mb-2">
                    {product.category}
                  </p>
                  <h2 className="product-name fw-bold mb-3">{product.name}</h2>
                  <div className="product-price d-flex align-items-center gap-2 mb-3">
                    {product.oldPrice > 0 && (
                      <span className="old-price text-muted text-decoration-line-through">
                        ${product.oldPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="current-price fw-bold fs-4">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  {product.description && (
                    <p className="mb-4">
                      {product.description}
                    </p>
                  )}
                  <div className="d-flex flex-wrap gap-3">
                    <Button
                      variant="success"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      <ShoppingBag size={18} className="me-2" />
                      Add To Cart
                    </Button>
                    <Button
                      variant="outline-success"
                      onClick={() => handleBuyNow(product.id)}
                    >
                      Buy Now
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleToggleWishlist(product.id)}
                    >
                      <Heart size={18} className="me-2" />
                      Add to Wishlist
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
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
                                  ${item.oldPrice.toFixed(2)}
                                </span>
                              )}
                              <span className="current-price fw-bold">
                                ${item.price.toFixed(2)}
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
