import React, { useState, useEffect } from 'react';

const FlashMessage = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          if (onClose) onClose();
        }, 500); // Wait for fade animation
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message || !visible) return null;

  const alertClass = type === 'error' ? 'alert-danger' : 'alert-success';

  return (
    <div
      className={`alert ${alertClass} alert-dismissible fade show col-6 offset-3`}
      role="alert"
      style={{
        transition: "opacity 0.5s ease-out",
        opacity: visible ? 1 : 0
      }}
    >
      <strong>{message}</strong>
      <button
        type="button"
        className="btn-close"
        onClick={() => setVisible(false)}
        aria-label="Close"
      ></button>
    </div>
  );
};

// Global Flash Message Provider
export const useFlashMessage = () => {
  const [flash, setFlash] = useState({ message: '', type: '' });

  const showFlash = (message, type = 'success') => {
    setFlash({ message, type });
  };

  const clearFlash = () => {
    setFlash({ message: '', type: '' });
  };

  return { flash, showFlash, clearFlash };
};

// Global Flash Message Component
const GlobalFlashMessage = () => {
  const [flash, setFlash] = useState({ message: '', type: '' });

  // Listen for flash messages from other components
  useEffect(() => {
    const handleFlashMessage = (event) => {
      setFlash(event.detail);
    };

    window.addEventListener('flashMessage', handleFlashMessage);
    return () => window.removeEventListener('flashMessage', handleFlashMessage);
  }, []);

  return (
    <FlashMessage 
      message={flash.message} 
      type={flash.type} 
      onClose={() => setFlash({ message: '', type: '' })}
    />
  );
};

// Utility function to show flash messages from anywhere
export const showFlashMessage = (message, type = 'success') => {
  window.dispatchEvent(new CustomEvent('flashMessage', {
    detail: { message, type }
  }));
};

export default GlobalFlashMessage; 