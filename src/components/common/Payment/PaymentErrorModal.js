import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const PaymentErrorModal = ({ show, error, onClose }) => {
  return (
    <Modal show={show} centered onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Payment Failed</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="payment-error-modal">
          <div className="error-icon">⚠️</div>
          <p>{error || 'An unexpected error occurred during payment processing.'}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          Try Again
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentErrorModal;