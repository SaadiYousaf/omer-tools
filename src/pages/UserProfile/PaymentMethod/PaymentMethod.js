// src/pages/PaymentMethodsPage.js
import React, { useState, useEffect } from 'react';
import { userService } from '../../../services';
import PaymentMethodForm from '../../../components/common/PaymentMethodForm/PaymentMethodForm';
import Loading from '../../../components/common/Loading/Loading';
import './PaymentMethod.css';

const PaymentMethodsPage = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const methodsData = await userService.getPaymentMethods();
      setPaymentMethods(methodsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMethod = () => {
    setEditingMethod(null);
    setShowForm(true);
  };

  const handleEditMethod = (method) => {
    setEditingMethod(method);
    setShowForm(true);
  };

  const handleDeleteMethod = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        await userService.deletePaymentMethod(id);
        setPaymentMethods(paymentMethods.filter(method => method.id !== id));
      } catch (err) {
        setError(err.message || 'Failed to delete payment method');
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await userService.setDefaultPaymentMethod(id);
      // Update local state to reflect the change
      const updatedMethods = paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      }));
      setPaymentMethods(updatedMethods);
    } catch (err) {
      setError(err.message || 'Failed to set default payment method');
    }
  };

  const handleFormSubmit = async (methodData) => {
    try {
      if (editingMethod) {
        // Update existing method
        const updatedMethod = await userService.updatePaymentMethod(editingMethod.id, methodData);
        setPaymentMethods(paymentMethods.map(method => 
          method.id === editingMethod.id ? updatedMethod : method
        ));
      } else {
        // Add new method
        const newMethod = await userService.createPaymentMethod(methodData);
        setPaymentMethods([...paymentMethods, newMethod]);
      }
      setShowForm(false);
      setEditingMethod(null);
    } catch (err) {
      setError(err.message || 'Failed to save payment method');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingMethod(null);
  };

  if (loading) return  <Loading size="medium" variant="spinner" color="primary" />;;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="payment-methods-container">
      <div className="page-header">
        <h1>Payment Methods</h1>
        <p>Manage your payment methods</p>
      </div>

      {showForm ? (
        <PaymentMethodForm
          method={editingMethod}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <>
          <button className="add-to-cart-btn add-method-btn" onClick={handleAddMethod}>
            Add New Payment Method
          </button>

          {paymentMethods.length === 0 ? (
            <div className="empty-state">
              <h2>No payment methods saved</h2>
              <p>Add your first payment method to get started.</p>
            </div>
          ) : (
            <div className="payment-methods-grid">
              {paymentMethods.map(method => (
                <div key={method.id} className={`payment-method-card ${method.isDefault ? 'default' : ''}`}>
                  {method.isDefault && (
                    <div className="default-badge">Default</div>
                  )}
                  
                  <div className="method-details">
                    <h3>{method.provider} •••• {method.last4Digits}</h3>
                    <p>Expires: {method.expiryMonth}/{method.expiryYear}</p>
                    <p>Type: {method.paymentType}</p>
                  </div>

                  <div className="method-actions">
                    <button 
                      className="btn btn-text"
                      onClick={() => handleEditMethod(method)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-text"
                      onClick={() => handleDeleteMethod(method.id)}
                    >
                      Delete
                    </button>
                    {!method.isDefault && (
                      <button 
                        className="btn btn-text"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentMethodsPage;