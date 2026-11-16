import React from 'react';
import { AlertCircle, CheckCircle2, ListFilter, Download, RefreshCw, Sparkles } from 'lucide-react';

export default function BrandeoFilters({
  activeTab,
  setActiveTab,
  pendientesCount = 0,
  brandeadosCount = 0,
  totalCount = 0,
  tipoFiltro,
  setTipoFiltro,
  tiposDisponibles = [],
  onExportExcel
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      marginBottom: '20px'
    }}>
      {/* Upper navigation tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '12px'
      }}>
        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('pendientes')}
            style={{
              padding: '9px 18px',
              fontSize: '0.88rem',
              fontWeight: '700',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: activeTab === 'pendientes' ? '#8b5cf6' : 'var(--bg-surface)',
              color: activeTab === 'pendientes' ? '#ffffff' : 'var(--text-main)',
              boxShadow: activeTab === 'pendientes' ? '0 4px 10px rgba(139, 92, 246, 0.3)' : 'var(--shadow-sm)',
              transition: 'all 0.2s ease'
            }}
          >
            <AlertCircle size={17} />
            <span>Pendientes por Brandear</span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: activeTab === 'pendientes' ? 'rgba(255, 255, 255, 0.25)' : 'var(--primary-light)',
              color: activeTab === 'pendientes' ? '#ffffff' : 'var(--primary)'
            }}>
              {pendientesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('brandeados')}
            style={{
              padding: '9px 18px',
              fontSize: '0.88rem',
              fontWeight: '700',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: activeTab === 'brandeados' ? '#10b981' : 'var(--bg-surface)',
              color: activeTab === 'brandeados' ? '#ffffff' : 'var(--text-main)',
              boxShadow: activeTab === 'brandeados' ? '0 4px 10px rgba(16, 185, 129, 0.3)' : 'var(--shadow-sm)',
              transition: 'all 0.2s ease'
            }}
          >
            <CheckCircle2 size={17} />
            <span>Equipos Brandeados</span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: activeTab === 'brandeados' ? 'rgba(255, 255, 255, 0.25)' : 'var(--success-light)',
              color: activeTab === 'brandeados' ? '#ffffff' : 'var(--success)'
            }}>
              {brandeadosCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('todos')}
            style={{
              padding: '9px 18px',
              fontSize: '0.88rem',
              fontWeight: '700',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: activeTab === 'todos' ? '#0284c7' : 'var(--bg-surface)',
              color: activeTab === 'todos' ? '#ffffff' : 'var(--text-main)',
              boxShadow: activeTab === 'todos' ? '0 4px 10px rgba(2, 132, 199, 0.3)' : 'var(--shadow-sm)',
              transition: 'all 0.2s ease'
            }}
          >
            <ListFilter size={17} />
            <span>Todos los Equipos</span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: activeTab === 'todos' ? 'rgba(255, 255, 255, 0.25)' : 'var(--info-light)',
              color: activeTab === 'todos' ? '#ffffff' : 'var(--info)'
            }}>
              {totalCount}
            </span>
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onExportExcel}
            className="btn btn-outline"
            style={{ height: '38px', fontSize: '0.84rem' }}
            title="Descargar reporte en formato Excel"
          >
            <Download size={16} color="var(--success)" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Model / Type selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            Filtrar Modelo:
          </span>
          <select
            className="form-control"
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            style={{ width: '220px', height: '36px', fontSize: '0.85rem' }}
          >
            <option value="Todos">Todos los modelos</option>
            {tiposDisponibles.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {activeTab === 'pendientes' && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8b5cf6' }} />
              Al marcar la casilla, el equipo se actualizará y <strong>se quitará automáticamente el color en Gestor de Equipos</strong>.
            </span>
          )}
          {activeTab === 'brandeados' && (
            <span>Historial de equipos con brandeo completado exitosamente.</span>
          )}
          {activeTab === 'todos' && (
            <span>Catálogo general de equipos para activar o revisar necesidad de brandeo.</span>
          )}
        </div>
      </div>
    </div>
  );
}
