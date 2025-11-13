import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Safely extract error message from error object
      const error = this.state.error || {};
      let errorMessage = 'An unexpected error occurred';
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        errorMessage = error.message || JSON.stringify(error);
      }
      
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          marginTop: '50px',
          color: '#721c24',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          maxWidth: '500px',
          margin: '50px auto',
          padding: '20px'
        }}>
          <h2>Something went wrong</h2>
          <p style={{ margin: '15px 0', wordBreak: 'break-word' }}>
            {errorMessage}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
