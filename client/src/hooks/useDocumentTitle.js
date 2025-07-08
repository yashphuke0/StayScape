import { useEffect } from 'react';

/**
 * Custom hook to dynamically update the document title
 * @param {string} title - The title to set
 * @param {boolean} keepSuffix - Whether to keep the " - StayScape" suffix (default: true)
 */
export const useDocumentTitle = (title, keepSuffix = true) => {
  useEffect(() => {
    const prevTitle = document.title;
    
    if (title) {
      document.title = keepSuffix ? `${title} - StayScape` : title;
    }
    
    // Cleanup function to restore previous title
    return () => {
      document.title = prevTitle;
    };
  }, [title, keepSuffix]);
};

export default useDocumentTitle; 