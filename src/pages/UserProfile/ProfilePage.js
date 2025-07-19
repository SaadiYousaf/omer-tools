import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  // Mock order history data
  const orders = [
    {
      id: 'ORD-12345',
      date: '2023-06-15',
      status: 'Delivered',
      total: 249.99,
      items: [
        { name: 'Power Drill X200', quantity: 1, price: 199.99 },
        { name: 'Drill Bit Set', quantity: 1, price: 49.99 }
      ]
    },
    {
      id: 'ORD-12344',
      date: '2023-05-28',
      status: 'Delivered',
      total: 89.97,
      items: [
        { name: 'Safety Gloves', quantity: 2, price: 14.99 },
        { name: 'Safety Glasses', quantity: 1, price: 19.99 },
        { name: 'Toolbox', quantity: 1, price: 39.99 }
      ]
    }
  ];

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Account</h1>
        <p>Welcome back, {user?.name}</p>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="account-info">
            <h3>Account Details</h3>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Member since:</strong> January 2023</p>
          </div>

          <nav className="account-nav">
            <Link to="/profile" className="active">Dashboard</Link>
            <Link to="/orders">Order History</Link>
            <Link to="/addresses">Address Book</Link>
            <Link to="/payment-methods">Payment Methods</Link>
            <Link to="/account-settings">Account Settings</Link>
          </nav>
        </div>

        <div className="profile-main">
          <section className="recent-orders">
            <h2>Recent Orders</h2>
            {orders.length > 0 ? (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <strong>Order #:</strong> {order.id}
                      </div>
                      <div>
                        <strong>Date:</strong> {order.date}
                      </div>
                      <div>
                        <strong>Status:</strong> <span className={`status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                      <div>
                        <strong>Total:</strong> ${order.total.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="order-items">
                      <h4>Items:</h4>
                      <ul>
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.name} (Qty: {item.quantity}) - ${item.price.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="order-actions">
                      <Link to={`/orders/${order.id}`} className="btn btn-view">
                        View Order
                      </Link>
                      <button className="btn btn-reorder">
                        Reorder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>You haven't placed any orders yet.</p>
            )}
            
            <Link to="/orders" className="btn btn-view-all">
              View All Orders
            </Link>
          </section>

          <section className="account-tools">
            <h2>Account Tools</h2>
            <div className="tools-grid">
              <div className="tool-card">
                <h3>Address Book</h3>
                <p>Manage your shipping addresses</p>
                <Link to="/addresses" className="btn btn-tool">
                  Manage
                </Link>
              </div>
              
              <div className="tool-card">
                <h3>Payment Methods</h3>
                <p>Update your credit cards</p>
                <Link to="/payment-methods" className="btn btn-tool">
                  Manage
                </Link>
              </div>
              
              <div className="tool-card">
                <h3>Account Settings</h3>
                <p>Change password or email</p>
                <Link to="/account-settings" className="btn btn-tool">
                  Manage
                </Link>
              </div>
              
              <div className="tool-card">
                <h3>Wishlist</h3>
                <p>View your saved items</p>
                <Link to="/wishlist" className="btn btn-tool">
                  View
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;