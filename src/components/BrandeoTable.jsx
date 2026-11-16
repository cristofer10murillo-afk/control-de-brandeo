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
  Tag, 
  Hash, 
  Layers 
} from 'lucide-react';
import BrandeoPriorityBadge from './BrandeoPriorityBadge';

export default function BrandeoTable({
  equipos = [],
  activeTab = 'pendientes',
  onConfirmBrandeo,
  onToggleRequiereBrandeo,
  onUpdatePrioridad,
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
    <>
      {/* 1. DESKTOP VIEW: PANORAMIC TABLE MATCHING PHOTO 1 (Full screen width, no unnecessary scrollbars) */}
      <div className="card desktop-table-view desktop-table-card" style={{ padding: 0, width: '100%', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
          <thead style={{ backgroundColor: 'var(--table-header-bg)', color: '#ffffff' }}>
            <tr>
              <th style={{ padding: '11px 12px', width: '185px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', fontSize: '0.78rem' }}>
                Confirmación de Brandeo
              </th>
              <th style={{ padding: '11px 12px', minWidth: '170px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', fontSize: '0.78rem' }}>
                Equipo / Modelo
              </th>
              <th style={{ padding: '11px 12px', width: '110px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', fontSize: '0.78rem' }}>
                Activo
              </th>
              <th style={{ padding: '11px 12px', width: '120px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', fontSize: '0.78rem' }}>
                Serie
              </th>
              <th style={{ padding: '11px 12px', minWidth: '180px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', fontSize: '0.78rem' }}>
                Cliente
              </th>
              <th style={{ padding: '11px 12px', width: '130px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', fontSize: '0.78rem' }}>
                Lugar / Ubicación
              </th>
              <th style={{ padding: '11px 12px', width: '180px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', fontSize: '0.78rem' }}>
                Registro y Fecha / Hora
              </th>
            </tr>
          </thead>
          <tbody>
            {equipos.map(eq => {
              const isBrandeado = eq.brandeoRealizado === true;
              const isPendiente = eq.requiereBrandeo === true;

              const prio = (eq.prioridadBrandeo || 'URGENTE').toUpperCase();
              const prioColor = prio === 'MEDIO' ? '#f59e0b' : (prio === 'BAJO' ? '#3b82f6' : '#8b5cf6');

              let rowBg = 'transparent';
              let borderLeft = '4px solid transparent';

              if (isPendiente) {
                rowBg = theme === 'dark' ? '#2d184c' : '#f5f0ff';
                borderLeft = `4px solid ${prioColor}`;
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
                  {/* Casilla de Confirmación */}
                  <td style={{ padding: '9px 12px', borderLeft }}>
                    {isPendiente ? (
                      <button
                        onClick={() => onConfirmBrandeo(eq)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          backgroundColor: '#8b5cf6',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(139, 92, 246, 0.35)',
                          transition: 'all 0.15s ease',
                          whiteSpace: 'nowrap'
                        }}
                        title="Haz clic aquí para confirmar que el brandeo de este equipo ha sido realizado"
                      >
                        <Check size={14} strokeWidth={3} />
                        <span>Confirmar Brandeo</span>
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
                          border: '1px solid var(--success)',
                          whiteSpace: 'nowrap'
                        }}>
                          <Check size={14} strokeWidth={3} />
                          Brandeo Realizado
                        </span>
                        <button
                          onClick={() => onToggleRequiereBrandeo(eq, true)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                          title="Revertir a pendiente de brandeo"
                        >
                          <RotateCcw size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onToggleRequiereBrandeo(eq, true)}
                        className="btn btn-outline"
                        style={{ padding: '5px 10px', fontSize: '0.78rem', height: '32px' }}
                      >
                        <span>+ Solicitar Brandeo</span>
                      </button>
                    )}
                  </td>

                  {/* Equipo / Modelo */}
                  <td style={{ padding: '9px 12px', fontWeight: '700', color: '#0284c7' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.9rem' }}>{eq.tipoEquipo || eq.modelo || 'Sin Tipo'}</span>
                      {isPendiente && (
                        <BrandeoPriorityBadge 
                          equipo={eq}
                          onUpdatePriority={onUpdatePrioridad}
                        />
                      )}
                    </div>
                  </td>

                  {/* Activo */}
                  <td style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                    {eq.activo || 'N/A'}
                  </td>

                  {/* Serie */}
                  <td style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                    {eq.serie || 'N/A'}
                  </td>

                  {/* Cliente */}
                  <td style={{ 
                    padding: '9px 12px', 
                    fontWeight: '700',
                    color: (eq.cliente || '').toUpperCase().includes('TBD') ? (theme === 'dark' ? '#4ade80' : '#15803d') : 'var(--text-main)'
                  }}>
                    {eq.cliente || 'Sin Cliente Asignado'}
                  </td>

                  {/* Lugar */}
                  <td style={{ padding: '9px 12px', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={13} color="var(--primary)" />
                      {eq.lugar || eq.ubicacion || 'Taller'}
                    </span>
                  </td>

                  {/* Registro y Fecha / Hora Exacta */}
                  <td style={{ padding: '9px 12px' }}>
                    {isPendiente ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#8b5cf6', fontWeight: '700', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        <Clock size={14} />
                        Falta Brandear
                      </span>
                    ) : isBrandeado ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ color: 'var(--success)', fontWeight: '800', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                          <Check size={13} /> {eq.fechaBrandeo || 'Completado'}
                        </span>
                        {eq.tipoBrandeoUsado && (
                          <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: '700', whiteSpace: 'nowrap' }}>
                            📦 Kit: {eq.tipoBrandeoUsado}
                          </span>
                        )}
                        {eq.semanaBrandeo && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: '600', whiteSpace: 'nowrap' }}>
                            {eq.semanaBrandeo} ({eq.mesBrandeo || ''})
                          </span>
                        )}
                        {eq.usuarioBrandeo && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
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

      {/* 2. MOBILE VIEW: FLUID, TOUCH-FRIENDLY CARDS FOR CELLPHONES */}
      <div className="mobile-cards-view">
        {equipos.map(eq => {
          const isBrandeado = eq.brandeoRealizado === true;
          const isPendiente = eq.requiereBrandeo === true;

          const prio = (eq.prioridadBrandeo || 'URGENTE').toUpperCase();
          const prioColor = prio === 'MEDIO' ? '#f59e0b' : (prio === 'BAJO' ? '#3b82f6' : '#8b5cf6');

          return (
            <div
              key={eq.id}
              className="card"
              style={{
                padding: '16px',
                borderLeft: isPendiente ? `6px solid ${prioColor}` : isBrandeado ? '6px solid #10b981' : '1px solid var(--border-color)',
                backgroundColor: isPendiente ? (theme === 'dark' ? '#221138' : '#faf7ff') : 'var(--bg-card)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {/* Header: Equipo + Status Badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0284c7', lineHeight: 1.2 }}>
                    {eq.tipoEquipo || eq.modelo || 'Equipo'}
                  </h4>
                  <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>
                    {eq.cliente || 'Sin cliente asignado'}
                  </p>
                </div>
                {isPendiente && (
                  <BrandeoPriorityBadge 
                    equipo={eq}
                    onUpdatePriority={onUpdatePrioridad}
                  />
                )}
                {isBrandeado && (
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--success-light)',
                    color: 'var(--success)',
                    fontWeight: '800'
                  }}>
                    ✓ BRANDEADO
                  </span>
                )}
              </div>

              {/* Technical Details Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface-hover)',
                marginBottom: '12px',
                fontSize: '0.8rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Activo:</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{eq.activo || 'N/A'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Serie:</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{eq.serie || 'N/A'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Lugar:</span>
                  <span>{eq.lugar || eq.ubicacion || 'Taller'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Estado:</span>
                  <span>{isPendiente ? '⚠️ Pendiente' : isBrandeado ? '✓ Completado' : 'Sin solicitud'}</span>
                </div>
              </div>

              {/* Exact Date and Time if completed */}
              {isBrandeado && eq.fechaBrandeo && (
                <div style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  marginBottom: '12px',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontWeight: '700' }}>
                      <Clock size={14} />
                      <span>{eq.fechaBrandeo}</span>
                    </div>
                    {eq.tipoBrandeoUsado && (
                      <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: '700' }}>
                        📦 Kit: {eq.tipoBrandeoUsado}
                      </span>
                    )}
                  </div>
                  {eq.usuarioBrandeo && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                      {eq.usuarioBrandeo}
                    </span>
                  )}
                </div>
              )}

              {/* Big Touch Action Button for Cellphones */}
              {isPendiente ? (
                <button
                  onClick={() => onConfirmBrandeo(eq)}
                  style={{
                    width: '100%',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    backgroundColor: '#8b5cf6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.35)',
                    touchAction: 'manipulation'
                  }}
                >
                  <Check size={20} strokeWidth={3} />
                  <span>Confirmar Brandeo Realizado</span>
                </button>
              ) : isBrandeado ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{
                    flex: 1,
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: 'var(--success-light)',
                    color: 'var(--success)',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    border: '1px solid var(--success)'
                  }}>
                    <Check size={16} strokeWidth={3} />
                    <span>Brandeo Realizado</span>
                  </div>
                  <button
                    onClick={() => onToggleRequiereBrandeo(eq, true)}
                    className="btn btn-outline"
                    style={{ height: '42px', padding: '0 12px' }}
                    title="Revertir"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onToggleRequiereBrandeo(eq, true)}
                  className="btn btn-outline"
                  style={{ width: '100%', height: '42px' }}
                >
                  <span>+ Solicitar Brandeo</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
