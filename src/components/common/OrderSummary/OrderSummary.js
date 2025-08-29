import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Container, Spinner, Alert, Button, Card, Row, Col } from 'react-bootstrap';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/orders/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    navigate(`/orders/${order.id}`);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="d-flex justify-content-center mt-5">
          <Spinner animation="border" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (selectedOrder) {
    return (
      <Container className="mt-4">
        <Button variant="secondary" onClick={handleBackToList} className="mb-3">
          Back to Order List
        </Button>
        
        <Card>
          <Card.Header>
            <h3>Order Details: #{selectedOrder.orderNumber}</h3>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5>Order Information</h5>
                <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                <p><strong>Transaction ID:</strong> {selectedOrder.transactionId}</p>
              </Col>
              <Col md={6}>
                <h5>Payment Details</h5>
                <p><strong>Subtotal:</strong> ${selectedOrder.totalAmount.toFixed(2)}</p>
                <p><strong>Tax:</strong> ${selectedOrder.taxAmount.toFixed(2)}</p>
                <p><strong>Shipping:</strong> ${selectedOrder.shippingCost.toFixed(2)}</p>
                <p><strong>Total:</strong> ${(selectedOrder.totalAmount + selectedOrder.taxAmount + selectedOrder.shippingCost).toFixed(2)}</p>
              </Col>
            </Row>
            
            <hr />
            
            <h5>Order Items</h5>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          src={item.imageUrl} 
                          alt={item.productName}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                          onError={(e) => {
                            e.target.src = '/images/products/default.jpg';
                          }}
                        />
                        <span>{item.productName}</span>
                      </div>
                    </td>
                    <td>{item.quantity}</td>
                    <td>${item.unitPrice.toFixed(2)}</td>
                    <td>${(item.unitPrice * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Your Order History</h2>
      {orders.length === 0 ? (
        <Alert variant="info">
          You haven't placed any orders yet.
          <div className="mt-2">
            <Button variant="primary" href="/shop">
              Start Shopping
            </Button>
          </div>
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <ul className="list-unstyled">
                    {order.items.map(item => (
                      <li key={item.id}>
                        {item.productName} (x{item.quantity})
                      </li>
                    ))}
                  </ul>
                </td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>
                  <span className={`badge bg-${
                    order.status === 'Succeeded' ? 'success' : 
                    order.status === 'Pending' ? 'warning' : 
                    order.status === 'Cancelled' ? 'danger' : 'secondary'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleViewDetails(order)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OrderHistory;