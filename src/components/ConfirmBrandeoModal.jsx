import React, { useState } from 'react';
import { X, Sparkles, Check, User, MessageSquare, AlertCircle } from 'lucide-react';

export default function ConfirmBrandeoModal({
  equipo,
  defaultBrander = '',
  onClose,
  onConfirm
}) {
  const [branderName, setBranderName] = useState(defaultBrander || localStorage.getItem('last_brander_name') || '');
  const [comentarios, setComentarios] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!equipo) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (branderName) {
      localStorage.setItem('last_brander_name', branderName.trim());
    }
    onConfirm(equipo.id, {
      usuarioBrandeo: branderName.trim() || 'Técnico de Brandeo',
      comentariosBrandeo: comentarios.trim()
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--primary-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#8b5cf6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Sparkles size={18} />
            </div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Confirmar Brandeo Realizado
            </h2>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Equipment Summary Card */}
            <div style={{
              padding: '14px 16px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                  Equipo / Modelo:
                </span>
                <p style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{equipo.tipoEquipo || equipo.modelo || 'N/A'}</span>
                  <span style={{
                    padding: '1px 6px',
                    borderRadius: '6px',
                    backgroundColor: (equipo.prioridadBrandeo || 'URGENTE').toUpperCase() === 'MEDIO' ? '#f59e0b' : ((equipo.prioridadBrandeo || 'URGENTE').toUpperCase() === 'BAJO' ? '#3b82f6' : '#8b5cf6'),
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: '800'
                  }}>
                    🎨 {(equipo.prioridadBrandeo || 'URGENTE').toUpperCase()}
                  </span>
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                  Cliente:
                </span>
                <p style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  {equipo.cliente || 'Sin cliente asignado'}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                  Activo:
                </span>
                <p style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                  {equipo.activo || 'N/A'}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                  Serie:
                </span>
                <p style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                  {equipo.serie || 'N/A'}
                </p>
              </div>
            </div>

            {/* Brander Name */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>
                <User size={15} color="var(--primary)" />
                <span>Persona que realizó el brandeo:</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Nombre del técnico o responsable..."
                value={branderName}
                onChange={(e) => setBranderName(e.target.value)}
                autoFocus
              />
            </div>

            {/* Comments / Notes */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>
                <MessageSquare size={15} color="var(--primary)" />
                <span>Notas adicionales de brandeo (Opcional):</span>
              </label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Ej: Vinilo nuevo instalado, detalles de arte aprobados..."
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
              />
            </div>

            {/* Info notice */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontSize: '0.8rem',
              color: 'var(--text-main)'
            }}>
              <Check size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                Al confirmar, este equipo se marcará como <strong>Brandeado</strong> y de inmediato <strong>se quitará el color distintivo en el Gestor de Equipos</strong>.
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            backgroundColor: 'var(--bg-surface)'
          }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={isSubmitting}
              style={{ boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)' }}
            >
              <Check size={16} />
              <span>{isSubmitting ? 'Guardando...' : 'Confirmar Brandeo Realizado'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
