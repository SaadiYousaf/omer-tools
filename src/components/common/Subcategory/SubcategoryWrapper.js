import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchSubcategory,
  selectCurrentSubcategory,
  selectSingleSubcategoryStatus,
  selectSingleSubcategoryError,
  clearCurrentSubcategory
} from '../../../store/subcategoriesSlice';
import Loading from '../Loading/Loading';
import ErrorMessage from '../../layout/ErrorMessage/ErrorMessage';

const SubcategoryWrapper = () => {
  const { subcategoryId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const currentSubcategory = useSelector(selectCurrentSubcategory);
  const status = useSelector(selectSingleSubcategoryStatus);
  const error = useSelector(selectSingleSubcategoryError);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearCurrentSubcategory());
    };
  }, [dispatch]);

  // Fetch subcategory data when subcategoryId changes
  useEffect(() => {
    if (subcategoryId) {
      dispatch(fetchSubcategory(subcategoryId));
    }
  }, [subcategoryId, dispatch]);

  // Redirect to proper URL once we have category_id
  useEffect(() => {
    if (currentSubcategory?.category_id && status === 'succeeded') {
      navigate(
        `/category/${currentSubcategory.category_id}/subcategory/${subcategoryId}`,
        { replace: true }
      );
    }
  }, [currentSubcategory, subcategoryId, status, navigate]);

  // Loading state
  if (status === 'loading') {
    return <Loading fullPage />;
  }

  // Error state
  if (status === 'failed') {
    return <ErrorMessage message={error || 'Failed to load subcategory'} />;
  }

  // Default return (briefly shown before redirect)
  return <Loading fullPage />;
};

export default SubcategoryWrapper;