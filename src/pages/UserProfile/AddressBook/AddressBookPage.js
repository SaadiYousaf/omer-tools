// src/pages/AddressBookPage.js
import React, { useState, useEffect } from 'react';
import { userService } from '../../../services';
import AddressForm from '../../../components/common/AddressForm/AddressForm';
import './AddressBookPage.css';

const AddressBookPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const addressesData = await userService.getAddresses();
      setAddresses(addressesData);
    } catch (err) {
      setError(err.message || 'Failed to fetch addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await userService.deleteAddress(id);
        setAddresses(addresses.filter(addr => addr.id !== id));
      } catch (err) {
        setError(err.message || 'Failed to delete address');
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await userService.setDefaultAddress(id);
      // Update local state to reflect the change
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }));
      setAddresses(updatedAddresses);
    } catch (err) {
      setError(err.message || 'Failed to set default address');
    }
  };

  const handleFormSubmit = async (addressData) => {
    try {
      if (editingAddress) {
        // Update existing address
        const updatedAddress = await userService.updateAddress(editingAddress.id, addressData);
        setAddresses(addresses.map(addr => 
          addr.id === editingAddress.id ? updatedAddress : addr
        ));
      } else {
        // Add new address
        const newAddress = await userService.createAddress(addressData);
        setAddresses([...addresses, newAddress]);
      }
      setShowForm(false);
      setEditingAddress(null);
    } catch (err) {
      setError(err.message || 'Failed to save address');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  if (loading) return <div className="loading">Loading addresses...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="address-book-container">
      <div className="page-header">
        <h1>Address Book</h1>
        <p>Manage your shipping addresses</p>
      </div>

      {showForm ? (
        <AddressForm
          address={editingAddress}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <>
          <button className="btn btn-primary add-address-btn" onClick={handleAddAddress}>
            Add New Address
          </button>

          {addresses.length === 0 ? (
            <div className="empty-state">
              <h2>No addresses saved</h2>
              <p>Add your first address to get started.</p>
            </div>
          ) : (
            <div className="addresses-grid">
              {addresses.map(address => (
                <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                  {address.isDefault && (
                    <div className="default-badge">Default</div>
                  )}
                  
                  <div className="address-details">
                    <h3>{address.fullName}</h3>
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>{address.city}, {address.state} {address.postalCode}</p>
                    <p>{address.country}</p>
                    {address.phoneNumber && <p>Phone: {address.phoneNumber}</p>}
                  </div>

                  <div className="address-actions">
                    <button 
                      className="btn btn-text"
                      onClick={() => handleEditAddress(address)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-text"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      Delete
                    </button>
                    {!address.isDefault && (
                      <button 
                        className="btn btn-text"
                        onClick={() => handleSetDefault(address.id)}
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

export default AddressBookPage;