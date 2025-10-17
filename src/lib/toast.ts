// Simple toast utility
export const toast = {
  success: (message: string) => {
    if (typeof window !== 'undefined') {
      // Create toast element
      const toastEl = document.createElement('div');
      toastEl.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-all duration-300';
      toastEl.textContent = message;
      
      document.body.appendChild(toastEl);
      
      // Remove after 3 seconds
      setTimeout(() => {
        toastEl.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(toastEl);
        }, 300);
      }, 3000);
    }
  },
  
  error: (message: string) => {
    if (typeof window !== 'undefined') {
      // Create toast element
      const toastEl = document.createElement('div');
      toastEl.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-all duration-300';
      toastEl.textContent = message;
      
      document.body.appendChild(toastEl);
      
      // Remove after 3 seconds
      setTimeout(() => {
        toastEl.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(toastEl);
        }, 300);
      }, 3000);
    }
  }
};
