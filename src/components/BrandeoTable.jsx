import React from 'react';
import { 
  Check, 
  Clock, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Calendar, 
  User, 
  ExternalLink 
} from 'lucide-react';

export default function BrandeoTable({
  equipos = [],
  activeTab = 'pendientes',
  onConfirmBrandeo,
  onToggleRequiereBrandeo,
  theme
}) {
  if (equipos.length === 0) {
    return (
      <div className="card" style={{
        padding: '60px 20px',
        textAlign: 'center',
        color: 'var(--text-muted)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          color: 'var(--primary)'
        }}>
          {activeTab === 'pendientes' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
        </div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
          {activeTab === 'pendientes' 
            ? '¡Excelente! No hay equipos pendientes por brandear' 
            : activeTab === 'brandeados' 
              ? 'No hay registros de brandeos completados todavía' 
              : 'No se encontraron equipos con los filtros seleccionados'}
        </h3>
        <p style={{ fontSize: '0.85rem' }}>
          {activeTab === 'pendientes'
            ? 'Cuando en Gestor de Equipos se marque la opción "¿Requiere brandeo?", aparecerán listados aquí automáticamente.'
            : 'Los equipos que vayas confirmando aparecerán en este historial.'}
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
        {/* Table Header matching Photo 1 (#024268) */}
        <thead style={{ backgroundColor: 'var(--table-header-bg)', color: '#ffffff' }}>
          <tr>
            <th style={{ padding: '14px 16px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Confirmación de Brandeo
            </th>
            <th style={{ padding: '14px 16px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Equipo / Modelo
            </th>
            <th style={{ padding: '14px 16px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Activo
            </th>
            <th style={{ padding: '14px 16px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Serie
            </th>
            <th style={{ padding: '14px 16px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Cliente
            </th>
            <th style={{ padding: '14px 16px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Lugar / Ubicación
            </th>
            <th style={{ padding: '14px 16px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Estado
            </th>
          </tr>
        </thead>
        <tbody>
          {equipos.map(eq => {
            const isBrandeado = eq.brandeoRealizado === true;
            const isPendiente = eq.requiereBrandeo === true;

            // Row styling based on state
            let rowBg = 'transparent';
            let borderLeft = '4px solid transparent';

            if (isPendiente) {
              rowBg = theme === 'dark' ? '#2d184c' : '#f5f0ff';
              borderLeft = '4px solid #8b5cf6';
            } else if (isBrandeado) {
              rowBg = theme === 'dark' ? 'rgba(16, 185, 129, 0.08)' : '#f0fdf4';
              borderLeft = '4px solid #10b981';
            }

            return (
              <tr 
                key={eq.id}
                style={{
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: rowBg,
                  transition: 'background-color 0.2s ease'
                }}
              >
                {/* 1. Casilla de Confirmación de Brandeo */}
                <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', borderLeft }}>
                  {isPendiente ? (
                    <button
                      onClick={() => onConfirmBrandeo(eq)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 14px',
                        backgroundColor: '#8b5cf6',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(139, 92, 246, 0.35)',
                        transition: 'all 0.15s ease'
                      }}
                      title="Haz clic aquí para confirmar que el brandeo de este equipo ha sido realizado"
                    >
                      <input 
                        type="checkbox" 
                        readOnly 
                        checked={false} 
                        style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#ffffff' }} 
                      />
                      <span>✓ Confirmar Brandeo Realizado</span>
                    </button>
                  ) : isBrandeado ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--success-light)',
                        color: 'var(--success)',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        border: '1px solid var(--success)'
                      }}>
                        <Check size={14} strokeWidth={3} />
                        Brandeo Realizado
                      </span>
                      {/* Undo option */}
                      <button
                        onClick={() => onToggleRequiereBrandeo(eq, true)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'inline-flex',
                          alignItems: 'center'
                        }}
                        title="Revertir: volver a marcar como pendiente de brandeo"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  ) : (
                    /* In "Todos" tab, equipo does not require brandeo */
                    <button
                      onClick={() => onToggleRequiereBrandeo(eq, true)}
                      className="btn btn-outline"
                      style={{ padding: '5px 10px', fontSize: '0.78rem', height: '32px' }}
                      title="Activar necesidad de brandeo para este equipo"
                    >
                      <span>+ Solicitar Brandeo</span>
                    </button>
                  )}
                </td>

                {/* 2. Equipo / Modelo (Foto 1) */}
                <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0284c7' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.92rem' }}>{eq.tipoEquipo || eq.modelo || 'Sin Tipo'}</span>
                    {isPendiente && (
                      <span style={{
                        fontSize: '0.7rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#8b5cf6',
                        color: '#ffffff',
                        fontWeight: '800'
                      }}>
                        🎨 URGENTE
                      </span>
                    )}
                  </div>
                </td>

                {/* 3. Activo (Foto 1) */}
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--text-main)' }}>
                  {eq.activo || 'N/A'}
                </td>

                {/* 4. Serie (Foto 1) */}
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: 'var(--text-main)', fontWeight: '600' }}>
                  {eq.serie || 'N/A'}
                </td>

                {/* 5. Cliente (Foto 1) */}
                <td style={{ 
                  padding: '12px 16px', 
                  fontWeight: '700',
                  color: (eq.cliente || '').toUpperCase().includes('TBD') ? (theme === 'dark' ? '#4ade80' : '#15803d') : 'var(--text-main)'
                }}>
                  {eq.cliente || 'Sin Cliente Asignado'}
                </td>

                {/* 6. Lugar / Ubicación */}
                <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={13} color="var(--primary)" />
                    {eq.lugar || eq.ubicacion || 'Taller'}
                  </span>
                </td>

                {/* 7. Estado / Fecha de Brandeo */}
                <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                  {isPendiente ? (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: '#8b5cf6',
                      fontWeight: '700',
                      fontSize: '0.8rem'
                    }}>
                      <Clock size={14} />
                      Falta Brandear
                    </span>
                  ) : isBrandeado ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ color: 'var(--success)', fontWeight: '700', fontSize: '0.8rem' }}>
                        ✓ Completado
                      </span>
                      {eq.fechaBrandeo && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {eq.fechaBrandeo}
                        </span>
                      )}
                      {eq.usuarioBrandeo && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <User size={11} /> {eq.usuarioBrandeo}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      Sin solicitud
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
