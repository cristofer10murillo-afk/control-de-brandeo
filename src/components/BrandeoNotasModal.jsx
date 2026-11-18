import React, { useState, useEffect } from 'react';
import { X, FileText, Check, Trash2, Tag, AlertCircle } from 'lucide-react';

const SUGGESTIONS = [
  '🏷️ Vinil Mate',
  '✨ Vinil Brillante',
  '🎨 Logo Frontal Especial',
  '⚡ Entrega Inmediata',
  '🚫 No Brandear Laterales',
  '🔍 Verificar Medidas'
];

export default function BrandeoNotasModal({
  equipo,
  onClose,
  onSave
}) {
  const initialNote = equipo?.notasBrandeo || equipo?.especificacionesBrandeo || equipo?.comentariosBrandeo || equipo?.comentario || '';
  const [nota, setNota] = useState(initialNote);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const current = equipo?.notasBrandeo || equipo?.especificacionesBrandeo || equipo?.comentariosBrandeo || equipo?.comentario || '';
    setNota(current);
  }, [equipo]);

  if (!equipo) return null;

  const handleAddSuggestion = (text) => {
    setNota(prev => {
      const trimmed = prev.trim();
      if (!trimmed) return text;
      if (trimmed.includes(text)) return prev;
      return `${trimmed} • ${text}`;
    });
  };

  const handleClear = () => {
    if (window.confirm('¿Deseas borrar las notas y especificaciones de este equipo?')) {
      setNota('');
      onSave(equipo.id, '');
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    onSave(equipo.id, nota.trim());
    setIsSaving(false);
    onClose();
  };

  const prio = (equipo.prioridadBrandeo || 'URGENTE').toUpperCase();
  const prioColor = prio === 'MEDIO' ? '#f59e0b' : (prio === 'BAJO' ? '#3b82f6' : '#8b5cf6');

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1050 }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '580px', width: '92%' }}
      >
        {/* Header */}
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
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: '#8b5cf6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <FileText size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Especificaciones y Notas de Brandeo
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Ventana emergente para especificaciones sin saturar la tabla principal
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Machine Information Card */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0284c7' }}>
                  {equipo.tipoEquipo || equipo.modelo || 'Equipo'}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: `${prioColor}22`,
                  color: prioColor,
                  border: `1px solid ${prioColor}55`
                }}>
                  Prioridad: {prio}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span>Activo: <strong style={{ fontFamily: 'var(--font-mono)' }}>{equipo.activo || 'N/A'}</strong></span>
                <span>Serie: <strong style={{ fontFamily: 'var(--font-mono)' }}>{equipo.serie || 'N/A'}</strong></span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Cliente: <strong style={{ color: 'var(--text-main)' }}>{equipo.cliente || 'Sin cliente asignado'}</strong>
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>
                <Tag size={13} />
                <span>Atajos rápidos (haz clic para agregar):</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddSuggestion(sug)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.74rem',
                      fontWeight: '600',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea for specifications */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                Notas y especificaciones del equipo:
              </label>
              <textarea
                className="form-control"
                rows="5"
                placeholder="Escribe aquí las especificaciones (ej: instalar vinilo brillante en costados, logo frontal de cliente, no tapar número de serie, arte aprobado el lunes, etc.)..."
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  fontSize: '0.88rem',
                  lineHeight: '1.45',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>💡 Se guarda en Firebase y no crea barras desplazadoras en la pantalla.</span>
                <span>{nota.length} caracteres</span>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '0 0 12px 12px',
            gap: '10px'
          }}>
            <div>
              {initialNote && (
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 10px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: 'var(--danger)',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                  title="Eliminar especificaciones"
                >
                  <Trash2 size={13} />
                  <span>Borrar Nota</span>
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
                style={{ height: '36px', fontSize: '0.82rem', padding: '0 14px' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  backgroundColor: '#8b5cf6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)'
                }}
              >
                <Check size={16} />
                <span>Guardar Especificaciones</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
