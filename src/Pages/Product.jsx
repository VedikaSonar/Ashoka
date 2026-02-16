import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LayoutGrid, List, Filter, ShoppingBag, Eye, Heart, ChevronRight } from 'lucide-react';
import './Product.css';

const API_BASE = 'http://127.0.0.1:5000/api';
const FALLBACK_LIST_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="100%" height="100%" fill="%23f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="20">No Image</text></svg>';

const mapApiProductToView = (product) => {
  const images = product.images || [];
  const primaryImage = images.find((img) => img.is_primary) || images[0];
  const imageUrl = primaryImage ? `${API_BASE.replace('/api', '')}/${primaryImage.image_url}` : FALLBACK_LIST_IMAGE;
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
    image: imageUrl,
  };
};

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE}/products?limit=20&page=1`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to load products');
        }
        const list = Array.isArray(data.products) ? data.products : [];
        const mapped = list.map(mapApiProductToView);
        setProducts(mapped);
      } catch (err) {
        setError(err.message || 'Something went wrong while loading products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-page">
      {/* Banner Section */}
      <section className="product-banner text-center text-white py-5">
        <Container>
          <h1 className="banner-title display-4 fw-bold mb-3">Product</h1>
          <nav className="breadcrumb-nav d-flex justify-content-center align-items-center gap-2">
            <span>Home</span>
            <span className="dot">•</span>
            <span className="active">Product</span>
          </nav>
        </Container>
      </section>

      {/* Main Content Section */}
      <section className="product-content py-5">
        <Container>
          {/* Toolbar */}
          <div className="toolbar d-flex flex-wrap justify-content-between align-items-center mb-5 pb-3 border-bottom">
            <div className="item-count mb-3 mb-md-0">
              <span className="fw-bold">
                {products.length > 0 ? `${products.length} Item On List` : 'No items found'}
              </span>
            </div>
            
            <div className="toolbar-actions d-flex flex-wrap align-items-center gap-4">
              
              <div className="sort-select border-start ps-4">
                <Form.Select className="border-0 shadow-none bg-transparent py-0 small fw-bold">
                  <option>Show 20</option>
                  <option>Show 40</option>
                  <option>Show 60</option>
                </Form.Select>
              </div>

            </div>
          </div>

          {/* Product Grid */}
          <Row className="g-4 mb-5">
            {loading && products.length === 0 && (
              <Col>
                <div className="text-center py-5">
                  <span>Loading products...</span>
                </div>
              </Col>
            )}
            {!loading && error && products.length === 0 && (
              <Col>
                <div className="text-center py-5 text-danger">
                  <span>{error}</span>
                </div>
              </Col>
            )}
            {!loading && !error && products.map((product) => (
              <Col key={product.id} lg={3} md={6}>
                <Link
                  to={`/product/${product.id}`}
                  className="text-decoration-none text-dark"
                >
                  <div className="product-card text-center h-100">
                    <div className="product-img-wrapper position-relative mb-1">
                      {product.discount && (
                        <span className="discount-badge">{product.discount}</span>
                      )}
                      <img src={product.image} alt={product.name} className="img-fluid product-img" />
                      
                      {/* Hover Actions */}
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
                      <p className="product-category text-uppercase small fw-bold mb-2">{product.category}</p>
                      <h5 className="product-name fw-bold mb-3">{product.name}</h5>
                      <div className="product-price d-flex justify-content-center gap-2">
                        {product.oldPrice > 0 && (
                          <span className="old-price text-muted text-decoration-line-through">
                            ${product.oldPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="current-price fw-bold">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <div className="pagination-wrapper d-flex justify-content-center mt-5">
            <Pagination>
              <Pagination.Prev  />
              <Pagination.Item active>{1}</Pagination.Item>
              <Pagination.Item>{2}</Pagination.Item>
              <Pagination.Item>{3}</Pagination.Item>
              <Pagination.Next  />
            </Pagination>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Product;
