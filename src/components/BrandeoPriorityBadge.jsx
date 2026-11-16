import React, { useState } from 'react';

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
  const [isUpdating, setIsUpdating] = useState(false);

  const rawPrio = (equipo?.prioridadBrandeo || 'URGENTE').toUpperCase();
  const currentPrio = PRIORIDADES.find(p => p.id === rawPrio) || PRIORIDADES[0];

  const handleChange = async (e) => {
    e.stopPropagation();
    const newPrio = e.target.value;
    if (newPrio === currentPrio.id) return;

    if (onUpdatePriority) {
      try {
        setIsUpdating(true);
        if (onUpdatePriority.length === 1) {
          await onUpdatePriority(newPrio);
        } else {
          await onUpdatePriority(equipo.id, newPrio);
        }
      } catch (err) {
        console.error('Error al actualizar prioridad de brandeo:', err);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div 
      style={{ 
        position: 'relative', 
        display: 'inline-flex', 
        alignItems: 'center',
        verticalAlign: 'middle',
        ...style 
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <select
        value={currentPrio.id}
        onChange={handleChange}
        disabled={!editable || isUpdating}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          backgroundColor: currentPrio.bg,
          color: currentPrio.color,
          border: `1px solid ${currentPrio.border}`,
          borderRadius: '8px',
          padding: '3px 22px 3px 8px',
          fontWeight: '800',
          fontSize: '0.72rem',
          letterSpacing: '0.03em',
          cursor: editable ? 'pointer' : 'default',
          boxShadow: currentPrio.shadow,
          outline: 'none',
          transition: 'all 0.15s ease',
          opacity: isUpdating ? 0.7 : 1,
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 6px center',
          backgroundSize: '10px',
          textAlign: 'left'
        }}
        title="Prioridad de brandeo: Clic para delimitar entre Urgente, Medio o Bajo"
      >
        <option value="URGENTE" style={{ backgroundColor: '#1e293b', color: '#c084fc', fontWeight: '700' }}>
          🔥 URGENTE
        </option>
        <option value="MEDIO" style={{ backgroundColor: '#1e293b', color: '#fbbf24', fontWeight: '700' }}>
          ⚡ MEDIO
        </option>
        <option value="BAJO" style={{ backgroundColor: '#1e293b', color: '#60a5fa', fontWeight: '700' }}>
          🟢 BAJO
        </option>
      </select>
    </div>
  );
}
