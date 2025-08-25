import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5117/api/orders/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setError('No orders found');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Filter and sort orders
  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'date-asc') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === 'total-desc') {
      return b.totalAmount - a.totalAmount;
    } else {
      return a.totalAmount - b.totalAmount;
    }
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="order-history-container">
        <div className="loading">
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-retry">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <div className="order-history-header">
        <h1>Order History</h1>
        <p>View and manage your past orders</p>
      </div>

      {orders.length > 0 ? (
        <>
          <div className="order-history-controls">
            <div className="filter-controls">
              <label htmlFor="status-filter">Filter by Status:</label>
              <select 
                id="status-filter" 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="succeeded">Succeeded</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="sort-controls">
              <label htmlFor="sort-by">Sort by:</label>
              <select 
                id="sort-by" 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="total-desc">Total (High to Low)</option>
                <option value="total-asc">Total (Low to High)</option>
              </select>
            </div>
          </div>

          <div className="orders-list">
            {sortedOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-summary">
                  <div className="order-meta">
                    <h3>Order #{order.orderNumber}</h3>
                    <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                    <p className={`order-status status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </p>
                  </div>
                  
                  <div className="order-totals">
                    <p className="order-items">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    <p className="order-total">Total: ${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="order-details">
                  <div className="order-items-list">
                    <h4>Items Ordered</h4>
                    <div className="items-grid">
                      {order.items.map(item => (
                        <div key={item.id} className="order-item">
                          <div className="item-image-container">
                            <img 
                              src={item.imageUrl} 
                              alt={item.productName} 
                              className="item-image" 
                              onError={(e) => {
                                e.target.src = '/images/products/default.jpg';
                              }}
                            />
                          </div>
                          <div className="item-details">
                            <Link to={`/product/${item.productId}`} className="item-name">
                              {item.productName}
                            </Link>
                            <p className="item-quantity">Qty: {item.quantity}</p>
                            <p className="item-price">${item.unitPrice.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-shipping-payment">
                    <div className="shipping-info">
                      <h4>Transaction Details</h4>
                      <p>Transaction ID: {order.transactionId}</p>
                      <p>Payment Status: {order.paymentStatus}</p>
                    </div>

                    <div className="payment-info">
                      <h4>Order Summary</h4>
                      <p>Subtotal: ${order.totalAmount.toFixed(2)}</p>
                      <p>Tax: ${order.taxAmount.toFixed(2)}</p>
                      <p>Shipping: ${order.shippingCost.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="order-actions">
                  <Link to={`/orders/${order.id}`} className="btn btn-view">
                    View Order Details
                  </Link>
                  {order.status === 'Succeeded' && (
                    <button className="btn btn-return">
                      Initiate Return
                    </button>
                  )}
                  <button className="btn btn-reorder">
                    Reorder Items
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn btn-shop">
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;