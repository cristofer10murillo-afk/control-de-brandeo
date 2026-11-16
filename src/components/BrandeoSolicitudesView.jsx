import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  PackageCheck, 
  Clock, 
  Calendar, 
  Plus, 
  Minus, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Layers, 
  Send, 
  User, 
  FileText, 
  ArrowRight, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { getCurrentPeriodInfo } from '../utils/dateUtils';
import { calculateWeeklyOrderSummary, getStockStatus } from '../utils/inventarioUtils';

export default function BrandeoSolicitudesView({
  inventario = [],
  solicitudes = [],
  onCreateSolicitud,
  onRecibirSolicitud,
  activeBrander = '',
  theme
}) {
  // Cart state: map of modelId -> quantity
  const [cart, setCart] = useState({});
  const [solicitante, setSolicitante] = useState(activeBrander || localStorage.getItem('last_brander_name') || '');
  const [notas, setNotas] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tab for list of orders: 'todas' | 'pendientes' | 'recibidas'
  const [filtroEstado, setFiltroEstado] = useState('pendientes');

  // Selected week for weekly difference analysis (defaults to current week)
  const currentPeriod = useMemo(() => getCurrentPeriodInfo(), []);
  const [semanaSeleccionada, setSemanaSeleccionada] = useState(currentPeriod.semanaName);

  // Cart operations
  const handleUpdateCart = (modelId, delta) => {
    setCart(prev => {
      const current = prev[modelId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[modelId];
        return copy;
      }
      return { ...prev, [modelId]: next };
    });
  };

  const handleSetCartExact = (modelId, value) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setCart(prev => {
      if (num === 0) {
        const copy = { ...prev };
        delete copy[modelId];
        return copy;
      }
      return { ...prev, [modelId]: num };
    });
  };

  const handleClearCart = () => {
    setCart({});
    setNotas('');
  };

  // Cart items calculated
  const cartItems = useMemo(() => {
    return Object.entries(cart).map(([id, cantidad]) => {
      const model = inventario.find(m => m.id === id) || { id, modelo: id, disponibles: 0 };
      return {
        id,
        modelo: model.modelo,
        cantidad,
        disponiblesActual: model.disponibles || 0
      };
    }).filter(i => i.cantidad > 0);
  }, [cart, inventario]);

  const totalCartUnits = cartItems.reduce((acc, curr) => acc + curr.cantidad, 0);

  // Submit cart order
  const handleSaveOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Por favor selecciona al menos una cantidad de brandeo para pedir.');
      return;
    }

    setIsSubmitting(true);
    try {
      const info = getCurrentPeriodInfo();
      const payload = {
        numeroSolicitud: `PED-${info.year}-W${info.semanaNum}-${Date.now().toString().slice(-4)}`,
        fechaSolicitud: info.fechaCorta,
        horaSolicitud: info.horaCorta,
        timestampSolicitud: info.timestamp,
        semana: info.semanaName,
        semanaNum: info.semanaNum,
        mes: info.mesName,
        año: info.year,
        mesAño: info.mesAño,
        solicitadoPor: solicitante.trim() || 'Técnico de Taller',
        notas: notas.trim(),
        estado: 'PENDIENTE',
        items: cartItems.map(item => ({
          id: item.id,
          modelo: item.modelo,
          cantidad: item.cantidad
        })),
        totalUnidades: totalCartUnits,
        fechaRecepcion: null,
        horaRecepcion: null,
        recibidoPor: null,
        createdAt: Date.now()
      };

      if (solicitante.trim()) {
        localStorage.setItem('last_brander_name', solicitante.trim());
      }

      await onCreateSolicitud(payload);
      handleClearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Weekly difference calculation
  const weeklySummary = useMemo(() => {
    return calculateWeeklyOrderSummary(solicitudes, semanaSeleccionada, currentPeriod.mesAño);
  }, [solicitudes, semanaSeleccionada, currentPeriod.mesAño]);

  // Filtered orders list
  const filteredSolicitudes = useMemo(() => {
    return solicitudes.filter(sol => {
      if (filtroEstado === 'pendientes') return sol.estado === 'PENDIENTE';
      if (filtroEstado === 'recibidas') return sol.estado === 'RECIBIDO';
      return true;
    });
  }, [solicitudes, filtroEstado]);

  const pendientesCount = useMemo(() => {
    return solicitudes.filter(s => s.estado === 'PENDIENTE').length;
  }, [solicitudes]);

  const recibidasCount = useMemo(() => {
    return solicitudes.filter(s => s.estado === 'RECIBIDO').length;
  }, [solicitudes]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* View Header */}
      <div className="card" style={{
        padding: '22px 24px',
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
        border: '1px solid rgba(2, 132, 199, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
          }}>
            <ShoppingCart size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Solicitud de Brandeo (Pedidos y Carrito Semanal)
            </h1>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Pide la cantidad de vinilos y kits por modelo para la semana. Cuando el pedido físico llegue al taller, márcalo como recibido con 1 clic para transferirlo al inventario disponible.
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Left is Order Builder (Cart Items), Right is Cart Summary & Checkout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        
        {/* Left Column: Modelos y Selector de Cantidades (Tipo Carrito de Compras) */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--primary)" />
              <span>Seleccionar Cantidades por Modelo</span>
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {inventario.length} modelos disponibles
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {inventario.map(item => {
              const qtyInCart = cart[item.id] || 0;
              const status = getStockStatus(item.disponibles, item.minimoAlerta || 3);

              return (
                <div
                  key={item.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    backgroundColor: qtyInCart > 0 ? 'var(--primary-light)' : 'var(--bg-surface)',
                    border: qtyInCart > 0 ? '1px solid #8b5cf6' : '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Model info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)' }}>
                        {item.modelo}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        padding: '1px 6px',
                        borderRadius: '6px',
                        backgroundColor: status.bg,
                        color: status.color
                      }}>
                        Stock actual: {item.disponibles}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Kit de vinilos para restauración y alistamiento
                    </span>
                  </div>

                  {/* Quantity Stepper & Presets */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Quick Preset buttons */}
                    <div style={{ display: 'inline-flex', gap: '3px' }}>
                      <button
                        type="button"
                        onClick={() => handleUpdateCart(item.id, 5)}
                        style={{
                          padding: '3px 7px',
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-card)',
                          color: 'var(--text-muted)',
                          cursor: 'pointer'
                        }}
                        title="Sumar 5 kits"
                      >
                        +5
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateCart(item.id, 10)}
                        style={{
                          padding: '3px 7px',
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-card)',
                          color: 'var(--text-muted)',
                          cursor: 'pointer'
                        }}
                        title="Sumar 10 kits"
                      >
                        +10
                      </button>
                    </div>

                    {/* Stepper: Minus, Input, Plus */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => handleUpdateCart(item.id, -1)}
                        disabled={qtyInCart <= 0}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-card)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: qtyInCart > 0 ? 'pointer' : 'not-allowed',
                          color: qtyInCart > 0 ? 'var(--text-main)' : 'var(--text-muted)'
                        }}
                      >
                        <Minus size={14} />
                      </button>

                      <input
                        type="number"
                        min="0"
                        value={qtyInCart || ''}
                        placeholder="0"
                        onChange={(e) => handleSetCartExact(item.id, e.target.value)}
                        style={{
                          width: '46px',
                          height: '32px',
                          textAlign: 'center',
                          fontWeight: '800',
                          fontSize: '0.92rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-card)',
                          color: qtyInCart > 0 ? 'var(--primary)' : 'var(--text-main)'
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => handleUpdateCart(item.id, 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: '#8b5cf6',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Resumen del Pedido (Cart Checkout Panel) */}
        <div className="card" style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '16px',
          border: '1px solid #8b5cf6',
          boxShadow: '0 4px 16px rgba(139, 92, 246, 0.15)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart size={20} color="#8b5cf6" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                  Resumen de la Solicitud
                </h2>
              </div>
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearCart}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--danger)',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 size={13} />
                  <span>Limpiar</span>
                </button>
              )}
            </div>

            {/* List of items in cart */}
            {cartItems.length === 0 ? (
              <div style={{
                padding: '30px 16px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '10px',
                border: '1px dashed var(--border-color)',
                color: 'var(--text-muted)'
              }}>
                <ShoppingCart size={32} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
                <p style={{ margin: 0, fontWeight: '600', fontSize: '0.88rem' }}>
                  El carrito de pedidos está vacío
                </p>
                <span style={{ fontSize: '0.76rem' }}>
                  Usa los botones (+) de la izquierda para seleccionar los brandeos requeridos.
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {cartItems.map(item => (
                  <div
                    key={item.id}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.86rem'
                    }}
                  >
                    <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                      {item.modelo}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '900', color: '#8b5cf6', fontSize: '1rem' }}>
                        {item.cantidad} kits
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSetCartExact(item.id, 0)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Total Counter */}
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '4px'
                }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    Total de Unidades a Pedir:
                  </span>
                  <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#8b5cf6' }}>
                    {totalCartUnits} kits
                  </span>
                </div>
              </div>
            )}

            {/* Inputs: Solicitado Por & Notas */}
            <form onSubmit={handleSaveOrder} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                  <User size={14} color="var(--primary)" />
                  <span>Solicitado por:</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre de quien hace el pedido..."
                  value={solicitante}
                  onChange={(e) => setSolicitante(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                  <FileText size={14} color="var(--primary)" />
                  <span>Notas o Justificación del Pedido (Opcional):</span>
                </label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Ej: Para máquinas que entran el martes, o ampliación de pedido semanal..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                />
              </div>

              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="var(--info)" />
                <span>
                  Se registrará para <strong>{currentPeriod.semanaName}</strong> ({currentPeriod.fechaCorta} a las {currentPeriod.horaCorta})
                </span>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={cartItems.length === 0 || isSubmitting}
                style={{
                  height: '44px',
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  gap: '8px',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
                  marginTop: '8px'
                }}
              >
                <Send size={18} />
                <span>{isSubmitting ? 'Guardando Solicitud...' : `Guardar Solicitud (${totalCartUnits} kits)`}</span>
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Control Semanal y Diferencia de Pedidos (Weekly Difference Tracking) */}
      <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--info)" />
              <span>Control Semanal y Diferencia de Brandeos</span>
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Monitorea lo pedido en la semana contra lo recibido. Si necesitas pedir más brandeos adicionales, aquí puedes ver la diferencia acumulada.
            </p>
          </div>

          {/* Selector de semana */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>
              Semana:
            </span>
            <select
              className="form-control"
              value={semanaSeleccionada}
              onChange={(e) => setSemanaSeleccionada(e.target.value)}
              style={{ width: '140px', height: '34px', fontSize: '0.84rem' }}
            >
              {['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'].map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Weekly Metrics Summary Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px'
        }}>
          <div style={{
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)'
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Pedido en {semanaSeleccionada}
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0284c7' }}>
              {weeklySummary.totalSolicitadas} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>kits</span>
            </div>
          </div>

          <div style={{
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)'
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--success)', textTransform: 'uppercase' }}>
              Ya Recibido en Taller
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--success)' }}>
              {weeklySummary.totalRecibidas} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>kits</span>
            </div>
          </div>

          <div style={{
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.25)'
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--warning)', textTransform: 'uppercase' }}>
              Pendiente de Entrega
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--warning)' }}>
              {weeklySummary.totalPendientes} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>kits</span>
            </div>
          </div>
        </div>

        {/* Model-by-model weekly breakdown table */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '8px 12px', fontWeight: '700' }}>Modelo de Máquina</th>
                <th style={{ padding: '8px 12px', fontWeight: '700', textAlign: 'center' }}>Total Solicitado</th>
                <th style={{ padding: '8px 12px', fontWeight: '700', textAlign: 'center' }}>Recibido</th>
                <th style={{ padding: '8px 12px', fontWeight: '700', textAlign: 'center' }}>Por Recibir</th>
                <th style={{ padding: '8px 12px', fontWeight: '700', textAlign: 'center' }}>Stock Disponible</th>
              </tr>
            </thead>
            <tbody>
              {inventario.map(item => {
                const row = weeklySummary.totalsByModel[item.modelo] || { solicitadas: 0, recibidas: 0, pendientes: 0 };
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: '700', color: 'var(--text-main)' }}>
                      {item.modelo}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: '700', color: '#0284c7' }}>
                      {row.solicitadas}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: '700', color: 'var(--success)' }}>
                      {row.recibidas}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: '700', color: row.pendientes > 0 ? '#f59e0b' : 'var(--text-muted)' }}>
                      {row.pendientes}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: '800' }}>
                      {item.disponibles}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historial de Solicitudes y Recepción de Pedidos */}
      <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PackageCheck size={18} color="var(--success)" />
              <span>Historial de Solicitudes de Pedido</span>
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Revisa los pedidos realizados y haz clic en "Marcar como Recibido" cuando el paquete llegue a bodega para sumar las unidades al stock disponible.
            </p>
          </div>

          {/* Filter tabs: Pendientes vs Recibidas */}
          <div style={{ display: 'inline-flex', gap: '4px', backgroundColor: 'var(--bg-surface)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button
              type="button"
              onClick={() => setFiltroEstado('pendientes')}
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: '700',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filtroEstado === 'pendientes' ? '#f59e0b' : 'transparent',
                color: filtroEstado === 'pendientes' ? '#ffffff' : 'var(--text-main)',
                transition: 'all 0.15s ease'
              }}
            >
              ⏳ Pendientes ({pendientesCount})
            </button>
            <button
              type="button"
              onClick={() => setFiltroEstado('recibidas')}
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: '700',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filtroEstado === 'recibidas' ? 'var(--success)' : 'transparent',
                color: filtroEstado === 'recibidas' ? '#ffffff' : 'var(--text-main)',
                transition: 'all 0.15s ease'
              }}
            >
              ✅ Recibidas ({recibidasCount})
            </button>
            <button
              type="button"
              onClick={() => setFiltroEstado('todas')}
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: '700',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filtroEstado === 'todas' ? 'var(--primary)' : 'transparent',
                color: filtroEstado === 'todas' ? '#ffffff' : 'var(--text-main)',
                transition: 'all 0.15s ease'
              }}
            >
              Todas ({solicitudes.length})
            </button>
          </div>
        </div>

        {/* Orders list */}
        {filteredSolicitudes.length === 0 ? (
          <div style={{
            padding: '36px 16px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '10px',
            color: 'var(--text-muted)'
          }}>
            <p style={{ margin: 0, fontWeight: '700', fontSize: '0.92rem' }}>
              No hay solicitudes {filtroEstado === 'pendientes' ? 'pendientes de recibir' : filtroEstado === 'recibidas' ? 'recibidas' : 'registradas'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredSolicitudes.map(sol => {
              const isPendiente = sol.estado === 'PENDIENTE';

              return (
                <div
                  key={sol.id}
                  style={{
                    padding: '16px 18px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-surface)',
                    border: isPendiente ? '1px solid #f59e0b' : '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    boxShadow: isPendiente ? '0 2px 10px rgba(245, 158, 11, 0.12)' : 'none'
                  }}
                >
                  {/* Order header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: '800',
                        backgroundColor: isPendiente ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: isPendiente ? '#f59e0b' : 'var(--success)',
                        border: isPendiente ? '1px solid #f59e0b' : '1px solid rgba(16, 185, 129, 0.3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {isPendiente ? '⏳ PENDIENTE DE LLEGADA' : '✅ RECIBIDO EN STOCK'}
                      </span>
                      <span style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                        {sol.numeroSolicitud}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        • {sol.semana} ({sol.fechaSolicitud} {sol.horaSolicitud})
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Solicitado por: <strong style={{ color: 'var(--text-main)' }}>{sol.solicitadoPor}</strong>
                    </div>
                  </div>

                  {/* Items chips */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {(sol.items || []).map((item, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          color: 'var(--text-main)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: '#8b5cf6', fontWeight: '900' }}>{item.cantidad}x</span>
                        <span>{item.modelo}</span>
                      </span>
                    ))}

                    <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-muted)', marginLeft: '6px' }}>
                      (Total: {sol.totalUnidades} kits)
                    </span>
                  </div>

                  {/* Notes if present */}
                  {sol.notas && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      📝 "{sol.notas}"
                    </div>
                  )}

                  {/* Footer Action: Marcar como Recibido */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                    paddingTop: '8px',
                    borderTop: '1px dashed var(--border-color)'
                  }}>
                    {isPendiente ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          ¿Llegó este pedido al taller? Presiona para ingresar los {sol.totalUnidades} kits al stock disponible.
                        </span>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={() => onRecibirSolicitud(sol)}
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: '800',
                            height: '36px',
                            gap: '8px',
                            boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          <PackageCheck size={16} />
                          <span>📦 Marcar como Recibido (Ingresar a Stock)</span>
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.78rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={15} />
                        <span>
                          Ingresado al inventario disponible el <strong>{sol.fechaRecepcion}</strong> a las <strong>{sol.horaRecepcion}</strong> {sol.recibidoPor && `por ${sol.recibidoPor}`}.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
