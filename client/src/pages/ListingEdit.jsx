import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listingsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import FlashMessage from '../components/FlashMessage';

const ListingEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: '',
    image: null
  });

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await listingsAPI.getById(id);
      const listingData = response.data.listing;
      
      // Check if user is the owner
      if (!user || listingData.owner._id !== user._id) {
        setError('You can only edit your own listings');
        return;
      }
      
      setListing(listingData);
      setFormData({
        title: listingData.title,
        description: listingData.description,
        price: listingData.price.toString(),
        location: listingData.location,
        country: listingData.country,
        image: null // For new image upload
      });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      return false;
    }
    if (!formData.country.trim()) {
      setError('Country is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('location', formData.location);
      submitData.append('country', formData.country);
      
      // Only append image if a new one is selected
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      await listingsAPI.update(id, submitData);
      navigate(`/listings/${id}`);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!user) {
    return (
      <div className="row">
        <div className="col-8 offset-2">
          <br /><br />
          <h3>Please log in to edit listings</h3>
          <p>You need to be logged in to edit listings.</p>
        </div>
      </div>
    );
  }

  if (!listing || error === 'You can only edit your own listings') {
    return (
      <div className="row">
        <div className="col-8 offset-2">
          <br /><br />
          <h3>Access Denied</h3>
          <p>You can only edit your own listings.</p>
          <button onClick={() => navigate('/listings')} className="btn btn-primary">
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-8 offset-2">
        <br /><br />
        <h3>Edit Your Listings</h3>
        
        {error && <FlashMessage message={error} type="error" />}
        
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              name="title"
              id="title"
              type="text"
              className="form-control"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <div className="valid-feedback">looks good!</div>
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              name="description"
              id="description"
              type="text"
              className="form-control"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              required
            />
            <div className="invalid-feedback">add short description!</div>
          </div>

          <div className="mb-3">
            <label className="form-label">Original Listing Image</label>
            <br />
            <img 
              src={listing.image.url} 
              alt="Current listing" 
              style={{ 
                maxWidth: '200px', 
                maxHeight: '150px', 
                objectFit: 'cover',
                borderRadius: '0.375rem',
                border: '1px solid #dee2e6'
              }} 
            />
          </div>

          <div className="mb-3">
            <label htmlFor="image" className="form-label">Upload new image (optional)</label>
            <input
              name="image"
              id="image"
              type="file"
              className="form-control"
              onChange={handleFileChange}
              accept="image/*"
            />
            <small className="form-text text-muted">
              Leave empty to keep the current image
            </small>
          </div>

          <div className="row">
            <div className="mb-3 col-sm-4">
              <label htmlFor="price" className="form-label">Price</label>
              <input
                name="price"
                id="price"
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
              <div className="invalid-feedback">please enter valid price!!</div>
            </div>

            <div className="mb-3 col-sm-7">
              <label htmlFor="country" className="form-label">Country</label>
              <input
                name="country"
                id="country"
                type="text"
                className="form-control"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
              <div className="invalid-feedback">please enter valid country name!</div>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="location" className="form-label">Location</label>
            <input
              name="location"
              id="location"
              type="text"
              className="form-control"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
            <div className="invalid-feedback">please enter valid location!</div>
          </div>

          <div className="mb-3">
            <button 
              className="btn btn-dark edit-btn me-3" 
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'EDIT'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate(`/listings/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingEdit; 