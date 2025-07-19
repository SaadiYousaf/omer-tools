import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './OrderHistoryPage.css';
import brand1 from '../../components/common/BrandSlider/brands/brand1.PNG'

const OrderHistoryPage = () => {
  const { user } = useSelector((state) => state.auth);
  
  // Correct mock order data
  const allOrders = [
    {
      id: 'ORD-12345',
      date: '2023-06-15',
      status: 'Delivered',
      total: 249.99,
      itemCount: 2,
      trackingNumber: 'TRK123456789',
      shippingAddress: {
        name: `${user?.name}`,
        street: '123 Tool Street',
        city: 'Melbourne',
        state: 'VIC',
        postcode: '3000',
        country: 'Australia'
      },
      paymentMethod: 'Credit Card (VISA ****4242)',
      items: [
        { 
          id: 'PROD-001',
          name: 'Power Drill X200', 
          quantity: 1, 
          price: 199.99,
          image: brand1
        },
        { 
          id: 'PROD-002',
          name: 'Drill Bit Set', 
          quantity: 1, 
          price: 49.99,
          image: brand1
        }
      ]
    },
    {
      id: 'ORD-12344',
      date: '2023-05-28',
      status: 'Delivered',
      total: 89.97,
      itemCount: 3,
      trackingNumber: 'TRK987654321',
      shippingAddress: {
        name: `${user?.name}`,
        street: '123 Tool Street',
        city: 'Melbourne',
        state: 'VIC',
        postcode: '3000',
        country: 'Australia'
      },
      paymentMethod: 'PayPal',
      items: [
        { 
          id: 'PROD-003',
          name: 'Safety Gloves', 
          quantity: 2, 
          price: 14.99,
          image: brand1
        },
        { 
          id: 'PROD-004',
          name: 'Safety Glasses', 
          quantity: 1, 
          price: 19.99,
          image: brand1
        },
        { 
          id: 'PROD-005',
          name: 'Toolbox', 
          quantity: 1, 
          price: 39.99,
          image: brand1
        }
      ]
    }
  ];

  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Filter and sort orders
  const filteredOrders = allOrders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'date-asc') {
      return new Date(a.date) - new Date(b.date);
    } else if (sortBy === 'total-desc') {
      return b.total - a.total;
    } else {
      return a.total - b.total;
    }
  });

  return (
    <div className="order-history-container">
      <div className="order-history-header">
        <h1>Order History</h1>
        <p>View and manage your past orders</p>
      </div>

      <div className="order-history-controls">
        <div className="filter-controls">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select 
            id="status-filter" 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="delivered">Delivered</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
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

      {sortedOrders.length > 0 ? (
        <div className="orders-list">
          {sortedOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-summary">
                <div className="order-meta">
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">Placed on {new Date(order.date).toLocaleDateString()}</p>
                  <p className={`order-status status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </p>
                </div>
                
                <div className="order-totals">
                  <p className="order-items">{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</p>
                  <p className="order-total">Total: ${order.total.toFixed(2)}</p>
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
                            src={item.image} 
                            alt={item.name} 
                            className="item-image" 
                            onError={(e) => {
                              e.target.src = '/images/products/default.jpg';
                            }}
                          />
                        </div>
                        <div className="item-details">
                          <Link to={`/product/${item.id}`} className="item-name">
                            {item.name}
                          </Link>
                          <p className="item-quantity">Qty: {item.quantity}</p>
                          <p className="item-price">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-shipping-payment">
                  <div className="shipping-info">
                    <h4>Shipping Address</h4>
                    <p>{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postcode}</p>
                    <p>{order.shippingAddress.country}</p>
                    {order.trackingNumber && (
                      <p className="tracking-number">
                        Tracking #: {order.trackingNumber}
                      </p>
                    )}
                  </div>

                  <div className="payment-info">
                    <h4>Payment Method</h4>
                    <p>{order.paymentMethod}</p>
                  </div>
                </div>
              </div>

              <div className="order-actions">
                <Link to={`/orders/${order.id}`} className="btn btn-view">
                  View Order Details
                </Link>
                {order.status === 'Delivered' && (
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
      ) : (
        <div className="no-orders">
          <p>No orders found matching your criteria.</p>
          <Link to="/shop" className="btn btn-shop">
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;