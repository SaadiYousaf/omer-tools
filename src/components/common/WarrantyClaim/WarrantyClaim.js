// WarrantyClaim.js - IMPROVED VERSION
import React, { useState } from 'react';
import './WarrantyClaim.css';

const API_BASE_URL = process.env.REACT_APP_BASE_URL || '';

const WarrantyClaim = () => {
  const [formData, setFormData] = useState({
    // Distribution Partner Information
    claimType: '', // 'warranty-inspection', 'service-repair', 'firstup-failure'
    proofOfPurchase: null,
    
    // End User Information
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    
    // Asset Information
    modelNumber: '',
    serialNumber: '',
    faultDescription: '',
    faultImages: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimId, setClaimId] = useState('');
  const [claimNumber, setClaimNumber] = useState('');
  const [apiError, setApiError] = useState('');
  
  // Handle text/select inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear API error when user types
    if (apiError) setApiError('');
  };
  
  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    if (name === 'proofOfPurchase') {
      if (files.length > 0) {
        // Validate file size (5MB max)
        const file = files[0];
        if (file.size > 5 * 1024 * 1024) {
          setErrors({
            ...errors,
            proofOfPurchase: 'File size must be less than 5MB'
          });
          return;
        }
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
          setErrors({
            ...errors,
            proofOfPurchase: 'File must be JPG, PNG, or PDF'
          });
          return;
        }
        
        setFormData({
          ...formData,
          [name]: file
        });
        
        // Clear any existing error
        if (errors.proofOfPurchase) {
          setErrors({
            ...errors,
            proofOfPurchase: ''
          });
        }
      }
    } else if (name === 'faultImages') {
      // Handle multiple images
      const imageFiles = Array.from(files);
      
      // Validate total images (max 5)
      const totalImages = formData.faultImages.length + imageFiles.length;
      if (totalImages > 5) {
        setErrors({
          ...errors,
          faultImages: 'Maximum 5 images allowed'
        });
        return;
      }
      
      // Validate each image
      const validImages = imageFiles.filter(file => {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        return validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024;
      });
      
      setFormData({
        ...formData,
        [name]: [...formData.faultImages, ...validImages].slice(0, 5)
      });
      
      // Clear any existing error
      if (errors.faultImages) {
        setErrors({
          ...errors,
          faultImages: ''
        });
      }
    }
  };
  
  // Handle checkbox/radio changes
  const handleClaimTypeChange = (type) => {
    setFormData({
      ...formData,
      claimType: type
    });
    
    // Clear related errors
    if (errors.claimType) {
      setErrors({
        ...errors,
        claimType: ''
      });
    }
  };
  
  // Remove an uploaded image
  const removeImage = (index) => {
    const updatedImages = formData.faultImages.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      faultImages: updatedImages
    });
  };
  
  // Remove proof of purchase
  const removeProofOfPurchase = () => {
    setFormData({
      ...formData,
      proofOfPurchase: null
    });
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Claim Type Validation
    if (!formData.claimType) {
      newErrors.claimType = 'Please select a claim type';
    }
    
    // Proof of Purchase Validation (not required for service-repair)
    if (formData.claimType !== 'service-repair' && !formData.proofOfPurchase) {
      newErrors.proofOfPurchase = 'Proof of purchase is required for this claim type';
    }
    
    // End User Validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    // Address required for home delivery
    // if ((formData.claimType === 'warranty-inspection' || formData.claimType === 'firstup-failure') && !formData.address.trim()) {
    //   newErrors.address = 'Address is required for home delivery claims';
    // }
    
    // Asset Information Validation
    if (!formData.modelNumber.trim()) newErrors.modelNumber = 'Model number is required';
    if (!formData.faultDescription.trim()) newErrors.faultDescription = 'Description of fault is required';
    if (formData.faultDescription.length > 1000) newErrors.faultDescription = 'Description cannot exceed 1000 characters';
    
    // File validation
    if (formData.proofOfPurchase && formData.proofOfPurchase.size > 5 * 1024 * 1024) {
      newErrors.proofOfPurchase = 'Proof of purchase must be less than 5MB';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Upload proof of purchase
  const uploadProofOfPurchase = async (claimId, file) => {
    if (!file) return { success: true, message: 'No file to upload' };
    
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    
    try {
      const response = await fetch(`${API_BASE_URL}/warrantyclaims/${claimId}/upload-proof`, {
        method: 'POST',
        body: uploadFormData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return { 
          success: false, 
          message: errorText || 'Failed to upload proof of purchase' 
        };
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading proof of purchase:', error);
      return { 
        success: false, 
        message: 'Network error uploading proof of purchase' 
      };
    }
  };
  
  // Upload fault images
  const uploadFaultImages = async (claimId, images) => {
    if (!images || images.length === 0) return { success: true, message: 'No images to upload' };
    
    const uploadFormData = new FormData();
    images.forEach(image => {
      uploadFormData.append('files', image);
    });
    
    try {
      const response = await fetch(`${API_BASE_URL}/warrantyclaims/${claimId}/upload-images`, {
        method: 'POST',
        body: uploadFormData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return { 
          success: false, 
          message: errorText || 'Failed to upload images' 
        };
      }
      
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: 'Network error uploading images' 
      };
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setClaimId('');
    setClaimNumber('');
    setApiError('');
    
    try {
      // Step 1: Create the warranty claim
      const claimData = {
        claimType: formData.claimType,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        address: formData.address,
        modelNumber: formData.modelNumber,
        serialNumber: formData.serialNumber,
        faultDescription: formData.faultDescription
      };
      
      
      const createResponse = await fetch(`${API_BASE_URL}/warrantyclaims`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claimData)
      });
      
      
      if (!createResponse.ok) {
        let errorMessage = 'Failed to create warranty claim';
        try {
          const errorData = await createResponse.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          const errorText = await createResponse.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      const createdClaim = await createResponse.json();
      
      const newClaimId = createdClaim.id;
      const newClaimNumber = createdClaim.claimNumber;
      
      setClaimId(newClaimId);
      setClaimNumber(newClaimNumber);
      
      // Step 2: Upload proof of purchase (if required and provided)
      if (formData.claimType !== 'service-repair' && formData.proofOfPurchase) {
        const proofResult = await uploadProofOfPurchase(newClaimId, formData.proofOfPurchase);
        if (!proofResult.success) {
          console.warn('Proof of purchase upload failed:', proofResult.message);
          // Continue anyway - don't fail the whole claim
        }
      }
      
      // Step 3: Upload fault images (if provided)
      if (formData.faultImages.length > 0) {
        const imagesResult = await uploadFaultImages(newClaimId, formData.faultImages);
        if (!imagesResult.success) {
          console.warn('Fault images upload failed:', imagesResult.message);
          // Continue anyway - don't fail the whole claim
        }
      }
      
      // Success message
      alert(`✅ Warranty claim submitted successfully!\n\nClaim Number: ${newClaimNumber}\n\n Please save your claim number for future reference.`);
      
      // Reset form
      setFormData({
        claimType: '',
        proofOfPurchase: null,
        fullName: '',
        phoneNumber: '',
        email: '',
        address: '',
        modelNumber: '',
        serialNumber: '',
        faultDescription: '',
        faultImages: []
      });
      
    } catch (error) {
      console.error('Submission error:', error);
      setApiError(error.message);
      alert(`❌ Error submitting claim: ${error.message}\n\nPlease try again or contact support.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Character counter for fault description
  const faultDescriptionLength = formData.faultDescription.length;
  
  return (
    <div className="warranty-claim-container">
      <div className="warranty-claim-wrapper">
        <div className="warranty-claim-header">
          <h1>Submit Warranty Claim</h1>
          <p>Please fill out all required fields to process your warranty claim</p>
        </div>
        
        {apiError && (
          <div className="error-banner">
            <p><strong>Error:</strong> {apiError}</p>
          </div>
        )}
        
        {claimNumber && (
          <div className="success-banner">
            <p>✅ Claim submitted successfully! Your claim number is: <strong>{claimNumber}</strong></p>
            <p>Please save this number for future reference.</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="warranty-claim-form">
          
          {/* SECTION 1: DISTRIBUTION PARTNER INFORMATION */}
          <div className="form-section">
            <div className="section-header">
              <h2>Claim Selection</h2>
              <div className="section-divider"></div>
            </div>
            
            <div className="claim-type-selection">
              <p className="section-subtitle"></p>
              <div className="claim-type-options">
                <div 
                  className={`claim-type-option ${formData.claimType === 'warranty-inspection' ? 'selected' : ''}`}
                  onClick={() => handleClaimTypeChange('warranty-inspection')}
                >
                  <div className="option-header">
                    <span className="option-checkbox">
                      {formData.claimType === 'warranty-inspection' && '✓'}
                    </span>
                    <span className="option-title">Warranty Inspection</span>
                  </div>
                  <p className="option-description">For products under warranty period requiring inspection (proof of purchase required)</p>
                </div>
                
                <div 
                  className={`claim-type-option ${formData.claimType === 'service-repair' ? 'selected' : ''}`}
                  onClick={() => handleClaimTypeChange('service-repair')}
                >
                  <div className="option-header">
                    <span className="option-checkbox">
                      {formData.claimType === 'service-repair' && '✓'}
                    </span>
                    <span className="option-title">Service Repair Inspection</span>
                  </div>
                  <p className="option-description">Proof of purchase not required for service repairs (Minimum Charge 50$)</p>
                </div>
                
                <div 
                  className={`claim-type-option ${formData.claimType === 'firstup-failure' ? 'selected' : ''}`}
                  onClick={() => handleClaimTypeChange('firstup-failure')}
                >
                  <div className="option-header">
                    <span className="option-checkbox">
                      {formData.claimType === 'firstup-failure' && '✓'}
                    </span>
                    <span className="option-title">Firstup Failure</span>
                  </div>
                  <p className="option-description">For products that failed immediately after purchase</p>
                </div>
              </div>
              {errors.claimType && <span className="field-error">{errors.claimType}</span>}
            </div>
            
            {/* Proof of Purchase Upload */}
            {formData.claimType !== 'service-repair' && (
              <div className="file-upload-section">
                <div className="form-group">
                  <label htmlFor="proofOfPurchase">
                    Proof of Purchase *
                    <span className="file-requirements">(Accepted: JPG, PNG, PDF up to 5MB)</span>
                  </label>
                  
                  {!formData.proofOfPurchase ? (
                    <div className="file-upload-area">
                      <input
                        type="file"
                        id="proofOfPurchase"
                        name="proofOfPurchase"
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="file-input"
                      />
                      <div className="upload-placeholder">
                        <span className="upload-icon">📎</span>
                        <p>Click to upload proof of purchase</p>
                        <p className="upload-hint">Invoice, receipt, or purchase confirmation</p>
                      </div>
                    </div>
                  ) : (
                    <div className="uploaded-file">
                      <span className="file-icon">📄</span>
                      <span className="file-name">{formData.proofOfPurchase.name}</span>
                      <span className="file-size">
                        {(formData.proofOfPurchase.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                      <button 
                        type="button" 
                        className="remove-file"
                        text="Delete"
                        onClick={removeProofOfPurchase}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  {errors.proofOfPurchase && <span className="field-error">{errors.proofOfPurchase}</span>}
                </div>
              </div>
            )}
          </div>
          
          {/* SECTION 2: END USER INFORMATION */}
          <div className="form-section">
            <div className="section-header">
              <h2>CUSTOMER INFORMATION</h2>
              <div className="section-divider"></div>
            </div>
            
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && <span className="field-error">{errors.fullName}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={errors.phoneNumber ? 'error' : ''}
                />
                {errors.phoneNumber && <span className="field-error">{errors.phoneNumber}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="address">
                Address 
                  <span className="field-note">(Required for home delivery)</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </div>
          </div>
          
          {/* SECTION 3: ASSET INFORMATION */}
          <div className="form-section">
            <div className="section-header">
              <h2>ASSET INFORMATION</h2>
              <div className="section-divider"></div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="modelNumber">Model Number *</label>
                <input
                  type="text"
                  id="modelNumber"
                  name="modelNumber"
                  value={formData.modelNumber}
                  onChange={handleChange}
                  placeholder="Enter product model number"
                  className={errors.modelNumber ? 'error' : ''}
                />
                {errors.modelNumber && <span className="field-error">{errors.modelNumber}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="serialNumber">
                  Serial Number
                  <span className="field-note">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="serialNumber"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  placeholder="Enter product serial number"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="faultDescription">
                Description of Fault *
                <span className="char-counter">
                  {faultDescriptionLength}/1000 characters
                </span>
              </label>
              <textarea
                id="faultDescription"
                name="faultDescription"
                value={formData.faultDescription}
                onChange={handleChange}
                placeholder="Describe the issue in detail..."
                rows="4"
                maxLength="1000"
                className={errors.faultDescription ? 'error' : ''}
              />
              {errors.faultDescription && <span className="field-error">{errors.faultDescription}</span>}
            </div>
            
            {/* Fault Images Upload */}
            <div className="form-group">
              <label htmlFor="faultImages">
                Images of the Fault
                <span className="field-note">(Optional, max 5 images)</span>
              </label>
              
              <div className="image-upload-area">
                <input
                  type="file"
                  id="faultImages"
                  name="faultImages"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png"
                  multiple
                  className="file-input"
                  disabled={formData.faultImages.length >= 5}
                />
                
                <div className="upload-placeholder">
                  <span className="upload-icon">📷</span>
                  <p>Click to upload images of the fault</p>
                  <p className="upload-hint">
                    {formData.faultImages.length}/5 images uploaded
                    {formData.faultImages.length >= 5 && ' (Maximum reached)'}
                  </p>
                </div>
              </div>
              
              {/* Display uploaded images */}
              {formData.faultImages.length > 0 && (
                <div className="uploaded-images">
                  {formData.faultImages.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Fault ${index + 1}`}
                        className="preview-image"
                      />
                      <button 
                        type="button"
                        className="remove-image"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                      <span className="image-name">{image.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="form-submit">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Submitting Claim...
                </>
              ) : (
                'Submit Warranty Claim'
              )}
            </button>
            <p className="form-note">
              By submitting this form, you agree to our Warranty Terms and Conditions.
             
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WarrantyClaim;