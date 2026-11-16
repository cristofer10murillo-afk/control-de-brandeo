import React from 'react';
import { Sparkles, Sun, Moon, Search, User, RefreshCw, LogOut, Users } from 'lucide-react';
import PWAInstallPrompt from './PWAInstallPrompt';
import { getRoleInfo } from '../utils/authUtils';

export default function BrandeoNavbar({
  theme,
  toggleTheme,
  searchTerm,
  setSearchTerm,
  currentUser,
  onLogout,
  onOpenUsersModal,
  isLive,
  onRefresh
}) {
  const roleInfo = currentUser ? getRoleInfo(currentUser.rol) : null;
  const isMaster = currentUser && (currentUser.rol || '').toLowerCase() === 'master';

  return (
    <header style={{
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      padding: '10px 16px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        width: '100%',
        margin: '0',
        padding: '0 4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Logo and title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/pwa-192x192.png"
            alt="Logo Control de Brandeo"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '11px',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.45)',
              objectFit: 'cover',
              flexShrink: 0,
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h1 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
                Control de Brandeo
              </h1>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                textTransform: 'uppercase'
              }}>
                PRO
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
              Sincronizado con Gestor de Equipos
            </p>
          </div>
        </div>

        {/* Center Search Input */}
        <div style={{ flex: '1', maxWidth: '360px', minWidth: '180px', position: 'relative' }}>
          <Search size={16} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input
            type="text"
            className="form-control"
            placeholder="Buscar equipo, activo, serie, cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '36px', height: '36px', fontSize: '0.82rem' }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* PWA Install Button */}
          <PWAInstallPrompt />

          {/* Realtime Live Pulse */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '20px',
            backgroundColor: isLive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: isLive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: isLive ? 'var(--success)' : 'var(--danger)'
          }} title={isLive ? 'Conectado a Firebase en tiempo real' : 'Reconectando...'}>
            <span className={isLive ? 'live-pulse' : ''} style={!isLive ? { width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' } : {}} />
            <span>{isLive ? 'En vivo' : 'Offline'}</span>
          </div>

          {/* User Badge & Profile */}
          {currentUser && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '10px',
              backgroundColor: roleInfo?.bg || 'var(--bg-surface)',
              border: `1px solid ${roleInfo?.border || 'var(--border-color)'}`
            }}>
              <User size={14} color={roleInfo?.color || 'var(--primary)'} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {currentUser.nombre || currentUser.email}
                </span>
                <span style={{ fontSize: '0.66rem', fontWeight: '700', color: roleInfo?.color }}>
                  {roleInfo?.badge}
                </span>
              </div>
            </div>
          )}

          {/* Master Users Management CTA */}
          {isMaster && (
            <button
              onClick={onOpenUsersModal}
              className="btn btn-outline"
              style={{
                padding: '6px 10px',
                height: '36px',
                fontSize: '0.78rem',
                gap: '5px',
                color: '#c084fc',
                borderColor: 'rgba(192, 132, 252, 0.4)'
              }}
              title="Administrar usuarios y accesos"
            >
              <Users size={14} />
              <span>Usuarios</span>
            </button>
          )}

          {/* Refresh manual */}
          <button
            onClick={onRefresh}
            className="btn btn-outline"
            style={{ padding: '8px', width: '36px', height: '36px' }}
            title="Recargar datos"
          >
            <RefreshCw size={15} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-outline"
            style={{ padding: '8px', width: '36px', height: '36px' }}
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} color="#6366f1" />}
          </button>

          {/* Logout button */}
          {currentUser && (
            <button
              onClick={onLogout}
              className="btn btn-outline"
              style={{
                padding: '6px 10px',
                height: '36px',
                fontSize: '0.78rem',
                gap: '5px',
                color: 'var(--danger)',
                borderColor: 'rgba(239, 68, 68, 0.3)'
              }}
              title="Cerrar sesión"
            >
              <LogOut size={14} />
              <span>Salir</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
