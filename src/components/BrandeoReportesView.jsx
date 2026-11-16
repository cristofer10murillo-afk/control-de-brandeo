import React, { useState, useMemo } from 'react';
import { Calendar, BarChart3, Clock, User, Download, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { getSemanaLabel, MESES_NOMBRES } from '../utils/dateUtils';
import { exportBrandeoToExcel } from '../utils/exportUtils';

export default function BrandeoReportesView({ equipos = [], theme }) {
  // Only records where brandeo was actually completed AND has timestamp
  const brandeados = useMemo(() => {
    return equipos
      .filter(eq => eq.brandeoRealizado === true && (eq.timestampBrandeo || eq.fechaBrandeo))
      .sort((a, b) => (b.timestampBrandeo || 0) - (a.timestampBrandeo || 0));
  }, [equipos]);

  // Available Months
  const mesesDisponibles = useMemo(() => {
    const set = new Set();
    brandeados.forEach(eq => {
      if (eq.mesAñoBrandeo) {
        set.add(eq.mesAñoBrandeo);
      } else if (eq.timestampBrandeo) {
        const d = new Date(eq.timestampBrandeo);
        set.add(`${MESES_NOMBRES[d.getMonth()]} ${d.getFullYear()}`);
      }
    });

    const arr = Array.from(set);
    if (arr.length === 0) {
      const now = new Date();
      arr.push(`${MESES_NOMBRES[now.getMonth()]} ${now.getFullYear()}`);
    }
    return arr;
  }, [brandeados]);

  const [selectedMes, setSelectedMes] = useState(() => mesesDisponibles[0] || 'Todos');
  const [selectedSemana, setSelectedSemana] = useState('Todas');

  // Filtered by selected month and week
  const filteredBrandeos = useMemo(() => {
    return brandeados.filter(eq => {
      // Filter by Month
      if (selectedMes !== 'Todos') {
        const eqMes = eq.mesAñoBrandeo || (eq.timestampBrandeo ? `${MESES_NOMBRES[new Date(eq.timestampBrandeo).getMonth()]} ${new Date(eq.timestampBrandeo).getFullYear()}` : '');
        if (eqMes !== selectedMes) return false;
      }

      // Filter by Week
      if (selectedSemana !== 'Todas') {
        const eqSemana = eq.semanaBrandeo || 'Semana 1';
        if (eqSemana !== selectedSemana) return false;
      }

      return true;
    });
  }, [brandeados, selectedMes, selectedSemana]);

  // Breakdown by weeks for the selected month
  const semanasBreakdown = useMemo(() => {
    const weeks = {
      'Semana 1': [],
      'Semana 2': [],
      'Semana 3': [],
      'Semana 4': [],
      'Semana 5': []
    };

    const mesList = brandeados.filter(eq => {
      if (selectedMes === 'Todos') return true;
      const eqMes = eq.mesAñoBrandeo || (eq.timestampBrandeo ? `${MESES_NOMBRES[new Date(eq.timestampBrandeo).getMonth()]} ${new Date(eq.timestampBrandeo).getFullYear()}` : '');
      return eqMes === selectedMes;
    });

    mesList.forEach(eq => {
      const s = eq.semanaBrandeo || 'Semana 1';
      if (weeks[s]) {
        weeks[s].push(eq);
      }
    });

    return weeks;
  }, [brandeados, selectedMes]);

  // Group by brander technicians
  const tecnicosStats = useMemo(() => {
    const counts = {};
    filteredBrandeos.forEach(eq => {
      const tech = eq.usuarioBrandeo || 'Sin Asignar';
      counts[tech] = (counts[tech] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [filteredBrandeos]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Filter Bar */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Month selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Mes:</span>
            <select
              className="form-control"
              value={selectedMes}
              onChange={(e) => {
                setSelectedMes(e.target.value);
                setSelectedSemana('Todas');
              }}
              style={{ width: '180px', height: '38px', fontSize: '0.85rem' }}
            >
              <option value="Todos">Todos los meses</option>
              {mesesDisponibles.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Week selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Semana:</span>
            <select
              className="form-control"
              value={selectedSemana}
              onChange={(e) => setSelectedSemana(e.target.value)}
              style={{ width: '160px', height: '38px', fontSize: '0.85rem' }}
            >
              <option value="Todas">Todas las semanas</option>
              {['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={() => exportBrandeoToExcel(filteredBrandeos, `Reporte_Brandeos_${selectedMes}_${selectedSemana}`)}
          className="btn btn-outline"
          style={{ height: '38px', fontSize: '0.85rem' }}
          title="Exportar reporte de este periodo a Excel"
        >
          <Download size={16} color="var(--success)" />
          <span>Exportar Reporte ({filteredBrandeos.length})</span>
        </button>
      </div>

      {/* KPI Cards for the selected period */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--success)' }}>
            Total Brandeados en {selectedMes}
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
            {brandeados.filter(eq => selectedMes === 'Todos' || eq.mesAñoBrandeo === selectedMes).length}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>equipos con brandeo aplicado</span>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #8b5cf6' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary)' }}>
            Filtro Actual ({selectedSemana})
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
            {filteredBrandeos.length}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>en el rango seleccionado</span>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #0284c7' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--info)' }}>
            Técnicos Activos
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
            {tecnicosStats.length}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {tecnicosStats[0] ? `Líder: ${tecnicosStats[0][0]} (${tecnicosStats[0][1]})` : 'Sin registros'}
          </span>
        </div>
      </div>

      {/* Interactive Weekly Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={18} color="var(--primary)" />
          Desglose Semanal de {selectedMes}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' }}>
          {Object.entries(semanasBreakdown).map(([semName, items]) => {
            const isSelected = selectedSemana === semName;
            return (
              <div
                key={semName}
                onClick={() => setSelectedSemana(isSelected ? 'Todas' : semName)}
                className="card"
                style={{
                  padding: '14px 16px',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
                  backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-card)',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 10px rgba(139, 92, 246, 0.25)' : 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                    {semName}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    backgroundColor: items.length > 0 ? 'var(--success-light)' : 'var(--bg-surface-hover)',
                    color: items.length > 0 ? 'var(--success)' : 'var(--text-muted)'
                  }}>
                    {items.length}
                  </span>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {getSemanaLabel(semName, selectedMes.split(' ')[0])}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Records Table with Exact Date & Time */}
      <div className="card" style={{ padding: 0, overflowX: 'auto', borderRadius: '12px' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="var(--success)" />
            Registros de Brandeo Realizado ({filteredBrandeos.length})
          </h4>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Ordenados por fecha y hora exacta
          </span>
        </div>

        {filteredBrandeos.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No hay registros de brandeo realizado en el periodo seleccionado.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead style={{ backgroundColor: 'var(--table-header-bg)', color: '#ffffff' }}>
              <tr>
                <th style={{ padding: '12px 16px', fontWeight: '700', textTransform: 'uppercase' }}>Fecha y Hora Exacta</th>
                <th style={{ padding: '12px 16px', fontWeight: '700', textTransform: 'uppercase' }}>Semana</th>
                <th style={{ padding: '12px 16px', fontWeight: '700', textTransform: 'uppercase' }}>Equipo / Modelo</th>
                <th style={{ padding: '12px 16px', fontWeight: '700', textTransform: 'uppercase' }}>Activo</th>
                <th style={{ padding: '12px 16px', fontWeight: '700', textTransform: 'uppercase' }}>Serie</th>
                <th style={{ padding: '12px 16px', fontWeight: '700', textTransform: 'uppercase' }}>Cliente</th>
                <th style={{ padding: '12px 16px', fontWeight: '700', textTransform: 'uppercase' }}>Persona que Brandeó</th>
                <th style={{ padding: '12px 16px', fontWeight: '700', textTransform: 'uppercase' }}>Notas</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrandeos.map(eq => (
                <tr
                  key={eq.id}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.05)' : '#ffffff',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {/* Fecha y Hora Exacta */}
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', fontWeight: '700', color: 'var(--success)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} />
                      <span>{eq.fechaBrandeo || 'N/A'}</span>
                    </div>
                  </td>

                  {/* Semana */}
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)'
                    }}>
                      {eq.semanaBrandeo || 'Semana 1'}
                    </span>
                  </td>

                  {/* Equipo */}
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0284c7' }}>
                    {eq.tipoEquipo || eq.modelo || 'N/A'}
                  </td>

                  {/* Activo */}
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                    {eq.activo || 'N/A'}
                  </td>

                  {/* Serie */}
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                    {eq.serie || 'N/A'}
                  </td>

                  {/* Cliente */}
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>
                    {eq.cliente || 'Sin Cliente'}
                  </td>

                  {/* Persona que Brandeó */}
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--text-main)', fontWeight: '600' }}>
                      <User size={13} color="var(--primary)" />
                      {eq.usuarioBrandeo || 'Técnico de Brandeo'}
                    </span>
                  </td>

                  {/* Notas */}
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontStyle: eq.comentariosBrandeo ? 'normal' : 'italic' }}>
                    {eq.comentariosBrandeo || 'Sin notas'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
