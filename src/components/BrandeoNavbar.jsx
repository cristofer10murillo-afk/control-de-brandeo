import React from 'react';
import { Sparkles, Sun, Moon, Search, User, RefreshCw } from 'lucide-react';
import PWAInstallPrompt from './PWAInstallPrompt';

export default function BrandeoNavbar({
  theme,
  toggleTheme,
  searchTerm,
  setSearchTerm,
  activeBrander,
  onChangeBrander,
  isLive,
  onRefresh
}) {
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
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Logo and title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(139, 92, 246, 0.3)',
            flexShrink: 0
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h1 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
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
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Sincronizado con Gestor de Equipos
            </p>
          </div>
        </div>

        {/* Center Search Input */}
        <div style={{ flex: '1', maxWidth: '380px', minWidth: '200px', position: 'relative' }}>
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

          {/* Active Brand Specialist Name */}
          <button
            onClick={onChangeBrander}
            className="btn btn-outline"
            style={{ padding: '6px 10px', height: '36px', fontSize: '0.8rem' }}
            title="Cambiar la persona asignada al brandeo"
          >
            <User size={14} color="var(--primary)" />
            <span>{activeBrander || 'Persona Brandeo'}</span>
          </button>

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
        </div>
      </div>
    </header>
  );
}
