import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    // Clear caches and reload
    if ('caches' in window) {
      caches.keys().then((names) => {
        for (let name of names) caches.delete(name);
      });
    }
    window.location.reload(true);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#090d16',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '500px',
            width: '100%',
            backgroundColor: '#131b2e',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '30px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              fontSize: '28px'
            }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>
              Control de Brandeo
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>
              Se detectó una actualización pendiente en tu navegador o un error temporal.
            </p>
            {this.state.error && (
              <pre style={{
                textAlign: 'left',
                backgroundColor: '#090d16',
                color: '#f87171',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                overflowX: 'auto',
                marginBottom: '20px'
              }}>
                {String(this.state.error?.message || this.state.error)}
              </pre>
            )}
            <button
              onClick={this.handleReload}
              style={{
                width: '100%',
                padding: '12px 20px',
                backgroundColor: '#8b5cf6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.35)'
              }}
            >
              🔄 Recargar y Actualizar Aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
