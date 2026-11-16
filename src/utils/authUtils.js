export const DEFAULT_USERS = [
  {
    id: 'user-master-001',
    nombre: 'Cristofer Murillo',
    email: 'cristofer10murillo@gmail.com',
    password: 'Shariton24',
    rol: 'master', // 'master' | 'admin' | 'brandeador'
    createdAt: Date.now()
  },
  {
    id: 'user-admin-002',
    nombre: 'Admin Secundario',
    email: 'admin@taller.com',
    password: 'Admin2026*',
    rol: 'admin',
    createdAt: Date.now()
  },
  {
    id: 'user-brandeador-003',
    nombre: 'Técnico Brandeador',
    email: 'brandeo@taller.com',
    password: 'Brandeo2026*',
    rol: 'brandeador',
    createdAt: Date.now()
  }
];

export const getRoleInfo = (rol = 'brandeador') => {
  switch (rol.toLowerCase()) {
    case 'master':
      return {
        label: 'Master (Control Total)',
        badge: '👑 Master',
        color: '#c084fc',
        bg: 'rgba(192, 132, 252, 0.15)',
        border: '#a855f7',
        description: 'Acceso total al sistema, inventario, solicitudes, reportes y gestión de usuarios.'
      };
    case 'admin':
      return {
        label: 'Admin Secundario',
        badge: '🛡️ Admin Secundario',
        color: '#38bdf8',
        bg: 'rgba(56, 189, 248, 0.15)',
        border: '#0284c7',
        description: 'Gestión operativa completa: pedidos, inventario disponible, equipos y métricas.'
      };
    case 'brandeador':
    default:
      return {
        label: 'Brandeador',
        badge: '🎨 Brandeador',
        color: '#34d399',
        bg: 'rgba(52, 211, 153, 0.15)',
        border: '#10b981',
        description: 'Vista exclusiva de pendientes: marcar máquinas brandeadas y descontar kits de vinilo usados.'
      };
  }
};

/**
 * Valida si un rol tiene permiso para acceder a una pestaña
 */
export const canAccessTab = (user, tabId) => {
  if (!user) return false;
  const rol = (user.rol || 'brandeador').toLowerCase();
  
  // Master y Admin tienen acceso a todo
  if (rol === 'master' || rol === 'admin') return true;

  // Brandeador solo tiene acceso a 'pendientes'
  if (rol === 'brandeador') {
    return tabId === 'pendientes';
  }

  return false;
};
