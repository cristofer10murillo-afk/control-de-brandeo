import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { DEFAULT_USERS, getRoleInfo } from '../utils/authUtils';

export default function LoginScreen({ onLogin, users = [] }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pool of valid users: Firestore users or DEFAULT_USERS fallback
  const userPool = users.length > 0 ? users : DEFAULT_USERS;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const matched = userPool.find(u => 
      u.email.toLowerCase() === cleanEmail && u.password === cleanPass
    );

    if (matched) {
      // Store session
      onLogin(matched);
    } else {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    const matched = userPool.find(u => 
      u.email.toLowerCase() === demoEmail.toLowerCase() && u.password === demoPass
    );
    if (matched) {
      onLogin(matched);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.15) 0%, rgba(15, 23, 42, 1) 100%)',
      fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '32px 28px',
        borderRadius: '16px',
        backgroundColor: 'var(--bg-card, #1e293b)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 25px rgba(139, 92, 246, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        
        {/* Header with App Logo */}
        <div style={{ textAlign: 'center' }}>
          <img
            src="/pwa-192x192.png"
            alt="Logo Control de Brandeo"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.5)',
              margin: '0 auto 12px auto',
              objectFit: 'cover',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
          />
          <h1 style={{
            fontSize: '1.45rem',
            fontWeight: '900',
            color: 'var(--text-main, #ffffff)',
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em'
          }}>
            Control de Brandeo PRO
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted, #94a3b8)', margin: 0 }}>
            Inicia sesión para ingresar al sistema de gestión
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#f87171',
            fontSize: '0.82rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Email */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: '700',
              color: 'var(--text-main, #ffffff)',
              marginBottom: '6px'
            }}>
              <Mail size={15} color="#8b5cf6" />
              <span>Correo Electrónico:</span>
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              style={{ height: '42px', fontSize: '0.9rem' }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: '700',
              color: 'var(--text-main, #ffffff)',
              marginBottom: '6px'
            }}>
              <Lock size={15} color="#8b5cf6" />
              <span>Contraseña:</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ height: '42px', fontSize: '0.9rem', paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted, #94a3b8)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              height: '46px',
              fontSize: '0.96rem',
              fontWeight: '800',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
              marginTop: '4px'
            }}
          >
            <ShieldCheck size={18} />
            <span>{loading ? 'Verificando...' : 'Iniciar Sesión'}</span>
          </button>
        </form>

        {/* Demo / Quick Access Buttons */}
        <div style={{
          marginTop: '6px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted, #94a3b8)', textTransform: 'uppercase', fontWeight: '800', textAlign: 'center' }}>
            Acceso Rápido por Rol
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Master */}
            <button
              type="button"
              onClick={() => handleQuickLogin('cristofer10murillo@gmail.com', 'Shariton24')}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(192, 132, 252, 0.4)',
                backgroundColor: 'rgba(192, 132, 252, 0.1)',
                color: '#c084fc',
                fontSize: '0.8rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>👑 Ingresar como <strong>Master</strong> (Cristofer)</span>
              <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>Shariton24 ➔</span>
            </button>

            {/* Admin Secundario */}
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@taller.com', 'Admin2026*')}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                color: '#38bdf8',
                fontSize: '0.8rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>🛡️ Ingresar como <strong>Admin Secundario</strong></span>
              <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>Admin2026* ➔</span>
            </button>

            {/* Brandeador */}
            <button
              type="button"
              onClick={() => handleQuickLogin('brandeo@taller.com', 'Brandeo2026*')}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                backgroundColor: 'rgba(52, 211, 153, 0.1)',
                color: '#34d399',
                fontSize: '0.8rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>🎨 Ingresar como <strong>Brandeador</strong> (Solo marcar/descontar)</span>
              <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>Brandeo2026* ➔</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
