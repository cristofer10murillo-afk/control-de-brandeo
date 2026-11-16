export const DEFAULT_BRANDING_MODELS = [
  { id: 'opera-britt', modelo: 'Opera Britt', disponibles: 15, minimoAlerta: 3, totalConsumidos: 0 },
  { id: 'maestro-touch', modelo: 'Maestro Touch', disponibles: 8, minimoAlerta: 3, totalConsumidos: 0 },
  { id: 'opera-leyenda', modelo: 'Opera Leyenda', disponibles: 10, minimoAlerta: 3, totalConsumidos: 0 },
  { id: 'snack-britt', modelo: 'Snack Britt', disponibles: 10, minimoAlerta: 3, totalConsumidos: 0 },
  { id: 'snack-leyenda', modelo: 'Snack Leyenda', disponibles: 10, minimoAlerta: 3, totalConsumidos: 0 }
];

export const modelToSlug = (name = '') => {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || `modelo-${Date.now()}`;
};

export const getStockStatus = (disponibles = 0, minimo = 3) => {
  if (disponibles <= 0) {
    return {
      label: 'Agotado',
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.15)',
      border: '#f87171',
      badge: '🔴',
      description: 'Sin kits disponibles. ¡Requiere solicitud urgente!'
    };
  }
  if (disponibles <= minimo) {
    return {
      label: 'Stock Bajo',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.15)',
      border: '#fbbf24',
      badge: '🟡',
      description: `Quedan solo ${disponibles} unidades. Considerar nuevo pedido.`
    };
  }
  return {
    label: 'Disponible',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: '#34d399',
    badge: '🟢',
    description: 'Stock suficiente para operaciones normales.'
  };
};

/**
 * Normaliza nombres de modelo para buscar coincidencia en el inventario
 */
export const findMatchingModel = (tipoEquipo, inventario = []) => {
  if (!tipoEquipo || inventario.length === 0) return null;
  const clean = String(tipoEquipo).toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Coincidencia exacta
  const exact = inventario.find(item => item.modelo.toLowerCase().replace(/[^a-z0-9]/g, '') === clean);
  if (exact) return exact;

  // 2. Coincidencia por subcadena
  const partial = inventario.find(item => {
    const itemClean = item.modelo.toLowerCase().replace(/[^a-z0-9]/g, '');
    return clean.includes(itemClean) || itemClean.includes(clean);
  });
  if (partial) return partial;

  return inventario[0] || null;
};

/**
 * Calcula el resumen de solicitudes semanales y diferencias por modelo
 */
export const calculateWeeklyOrderSummary = (solicitudes = [], targetSemana = '', targetMesAño = '') => {
  const filtered = solicitudes.filter(sol => {
    if (targetSemana && sol.semana !== targetSemana) return false;
    if (targetMesAño && sol.mesAño !== targetMesAño) return false;
    return true;
  });

  const totalsByModel = {};
  let totalSolicitadas = 0;
  let totalRecibidas = 0;
  let totalPendientes = 0;

  filtered.forEach(sol => {
    const isRecibido = sol.estado === 'RECIBIDO';
    (sol.items || []).forEach(item => {
      const key = item.modelo || item.id;
      if (!totalsByModel[key]) {
        totalsByModel[key] = {
          modelo: item.modelo,
          solicitadas: 0,
          recibidas: 0,
          pendientes: 0
        };
      }

      totalsByModel[key].solicitadas += Number(item.cantidad) || 0;
      totalSolicitadas += Number(item.cantidad) || 0;

      if (isRecibido) {
        totalsByModel[key].recibidas += Number(item.cantidad) || 0;
        totalRecibidas += Number(item.cantidad) || 0;
      } else {
        totalsByModel[key].pendientes += Number(item.cantidad) || 0;
        totalPendientes += Number(item.cantidad) || 0;
      }
    });
  });

  return {
    solicitudesFiltradas: filtered,
    totalsByModel,
    totalSolicitadas,
    totalRecibidas,
    totalPendientes
  };
};
