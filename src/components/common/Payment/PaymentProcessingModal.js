import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const PaymentProcessingModal = ({ show }) => {
  return (
    <Modal show={show} centered backdrop="static" keyboard={false}>
      <Modal.Body className="text-center">
        <div className="payment-processing">
          <Spinner animation="border" role="status" variant="primary" />
          <h4 className="mt-3">Processing Payment</h4>
          <p>Please wait while we process your payment...</p>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PaymentProcessingModal;