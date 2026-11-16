import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Minus, 
  ShoppingCart, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Truck, 
  Edit3, 
  PlusCircle, 
  X, 
  Layers,
  Sparkles
} from 'lucide-react';
import { getStockStatus, modelToSlug } from '../utils/inventarioUtils';

export default function BrandeoInventarioView({
  inventario = [],
  solicitudes = [],
  onUpdateStock,
  onAddNewModel,
  onNavigateToSolicitudes,
  theme
}) {
  const [modalNewModel, setModalNewModel] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [newModelStock, setNewModelStock] = useState('10');
  const [newModelMinimo, setNewModelMinimo] = useState('3');

  const [editModalItem, setEditModalItem] = useState(null);
  const [editStockValue, setEditStockValue] = useState('');

  // Calculate totals
  const totalDisponibles = inventario.reduce((acc, curr) => acc + (Number(curr.disponibles) || 0), 0);
  const totalConsumidos = inventario.reduce((acc, curr) => acc + (Number(curr.totalConsumidos) || 0), 0);

  // Calculate pending in-transit per model from pending solicitudes
  const inTransitMap = {};
  let totalEnTransito = 0;
  solicitudes.forEach(sol => {
    if (sol.estado === 'PENDIENTE') {
      (sol.items || []).forEach(item => {
        const id = item.id || modelToSlug(item.modelo);
        inTransitMap[id] = (inTransitMap[id] || 0) + (Number(item.cantidad) || 0);
        totalEnTransito += Number(item.cantidad) || 0;
      });
    }
  });

  // Handle adding new model
  const handleCreateNewModel = (e) => {
    e.preventDefault();
    if (!newModelName.trim()) return;
    const slug = modelToSlug(newModelName);
    onAddNewModel({
      id: slug,
      modelo: newModelName.trim(),
      disponibles: Math.max(0, parseInt(newModelStock, 10) || 0),
      minimoAlerta: Math.max(1, parseInt(newModelMinimo, 10) || 3),
      totalConsumidos: 0,
      createdAt: Date.now()
    });
    setNewModelName('');
    setNewModelStock('10');
    setNewModelMinimo('3');
    setModalNewModel(false);
  };

  // Open edit stock modal
  const handleOpenEdit = (item) => {
    setEditModalItem(item);
    setEditStockValue(String(item.disponibles));
  };

  const handleSaveEditStock = (e) => {
    e.preventDefault();
    if (!editModalItem) return;
    const val = parseInt(editStockValue, 10);
    if (!isNaN(val) && val >= 0) {
      onUpdateStock(editModalItem.id, val);
    }
    setEditModalItem(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Top Banner / KPIs Header */}
      <div className="card" style={{
        padding: '22px 24px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(2, 132, 199, 0.08) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#8b5cf6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.35)'
              }}>
                <Package size={22} />
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Brandeo Disponible (Inventario de Kits)
              </h1>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '6px', maxWidth: '650px' }}>
              Control en tiempo real de los kits y vinilos disponibles por máquina. Al marcar un equipo como brandeado en la lista, se descuenta automáticamente 1 unidad del modelo seleccionado.
            </p>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setModalNewModel(true)}
              style={{ fontSize: '0.85rem', height: '40px', gap: '8px' }}
            >
              <PlusCircle size={16} color="var(--primary)" />
              <span>Agregar Nuevo Modelo</span>
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={onNavigateToSolicitudes}
              style={{ fontSize: '0.85rem', height: '40px', gap: '8px', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.35)' }}
            >
              <ShoppingCart size={16} />
              <span>Hacer Pedido Semanal (Carrito)</span>
            </button>
          </div>
        </div>

        {/* Global Stock Stats Counters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-color)'
        }}>
          {/* 1. Total Kits Disponibles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Total Kits Disponibles
              </span>
              <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1 }}>
                {totalDisponibles} <span style={{ fontSize: '0.78rem', fontWeight: '500', color: 'var(--text-muted)' }}>unidades</span>
              </div>
            </div>
          </div>

          {/* 2. Modelos Registrados */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'rgba(2, 132, 199, 0.15)',
              color: 'var(--info)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Layers size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Modelos Registrados
              </span>
              <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1 }}>
                {inventario.length} <span style={{ fontSize: '0.78rem', fontWeight: '500', color: 'var(--text-muted)' }}>tipos</span>
              </div>
            </div>
          </div>

          {/* 3. Solicitados en Tránsito */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Truck size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                En Tránsito (Pedidos)
              </span>
              <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1 }}>
                +{totalEnTransito} <span style={{ fontSize: '0.78rem', fontWeight: '500', color: 'var(--text-muted)' }}>por recibir</span>
              </div>
            </div>
          </div>

          {/* 4. Total Kits Consumidos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <TrendingUp size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Kits Utilizados
              </span>
              <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1 }}>
                {totalConsumidos} <span style={{ fontSize: '0.78rem', fontWeight: '500', color: 'var(--text-muted)' }}>brandeados</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Branding Kit Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {inventario.map(item => {
          const status = getStockStatus(item.disponibles, item.minimoAlerta || 3);
          const enTransito = inTransitMap[item.id] || inTransitMap[modelToSlug(item.modelo)] || 0;

          return (
            <div
              key={item.id}
              className="card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                position: 'relative',
                border: `1px solid ${status.border}`,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              {/* Card Header */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: status.bg,
                    color: status.color,
                    border: `1px solid ${status.border}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{status.badge}</span>
                    <span>{status.label}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    title="Ajustar saldo manual de stock"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      padding: '4px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Edit3 size={15} />
                  </button>
                </div>

                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  color: 'var(--text-main)',
                  margin: '0 0 4px 0'
                }}>
                  {item.modelo}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Alerta si baja de {item.minimoAlerta || 3} unidades
                </span>
              </div>

              {/* Big Stock Display */}
              <div style={{
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: '700', color: 'var(--text-muted)' }}>
                    Disponible
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '2.4rem', fontWeight: '900', color: status.color, lineHeight: 1 }}>
                      {item.disponibles}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                      kits
                    </span>
                  </div>
                </div>

                {/* In transit or consumidos info */}
                <div style={{ textAlign: 'right' }}>
                  {enTransito > 0 ? (
                    <div style={{
                      padding: '4px 8px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      color: '#f59e0b',
                      fontSize: '0.74rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Truck size={13} />
                      <span>+{enTransito} en camino</span>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span>✔️ {item.totalConsumidos || 0} usados</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stepper Buttons for Quick Adjustments */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <button
                  type="button"
                  onClick={() => onUpdateStock(item.id, Math.max(0, item.disponibles - 1))}
                  disabled={item.disponibles <= 0}
                  className="btn btn-outline"
                  style={{
                    flex: 1,
                    height: '36px',
                    padding: '0 8px',
                    fontSize: '0.8rem',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                  title="Descontar 1 kit manualmente"
                >
                  <Minus size={14} />
                  <span>Descontar -1</span>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateStock(item.id, item.disponibles + 1)}
                  className="btn btn-outline"
                  style={{
                    flex: 1,
                    height: '36px',
                    padding: '0 8px',
                    fontSize: '0.8rem',
                    justifyContent: 'center',
                    gap: '4px',
                    color: 'var(--success)'
                  }}
                  title="Sumar 1 kit recibido o devuelto"
                >
                  <Plus size={14} />
                  <span>Sumar +1</span>
                </button>
              </div>

              {/* Footer advice */}
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                {status.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Agregar Nuevo Modelo */}
      {modalNewModel && (
        <div className="modal-overlay" onClick={() => setModalNewModel(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--primary-light)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusCircle size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                  Nuevo Modelo de Brandeo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalNewModel(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewModel} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                  Nombre del Modelo de Máquina:
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Luce Zero, Canto, Kikko..."
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                    Stock Inicial:
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={newModelStock}
                    onChange={(e) => setNewModelStock(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                    Alerta Mínima:
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={newModelMinimo}
                    onChange={(e) => setNewModelMinimo(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setModalNewModel(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Registrar Modelo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ajuste Manual de Stock */}
      {editModalItem && (
        <div className="modal-overlay" onClick={() => setEditModalItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px' }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                Ajustar Stock: {editModalItem.modelo}
              </h3>
              <button
                type="button"
                onClick={() => setEditModalItem(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditStock} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                  Cantidad disponible en físico:
                </label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={editStockValue}
                  onChange={(e) => setEditStockValue(e.target.value)}
                  autoFocus
                  required
                />
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Ingresa el número real contado en el taller.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditModalItem(null)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                >
                  Guardar Ajuste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
