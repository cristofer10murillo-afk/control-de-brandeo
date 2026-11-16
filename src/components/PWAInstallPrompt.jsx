import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Monitor, CheckCircle, X, Share } from 'lucide-react';

export default function PWAInstallPrompt({ isBanner = false, onClose }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed as PWA)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isInstalled) return;

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback message for browsers without beforeinstallprompt support
      alert(
        'Para instalar en tu computadora o teléfono:\n\n' +
        '• En Chrome / Edge (PC): Haz clic en el ícono de instalación en la barra de direcciones (arriba a la derecha).\n' +
        '• En Android: Toca el menú (3 puntos) y selecciona "Instalar aplicación" o "Agregar a la pantalla principal".'
      );
    }
  };

  if (isInstalled) {
    if (isBanner) return null;
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.75rem',
        fontWeight: '700',
        padding: '5px 10px',
        borderRadius: '8px',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        color: 'var(--success)'
      }}>
        <CheckCircle size={14} />
        App Instalada
      </span>
    );
  }

  // Floating banner for mobile / first-time visitors
  if (isBanner) {
    return (
      <>
        <div style={{
          position: 'fixed',
          bottom: '16px',
          left: '16px',
          right: '16px',
          maxWidth: '460px',
          margin: '0 auto',
          backgroundColor: 'var(--bg-card)',
          border: '2px solid #8b5cf6',
          borderRadius: '16px',
          padding: '14px 18px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          zIndex: 9000,
          animation: 'scaleIn 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#8b5cf6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0
            }}>
              <Smartphone size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.2 }}>
                Instalar Brandeo App
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Úsala como app nativa en tu PC o teléfono
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleInstallClick}
              className="btn btn-primary"
              style={{ padding: '8px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
            >
              <Download size={15} />
              <span>Instalar</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Modal Guide for iOS Safari */}
        {showIOSModal && (
          <div className="modal-overlay" onClick={() => setShowIOSModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '24px', maxWidth: '400px', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <Share size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)' }}>
                Instalar en iPhone o iPad
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                1. Toca el botón <strong>Compartir</strong> <Share size={14} style={{ display: 'inline' }} /> en la barra inferior de Safari.<br />
                2. Desliza hacia abajo y selecciona <strong>"Agregar a pantalla de inicio"</strong>.<br />
                3. Toca <strong>"Agregar"</strong> arriba a la derecha.
              </p>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowIOSModal(false)}>
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Button version for Navbar
  return (
    <>
      <button
        onClick={handleInstallClick}
        className="btn btn-primary"
        style={{
          padding: '6px 12px',
          height: '38px',
          fontSize: '0.82rem',
          backgroundColor: '#8b5cf6',
          color: '#ffffff'
        }}
        title="Instalar esta aplicación en tu computadora o teléfono"
      >
        <Download size={15} />
        <span>Instalar App</span>
      </button>

      {showIOSModal && (
        <div className="modal-overlay" onClick={() => setShowIOSModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '24px', maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Share size={26} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)' }}>
              Instalar en iPhone o iPad
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              1. Toca el botón <strong>Compartir</strong> en la barra de Safari.<br />
              2. Selecciona <strong>"Agregar a pantalla de inicio"</strong>.<br />
              3. Toca <strong>"Agregar"</strong>.
            </p>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowIOSModal(false)}>
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}
