import React from 'react';
import { AlertCircle, CheckCircle2, Layers, Flame, TrendingUp } from 'lucide-react';

export default function BrandeoStats({
  totalEquipos = 0,
  pendientesCount = 0,
  brandeadosCount = 0,
  urgenteCount = 0,
  medioCount = 0,
  bajoCount = 0,
  activeTab,
  setActiveTab
}) {
  const percentage = totalEquipos > 0 ? Math.round((brandeadosCount / (pendientesCount + brandeadosCount || 1)) * 100) : 0;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {/* 1. Falta por Brandear (Pendientes) */}
      <div 
        onClick={() => setActiveTab('pendientes')}
        className="card"
        style={{
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          cursor: 'pointer',
          border: activeTab === 'pendientes' ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
          backgroundColor: activeTab === 'pendientes' ? 'var(--primary-light)' : 'var(--bg-card)',
          transition: 'all 0.2s ease',
          boxShadow: activeTab === 'pendientes' ? '0 4px 12px rgba(139, 92, 246, 0.25)' : 'var(--shadow-sm)'
        }}
      >
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          flexShrink: 0
        }}>
          <AlertCircle size={26} />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary)' }}>
            Falta por Brandear
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1 }}>
              {pendientesCount}
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              requieren brandeo
            </span>
          </div>
          {pendientesCount > 0 && (
            <div style={{ display: 'flex', gap: '5px', marginTop: '6px', fontSize: '0.7rem', flexWrap: 'wrap' }}>
              <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#c084fc', fontWeight: '800' }}>
                🔥 {urgenteCount} Urgentes
              </span>
              <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontWeight: '800' }}>
                ⚡ {medioCount} Medios
              </span>
              <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', fontWeight: '800' }}>
                🟢 {bajoCount} Bajos
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Equipos Brandeados (Realizados) */}
      <div 
        onClick={() => setActiveTab('brandeados')}
        className="card"
        style={{
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          cursor: 'pointer',
          border: activeTab === 'brandeados' ? '2px solid #10b981' : '1px solid var(--border-color)',
          backgroundColor: activeTab === 'brandeados' ? 'var(--success-light)' : 'var(--bg-card)',
          transition: 'all 0.2s ease',
          boxShadow: activeTab === 'brandeados' ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'var(--shadow-sm)'
        }}
      >
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--success)',
          flexShrink: 0
        }}>
          <CheckCircle2 size={26} />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--success)' }}>
            Equipos Brandeados
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1 }}>
              {brandeadosCount}
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              completados
            </span>
          </div>
        </div>
      </div>

      {/* 3. Total de Equipos Registrados */}
      <div 
        onClick={() => setActiveTab('todos')}
        className="card"
        style={{
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          cursor: 'pointer',
          border: activeTab === 'todos' ? '2px solid #0284c7' : '1px solid var(--border-color)',
          backgroundColor: activeTab === 'todos' ? 'var(--info-light)' : 'var(--bg-card)',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'rgba(2, 132, 199, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--info)',
          flexShrink: 0
        }}>
          <Layers size={26} />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--info)' }}>
            Total Registrados
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1 }}>
              {totalEquipos}
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              en base de datos
            </span>
          </div>
        </div>
      </div>

      {/* 4. Avance de Brandeo (%) */}
      <div 
        className="card"
        style={{
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--warning)',
          flexShrink: 0
        }}>
          <TrendingUp size={26} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--warning)' }}>
            Avance de Brandeo
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1 }}>
              {percentage}%
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {brandeadosCount} de {pendientesCount + brandeadosCount}
            </span>
          </div>
          {/* Progress bar */}
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${percentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #8b5cf6, #10b981)',
              borderRadius: '3px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
