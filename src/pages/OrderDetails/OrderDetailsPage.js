import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Table, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import './OrderDetailsPage.css';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5117/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'succeeded': return 'success';
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="order-details-container">
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="mb-3" />
          <p>Loading order details...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="order-details-container">
        <Alert variant="danger" className="my-4">
          <Alert.Heading>Error Loading Order</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-center mt-3">
            <Button as={Link} to="/orders" variant="primary">
              Back to Order History
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="order-details-container">
        <Alert variant="warning" className="my-4">
          <Alert.Heading>Order Not Found</Alert.Heading>
          <p>The requested order could not be found.</p>
          <div className="d-flex justify-content-center mt-3">
            <Button as={Link} to="/orders" variant="primary">
              Back to Order History
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="order-details-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Order Details</h1>
        <Button as={Link} to="/orders" variant="outline-primary">
          Back to Orders
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Header>
          <Row>
            <Col md={6}>
              <h5 className="mb-0">Order #{order.orderNumber}</h5>
              <small className="text-muted">Placed on {formatDate(order.createdAt)}</small>
            </Col>
            <Col md={6} className="text-md-end">
              <Badge bg={getStatusVariant(order.status)} className="p-2">
                {order.status}
              </Badge>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h6>Order Information</h6>
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Transaction ID:</strong> {order.transactionId}</p>
              <p><strong>Payment Status:</strong> <Badge bg={getStatusVariant(order.paymentStatus)}>{order.paymentStatus}</Badge></p>
            </Col>
            <Col md={6}>
              <h6>Payment Details</h6>
              <p><strong>Subtotal:</strong> ${order.totalAmount.toFixed(2)}</p>
              <p><strong>Tax:</strong> ${order.taxAmount.toFixed(2)}</p>
              <p><strong>Shipping:</strong> ${order.shippingCost.toFixed(2)}</p>
              <p><strong>Total Amount:</strong> ${(order.totalAmount + order.taxAmount + order.shippingCost).toFixed(2)}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Order Items</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive striped className="mb-0">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.imageUrl} 
                            alt={item.productName}
                            className="order-item-image"
                            onError={(e) => {
                              e.target.src = '/images/products/default.jpg';
                            }}
                          />
                          <div className="ms-3">
                            <div className="fw-bold">{item.productName}</div>
                            <small className="text-muted">SKU: {item.productId}</small>
                          </div>
                        </div>
                      </td>
                      <td>${item.unitPrice.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.unitPrice * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Shipping Information</h5>
            </Card.Header>
            <Card.Body>
              {order.shippingAddress ? (
                <>
                  <p><strong>{order.shippingAddress.fullName}</strong></p>
                  <p>
                    {order.shippingAddress.addressLine1}<br />
                    {order.shippingAddress.addressLine2 && (
                      <>{order.shippingAddress.addressLine2}<br /></>
                    )}
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}
                  </p>
                </>
              ) : (
                <p className="text-muted">No shipping information available</p>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Order Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary">
                  Download Invoice
                </Button>
                {order.status === 'Succeeded' && (
                  <Button variant="outline-warning">
                    Initiate Return
                  </Button>
                )}
                <Button variant="outline-success">
                  Reorder Items
                </Button>
                <Button variant="outline-danger">
                  Contact Support
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetailsPage;