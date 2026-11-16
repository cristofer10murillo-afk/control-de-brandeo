import React from 'react';
import { AlertCircle, CheckCircle2, Layers, Flame, TrendingUp, Package, ShoppingCart } from 'lucide-react';

export default function BrandeoStats({
  totalEquipos = 0,
  pendientesCount = 0,
  brandeadosCount = 0,
  urgenteCount = 0,
  medioCount = 0,
  bajoCount = 0,
  totalStockDisponible = 0,
  pedidosPendientesCount = 0,
  unidadesEnTransito = 0,
  activeTab,
  setActiveTab
}) {
  const percentage = totalEquipos > 0 ? Math.round((brandeadosCount / (pendientesCount + brandeadosCount || 1)) * 100) : 0;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
      gap: '14px',
      marginBottom: '20px'
    }}>
      {/* 1. Falta por Brandear (Pendientes) */}
      <div 
        onClick={() => setActiveTab('pendientes')}
        className="card"
        style={{
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          cursor: 'pointer',
          border: activeTab === 'pendientes' ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
          backgroundColor: activeTab === 'pendientes' ? 'var(--primary-light)' : 'var(--bg-card)',
          transition: 'all 0.2s ease',
          boxShadow: activeTab === 'pendientes' ? '0 4px 12px rgba(139, 92, 246, 0.25)' : 'var(--shadow-sm)'
        }}
      >
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          flexShrink: 0
        }}>
          <AlertCircle size={24} />
        </div>
        <div>
          <span style={{ fontSize: '0.74rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary)' }}>
            Falta por Brandear
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1, margin: 0 }}>
              {pendientesCount}
            </h2>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              requieren brandeo
            </span>
          </div>
          {pendientesCount > 0 && (
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px', fontSize: '0.68rem', flexWrap: 'wrap' }}>
              <span style={{ padding: '1px 5px', borderRadius: '4px', backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#c084fc', fontWeight: '800' }}>
                🔥 {urgenteCount} Urgentes
              </span>
              <span style={{ padding: '1px 5px', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontWeight: '800' }}>
                ⚡ {medioCount} Medios
              </span>
              <span style={{ padding: '1px 5px', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', fontWeight: '800' }}>
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
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          cursor: 'pointer',
          border: activeTab === 'brandeados' ? '2px solid #10b981' : '1px solid var(--border-color)',
          backgroundColor: activeTab === 'brandeados' ? 'var(--success-light)' : 'var(--bg-card)',
          transition: 'all 0.2s ease',
          boxShadow: activeTab === 'brandeados' ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'var(--shadow-sm)'
        }}
      >
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--success)',
          flexShrink: 0
        }}>
          <CheckCircle2 size={24} />
        </div>
        <div>
          <span style={{ fontSize: '0.74rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--success)' }}>
            Equipos Brandeados
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1, margin: 0 }}>
              {brandeadosCount}
            </h2>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              completados
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            Avance global: {percentage}%
          </span>
        </div>
      </div>

      {/* 3. Brandeo Disponible (Stock de Vinilos/Kits) */}
      <div 
        onClick={() => setActiveTab('inventario')}
        className="card"
        style={{
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          cursor: 'pointer',
          border: activeTab === 'inventario' ? '2px solid #06b6d4' : '1px solid var(--border-color)',
          backgroundColor: activeTab === 'inventario' ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-card)',
          transition: 'all 0.2s ease',
          boxShadow: activeTab === 'inventario' ? '0 4px 12px rgba(6, 182, 212, 0.25)' : 'var(--shadow-sm)'
        }}
      >
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          backgroundColor: 'rgba(6, 182, 212, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#06b6d4',
          flexShrink: 0
        }}>
          <Package size={24} />
        </div>
        <div>
          <span style={{ fontSize: '0.74rem', fontWeight: '700', textTransform: 'uppercase', color: '#06b6d4' }}>
            Brandeo Disponible
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1, margin: 0 }}>
              {totalStockDisponible}
            </h2>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              kits en taller
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: '600', marginTop: '4px', display: 'block' }}>
            📦 Ver stock por máquina ➔
          </span>
        </div>
      </div>

      {/* 4. Solicitudes de Brandeo (Pedidos Semanales) */}
      <div 
        onClick={() => setActiveTab('solicitudes')}
        className="card"
        style={{
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          cursor: 'pointer',
          border: activeTab === 'solicitudes' ? '2px solid #f59e0b' : '1px solid var(--border-color)',
          backgroundColor: activeTab === 'solicitudes' ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-card)',
          transition: 'all 0.2s ease',
          boxShadow: activeTab === 'solicitudes' ? '0 4px 12px rgba(245, 158, 11, 0.25)' : 'var(--shadow-sm)'
        }}
      >
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f59e0b',
          flexShrink: 0
        }}>
          <ShoppingCart size={24} />
        </div>
        <div>
          <span style={{ fontSize: '0.74rem', fontWeight: '700', textTransform: 'uppercase', color: '#f59e0b' }}>
            Solicitudes / Pedidos
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1, margin: 0 }}>
              {pedidosPendientesCount}
            </h2>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {pedidosPendientesCount === 1 ? 'pedido pendiente' : 'pedidos pendientes'}
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: '600', marginTop: '4px', display: 'block' }}>
            🚚 {unidadesEnTransito} kits en camino ➔
          </span>
        </div>
      </div>
    </div>
  );
}
