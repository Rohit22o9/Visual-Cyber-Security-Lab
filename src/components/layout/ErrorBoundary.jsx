import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Component crash:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          background: 'rgba(255,45,85,0.15)',
          border: '1px solid var(--danger-red)',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h4 style={{ color: 'var(--danger-red)', marginBottom: '0.5rem' }}>
            Component Runtime Error
          </h4>
          <pre style={{
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }}>
            {this.state.error?.toString()}
          </pre>
          <button
            className="btn btn-danger"
            style={{ marginTop: '1rem' }}
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
