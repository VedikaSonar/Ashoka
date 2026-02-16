import React, { useState } from 'react';
import { Container, Row, Col, Form, Pagination } from 'react-bootstrap';
import { LayoutGrid, List, Filter, ShoppingBag, Eye, Heart, ChevronRight } from 'lucide-react';
import './Product.css';

const Product = () => {
  const [viewMode, setViewMode] = useState('grid');

  const products = [
    {
      id: 1,
      name: "Organic Avocado",
      category: "ACCESSORIES",
      price: 12.00,
      oldPrice: 15.00,
      discount: "10% Off",
      image: "https://img.freepik.com/free-photo/fresh-avocado-isolated-white_144627-28156.jpg"
    },
    {
      id: 2,
      name: "Fresh Orange",
      category: "PHARMA PRODUCT",
      price: 34.00,
      oldPrice: 20.00,
      discount: "10% Off",
      image: "https://img.freepik.com/free-photo/ripe-orange-isolated-white-background_144627-16474.jpg"
    },
    {
      id: 3,
      name: "Curaskin Lipgel",
      category: "SKIN PRODUCT",
      price: 8.50,
      oldPrice: 12.00,
      discount: "10% Off",
      image: "https://img.freepik.com/free-photo/fresh-lime-isolated-white-background_144627-16474.jpg"
    },
    {
      id: 4,
      name: "Apricot Fruit",
      category: "ACCESSORIES",
      price: 66.00,
      oldPrice: 80.00,
      discount: "10% Off",
      image: "https://img.freepik.com/free-photo/broccoli-isolated-white-background_144627-16474.jpg"
    },
    {
      id: 5,
      name: "Organic Avocado",
      category: "ACCESSORIES",
      price: 12.00,
      oldPrice: 15.00,
      discount: "10% Off",
      image: "https://img.freepik.com/free-photo/oranges-isolated-white-background_144627-16474.jpg"
    },
    {
      id: 6,
      name: "Fresh Orange",
      category: "PHARMA PRODUCT",
      price: 34.00,
      oldPrice: 20.00,
      discount: "10% Off",
      image: "https://img.freepik.com/free-photo/apricot-isolated-white-background_144627-16474.jpg"
    },
    {
      id: 7,
      name: "Curaskin Lipgel",
      category: "SKIN PRODUCT",
      price: 8.50,
      oldPrice: 12.00,
      discount: "10% Off",
      image: "https://img.freepik.com/free-photo/grocery-bag-full-vegetables_144627-16474.jpg"
    },
    {
      id: 8,
      name: "Apricot Fruit",
      category: "ACCESSORIES",
      price: 66.00,
      oldPrice: 80.00,
      discount: "10% Off",
      image: "https://img.freepik.com/free-photo/red-apple-isolated-white-background_144627-16474.jpg"
    }
  ];

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
              <span className="fw-bold">20 Item On List</span>
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
            {products.map((product) => (
              <Col key={product.id} lg={3} md={6}>
                <div className="product-card text-center h-100">
                  <div className="product-img-wrapper position-relative mb-4">
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
                      <span className="old-price text-muted text-decoration-line-through">${product.oldPrice.toFixed(2)}</span>
                      <span className="current-price fw-bold">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <div className="pagination-wrapper d-flex justify-content-center mt-5">
            <Pagination>
              <Pagination.Item active>{1}</Pagination.Item>
              <Pagination.Item>{2}</Pagination.Item>
              <Pagination.Item>{3}</Pagination.Item>
              <Pagination.Next />
            </Pagination>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Product;
