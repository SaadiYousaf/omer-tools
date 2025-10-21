import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const PaymentSuccessModal = ({ show, orderDetails, onClose }) => {
  return (
    <Modal show={show} centered onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Payment Successful</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="payment-success-modal">
          <div className="success-icon">✅</div>
          <h5>Thank you for your purchase!</h5>
          <p>Your order has been successfully processed.</p>
          {orderDetails && (
            <div className="order-details">
              <p><strong>Order Number:</strong> {orderDetails.orderNumber}</p>
              <p><strong>Transaction ID:</strong> {orderDetails.transactionId}</p>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          View Order Details
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentSuccessModal;