import React from 'react';
import { AlertCircle, CheckCircle2, ListFilter, Download, BarChart3 } from 'lucide-react';

export default function BrandeoFilters({
  activeTab,
  setActiveTab,
  pendientesCount = 0,
  brandeadosCount = 0,
  totalCount = 0,
  tipoFiltro,
  setTipoFiltro,
  tiposDisponibles = [],
  prioridadFiltro = 'TODAS',
  setPrioridadFiltro,
  urgenteCount = 0,
  medioCount = 0,
  bajoCount = 0,
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
        {/* Tab Buttons (Horizontal scroll on mobile) */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          maxWidth: '100%',
          paddingBottom: '4px',
          WebkitOverflowScrolling: 'touch'
        }}>
          {/* 1. Pendientes */}
          <button
            onClick={() => setActiveTab('pendientes')}
            style={{
              padding: '9px 16px',
              fontSize: '0.86rem',
              fontWeight: '700',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === 'pendientes' ? '#8b5cf6' : 'var(--bg-surface)',
              color: activeTab === 'pendientes' ? '#ffffff' : 'var(--text-main)',
              boxShadow: activeTab === 'pendientes' ? '0 4px 10px rgba(139, 92, 246, 0.3)' : 'var(--shadow-sm)',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <AlertCircle size={16} />
            <span>Pendientes</span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: '800',
              padding: '2px 7px',
              borderRadius: '10px',
              backgroundColor: activeTab === 'pendientes' ? 'rgba(255, 255, 255, 0.25)' : 'var(--primary-light)',
              color: activeTab === 'pendientes' ? '#ffffff' : 'var(--primary)'
            }}>
              {pendientesCount}
            </span>
          </button>

          {/* 2. Brandeados */}
          <button
            onClick={() => setActiveTab('brandeados')}
            style={{
              padding: '9px 16px',
              fontSize: '0.86rem',
              fontWeight: '700',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === 'brandeados' ? '#10b981' : 'var(--bg-surface)',
              color: activeTab === 'brandeados' ? '#ffffff' : 'var(--text-main)',
              boxShadow: activeTab === 'brandeados' ? '0 4px 10px rgba(16, 185, 129, 0.3)' : 'var(--shadow-sm)',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <CheckCircle2 size={16} />
            <span>Brandeados</span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: '800',
              padding: '2px 7px',
              borderRadius: '10px',
              backgroundColor: activeTab === 'brandeados' ? 'rgba(255, 255, 255, 0.25)' : 'var(--success-light)',
              color: activeTab === 'brandeados' ? '#ffffff' : 'var(--success)'
            }}>
              {brandeadosCount}
            </span>
          </button>

          {/* 3. Métricas por Semana y Mes */}
          <button
            onClick={() => setActiveTab('reportes')}
            style={{
              padding: '9px 16px',
              fontSize: '0.86rem',
              fontWeight: '700',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === 'reportes' ? '#6366f1' : 'var(--bg-surface)',
              color: activeTab === 'reportes' ? '#ffffff' : 'var(--text-main)',
              boxShadow: activeTab === 'reportes' ? '0 4px 10px rgba(99, 102, 241, 0.3)' : 'var(--shadow-sm)',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <BarChart3 size={16} />
            <span>Métricas Semanal / Mensual</span>
          </button>

          {/* 4. Todos los Equipos */}
          <button
            onClick={() => setActiveTab('todos')}
            style={{
              padding: '9px 16px',
              fontSize: '0.86rem',
              fontWeight: '700',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === 'todos' ? '#0284c7' : 'var(--bg-surface)',
              color: activeTab === 'todos' ? '#ffffff' : 'var(--text-main)',
              boxShadow: activeTab === 'todos' ? '0 4px 10px rgba(2, 132, 199, 0.3)' : 'var(--shadow-sm)',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <ListFilter size={16} />
            <span>Todos</span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: '800',
              padding: '2px 7px',
              borderRadius: '10px',
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

      {/* Filter Row: Model / Type selector + Priority Filter */}
      {activeTab !== 'reportes' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {/* Modelo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Modelo:
              </span>
              <select
                className="form-control"
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
                style={{ width: '180px', height: '36px', fontSize: '0.85rem' }}
              >
                <option value="Todos">Todos los modelos</option>
                {tiposDisponibles.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Prioridad */}
            {setPrioridadFiltro && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Prioridad:
                </span>
                <div style={{ display: 'inline-flex', gap: '3px', backgroundColor: 'var(--bg-surface)', padding: '2px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={() => setPrioridadFiltro('TODAS')}
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.78rem',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '700',
                      backgroundColor: prioridadFiltro === 'TODAS' ? 'var(--primary)' : 'transparent',
                      color: prioridadFiltro === 'TODAS' ? '#ffffff' : 'var(--text-main)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Todas
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrioridadFiltro('URGENTE')}
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.78rem',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '700',
                      backgroundColor: prioridadFiltro === 'URGENTE' ? '#8b5cf6' : 'transparent',
                      color: prioridadFiltro === 'URGENTE' ? '#ffffff' : 'var(--text-main)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    🔥 Urgente {urgenteCount > 0 && `(${urgenteCount})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrioridadFiltro('MEDIO')}
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.78rem',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '700',
                      backgroundColor: prioridadFiltro === 'MEDIO' ? '#f59e0b' : 'transparent',
                      color: prioridadFiltro === 'MEDIO' ? '#ffffff' : 'var(--text-main)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    ⚡ Medio {medioCount > 0 && `(${medioCount})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrioridadFiltro('BAJO')}
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.78rem',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '700',
                      backgroundColor: prioridadFiltro === 'BAJO' ? '#3b82f6' : 'transparent',
                      color: prioridadFiltro === 'BAJO' ? '#ffffff' : 'var(--text-main)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    🟢 Bajo {bajoCount > 0 && `(${bajoCount})`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {activeTab === 'pendientes' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8b5cf6' }} />
                Al marcar la casilla se guarda la <strong>fecha y hora exacta</strong> y se retira el color en Gestor de Equipos.
              </span>
            )}
            {activeTab === 'brandeados' && (
              <span>Historial con fecha y hora exacta de cada confirmación.</span>
            )}
            {activeTab === 'todos' && (
              <span>Catálogo general de equipos para activar o revisar necesidad de brandeo.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
