import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listingsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import FlashMessage from '../components/FlashMessage';

const ListingNew = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: '',
    image: null
  });

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
    if (!formData.image) {
      setError('Please upload an image');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to create a listing');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('location', formData.location);
      submitData.append('country', formData.country);
      submitData.append('image', formData.image);

      const response = await listingsAPI.create(submitData);
      navigate(`/listings/${response.data.listing._id}`);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="row">
        <div className="col-8 offset-2">
          <br /><br />
          <h3>Please log in to create a listing</h3>
          <p>You need to be logged in to create new listings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-8 offset-2">
        <br /><br />
        <h3>Create New Listings</h3>
        
        {error && <FlashMessage message={error} type="error" />}
        
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              name="title"
              id="title"
              placeholder="Add a catchy title"
              type="text"
              className="form-control"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <div className="valid-feedback">Looks good!</div>
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
              placeholder="Describe your place..."
              required
            />
            <div className="invalid-feedback">Enter a short description!!</div>
          </div>

          <div className="mb-3">
            <label htmlFor="image" className="form-label">Upload image file</label>
            <input
              name="image"
              id="image"
              type="file"
              className="form-control"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </div>

          <div className="row">
            <div className="mb-3 col-sm-4">
              <label htmlFor="price" className="form-label">Price</label>
              <input
                name="price"
                id="price"
                placeholder="Enter price"
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
              <div className="invalid-feedback">Enter valid price!!</div>
            </div>

            <div className="mb-3 col-sm-7">
              <label htmlFor="country" className="form-label">Country</label>
              <input
                name="country"
                id="country"
                placeholder="Enter country"
                type="text"
                className="form-control"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
              <div className="invalid-feedback">Enter valid Country Name!!</div>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="location" className="form-label">Location</label>
            <input
              name="location"
              id="location"
              placeholder="Enter location"
              type="text"
              className="form-control"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
            <div className="invalid-feedback">Enter valid location!!</div>
          </div>

          <br />
          <button 
            className="btn btn-dark add-btn" 
            type="submit"
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : 'ADD'}
          </button>
          <br /><br /><br />
        </form>
      </div>
    </div>
  );
};

export default ListingNew; 