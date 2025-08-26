// src/components/ProfilePage/ProfilePage.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserProfile, fetchUserOrders } from '../../store/profileSlice';


const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, orders, loading, error } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Account</h1>
        <p>Welcome back, {user?.firstName} {user?.lastName}</p>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="account-info">
            <h3>Account Details</h3>
            <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Phone:</strong> {profile?.phoneNumber || 'Not provided'}</p>
            <p><strong>Member since:</strong> {profile ? formatDate(profile.createdAt) : 'N/A'}</p>
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
            {orders && orders.length > 0 ? (
              <div className="orders-list">
                {orders.slice(0, 3).map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <strong>Order #:</strong> {order.orderNumber}
                      </div>
                      <div>
                        <strong>Date:</strong> {formatDate(order.createdAt)}
                      </div>
                      <div>
                        <strong>Status:</strong> <span className={`status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                      <div>
                        <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="order-items">
                      <h4>Items:</h4>
                      <ul>
                        {order.items && order.items.map((item, index) => (
                          <li key={index}>
                            {item.productName} (Qty: {item.quantity}) - ${item.unitPrice.toFixed(2)}
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
                <p>Update your payment methods</p>
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
                <h3>Preferences</h3>
                <p>Customize your preferences</p>
                <Link to="/preferences" className="btn btn-tool">
                  Manage
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