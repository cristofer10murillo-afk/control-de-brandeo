import React, { useState, useRef, useEffect } from 'react';

const PRIORIDADES = [
  {
    id: 'URGENTE',
    label: 'URGENTE',
    icon: '🎨',
    emoji: '🔥',
    bg: '#8b5cf6',
    border: '#a855f7',
    color: '#ffffff',
    shadow: '0 2px 6px rgba(139, 92, 246, 0.45)',
    description: 'Prioridad alta (atención inmediata)'
  },
  {
    id: 'MEDIO',
    label: 'MEDIO',
    icon: '🎨',
    emoji: '⚡',
    bg: '#f59e0b',
    border: '#fbbf24',
    color: '#ffffff',
    shadow: '0 2px 6px rgba(245, 158, 11, 0.45)',
    description: 'Prioridad normal / media'
  },
  {
    id: 'BAJO',
    label: 'BAJO',
    icon: '🎨',
    emoji: '🟢',
    bg: '#3b82f6',
    border: '#60a5fa',
    color: '#ffffff',
    shadow: '0 2px 6px rgba(59, 130, 246, 0.45)',
    description: 'Prioridad baja / flexible'
  }
];

export default function BrandeoPriorityBadge({
  equipo,
  onUpdatePriority,
  editable = true,
  style = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dropdownRef = useRef(null);

  const rawPrio = (equipo?.prioridadBrandeo || 'URGENTE').toUpperCase();
  const currentPrio = PRIORIDADES.find(p => p.id === rawPrio) || PRIORIDADES[0];

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = async (e, prioId) => {
    e.stopPropagation();
    e.preventDefault();
    if (prioId === currentPrio.id) {
      setIsOpen(false);
      return;
    }

    if (onUpdatePriority) {
      try {
        setIsUpdating(true);
        await onUpdatePriority(equipo.id, prioId);
      } catch (err) {
        console.error('Error al actualizar prioridad:', err);
      } finally {
        setIsUpdating(false);
        setIsOpen(false);
      }
    } else {
      setIsOpen(false);
    }
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (editable) {
      setIsOpen(prev => !prev);
    }
  };

  return (
    <div 
      ref={dropdownRef} 
      style={{ 
        position: 'relative', 
        display: 'inline-block', 
        verticalAlign: 'middle',
        marginLeft: '6px',
        ...style 
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Botón Badge */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={!editable || isUpdating}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          borderRadius: '8px',
          backgroundColor: currentPrio.bg,
          color: currentPrio.color,
          border: `1px solid ${currentPrio.border}`,
          fontWeight: '800',
          fontSize: '0.72rem',
          letterSpacing: '0.03em',
          cursor: editable ? 'pointer' : 'default',
          boxShadow: currentPrio.shadow,
          transition: 'all 0.15s ease',
          outline: 'none',
          userSelect: 'none',
          opacity: isUpdating ? 0.7 : 1
        }}
        title={editable ? `Prioridad de Brandeo: ${currentPrio.label}. Clic para cambiar prioridad` : `Prioridad: ${currentPrio.label}`}
      >
        <span>{currentPrio.icon}</span>
        <span>{currentPrio.label}</span>
        {editable && (
          <span style={{ fontSize: '0.65rem', marginLeft: '1px', opacity: 0.85 }}>▾</span>
        )}
      </button>

      {/* Popover desplegable */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          zIndex: 1000,
          backgroundColor: 'var(--bg-card, #1e293b)',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.12)',
          padding: '4px',
          minWidth: '160px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          animation: 'fadeIn 0.15s ease'
        }}>
          <div style={{ 
            padding: '4px 8px', 
            fontSize: '0.65rem', 
            textTransform: 'uppercase', 
            color: 'var(--text-muted, #94a3b8)', 
            fontWeight: '700',
            letterSpacing: '0.05em',
            borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
            marginBottom: '2px'
          }}>
            Delimitar Prioridad:
          </div>

          {PRIORIDADES.map(prio => {
            const isSelected = prio.id === currentPrio.id;
            return (
              <button
                key={prio.id}
                type="button"
                onClick={(e) => handleSelect(e, prio.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                  border: isSelected ? `1px solid ${prio.bg}` : '1px solid transparent',
                  color: 'var(--text-main, #ffffff)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.12s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: prio.bg
                  }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: '700' }}>
                    {prio.emoji} {prio.label}
                  </span>
                </div>
                {isSelected && (
                  <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: '800' }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
