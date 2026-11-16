import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, doc, updateDoc, setDoc, addDoc, deleteDoc, increment } from 'firebase/firestore';
import confetti from 'canvas-confetti';
import { db } from './firebase';
import BrandeoNavbar from './components/BrandeoNavbar';
import BrandeoStats from './components/BrandeoStats';
import BrandeoFilters from './components/BrandeoFilters';
import BrandeoTable from './components/BrandeoTable';
import BrandeoReportesView from './components/BrandeoReportesView';
import BrandeoInventarioView from './components/BrandeoInventarioView';
import BrandeoSolicitudesView from './components/BrandeoSolicitudesView';
import ConfirmBrandeoModal from './components/ConfirmBrandeoModal';
import LoginScreen from './components/LoginScreen';
import UserManagementModal from './components/UserManagementModal';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { exportBrandeoToExcel } from './utils/exportUtils';
import { createBrandeoRecord, getCurrentPeriodInfo } from './utils/dateUtils';
import { DEFAULT_BRANDING_MODELS } from './utils/inventarioUtils';
import { DEFAULT_USERS } from './utils/authUtils';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function App() {
  // Authentication & Current User State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('brandeo_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [users, setUsers] = useState([]);
  const [showUsersModal, setShowUsersModal] = useState(false);

  // Firestore Data Collections
  const [equipos, setEquipos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false);

  // Appearance & Personalization
  const [theme, setTheme] = useState(() => localStorage.getItem('brandeo_theme') || 'dark');
  const [activeBrander, setActiveBrander] = useState(() => {
    if (currentUser?.nombre) return currentUser.nombre;
    return localStorage.getItem('last_brander_name') || '';
  });

  // Filters & Tabs: 'pendientes' | 'brandeados' | 'inventario' | 'solicitudes' | 'reportes' | 'todos'
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pendientes');
  const [tipoFiltro, setTipoFiltro] = useState('Todos');
  const [prioridadFiltro, setPrioridadFiltro] = useState('TODAS'); // 'TODAS' | 'URGENTE' | 'MEDIO' | 'BAJO'

  // Confirmation Modal
  const [modalEquipo, setModalEquipo] = useState(null);

  // PWA banner state
  const [showPWABanner, setShowPWABanner] = useState(true);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Sync theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('brandeo_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Restrict brandeador to only 'pendientes'
  useEffect(() => {
    if (currentUser && (currentUser.rol || '').toLowerCase() === 'brandeador') {
      if (activeTab !== 'pendientes') {
        setActiveTab('pendientes');
      }
    }
  }, [currentUser, activeTab]);

  // 1. Real-time synchronization with Firestore "usuarios_brandeo" collection
  useEffect(() => {
    if (!db) return;
    const usersRef = collection(db, 'usuarios_brandeo');

    const unsubscribe = onSnapshot(
      usersRef,
      (snapshot) => {
        if (snapshot.empty) {
          // Auto-seed default users:
          // Master: cristofer10murillo@gmail.com / Shariton24
          // Admin: admin@taller.com / Admin2026*
          // Brandeador: brandeo@taller.com / Brandeo2026*
          DEFAULT_USERS.forEach(async (u) => {
            try {
              await setDoc(doc(db, 'usuarios_brandeo', u.id), {
                ...u,
                createdAt: Date.now()
              });
            } catch (e) {
              console.error('Error seeding user:', e);
            }
          });
          setUsers(DEFAULT_USERS);
        } else {
          const list = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          setUsers(list);
        }
      },
      (err) => {
        console.error('Error fetching usuarios_brandeo:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Real-time synchronization with Firestore "equipos" collection
  useEffect(() => {
    if (!db) {
      setError('Firebase no está configurado. Por favor verifica las credenciales en .env');
      setLoading(false);
      return;
    }

    setLoading(true);
    const equiposRef = collection(db, 'equipos');

    const unsubscribe = onSnapshot(
      equiposRef,
      (snapshot) => {
        const list = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        // Sort: most recent first
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setEquipos(list);
        setLoading(false);
        setIsLive(true);
        setError(null);
      },
      (err) => {
        console.error('Error fetching equipos in Control de Brandeo:', err);
        setError('Error al sincronizar con Firebase. Verificando conexión...');
        setIsLive(false);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 3. Real-time synchronization with Firestore "inventario_brandeo" collection
  useEffect(() => {
    if (!db) return;
    const invRef = collection(db, 'inventario_brandeo');

    const unsubscribe = onSnapshot(
      invRef,
      (snapshot) => {
        if (snapshot.empty) {
          // Auto-seed default models:
          // Maestro: 8, Opera Britt: 15, Opera Leyenda: 10, Snack Britt: 10, Snack Leyenda: 10
          DEFAULT_BRANDING_MODELS.forEach(async (m) => {
            try {
              await setDoc(doc(db, 'inventario_brandeo', m.id), {
                ...m,
                createdAt: Date.now(),
                updatedAt: Date.now()
              });
            } catch (e) {
              console.error('Error seeding inventory model:', e);
            }
          });
        } else {
          const list = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          list.sort((a, b) => (a.modelo || '').localeCompare(b.modelo || ''));
          setInventario(list);
        }
      },
      (err) => {
        console.error('Error fetching inventario_brandeo:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  // 4. Real-time synchronization with Firestore "solicitudes_brandeo" collection
  useEffect(() => {
    if (!db) return;
    const solRef = collection(db, 'solicitudes_brandeo');

    const unsubscribe = onSnapshot(
      solRef,
      (snapshot) => {
        const list = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setSolicitudes(list);
      },
      (err) => {
        console.error('Error fetching solicitudes_brandeo:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  // Compute counts for Equipos
  const pendientesCount = useMemo(() => {
    return equipos.filter(eq => eq.requiereBrandeo === true).length;
  }, [equipos]);

  const brandeadosCount = useMemo(() => {
    return equipos.filter(eq => eq.brandeoRealizado === true).length;
  }, [equipos]);

  // Breakdown by priority for pending equipments
  const { urgenteCount, medioCount, bajoCount } = useMemo(() => {
    let u = 0, m = 0, b = 0;
    equipos.forEach(eq => {
      if (eq.requiereBrandeo === true) {
        const p = (eq.prioridadBrandeo || 'URGENTE').toUpperCase();
        if (p === 'MEDIO') m++;
        else if (p === 'BAJO') b++;
        else u++;
      }
    });
    return { urgenteCount: u, medioCount: m, bajoCount: b };
  }, [equipos]);

  const tiposDisponibles = useMemo(() => {
    const set = new Set();
    equipos.forEach(eq => {
      const t = (eq.tipoEquipo || eq.modelo || '').trim();
      if (t) set.add(t);
    });
    return Array.from(set).sort();
  }, [equipos]);

  // Compute counts for Inventario & Solicitudes
  const totalStockDisponible = useMemo(() => {
    return inventario.reduce((acc, curr) => acc + (Number(curr.disponibles) || 0), 0);
  }, [inventario]);

  const { pedidosPendientesCount, unidadesEnTransito } = useMemo(() => {
    let count = 0;
    let kits = 0;
    solicitudes.forEach(sol => {
      if (sol.estado === 'PENDIENTE') {
        count++;
        kits += Number(sol.totalUnidades) || 0;
      }
    });
    return { pedidosPendientesCount: count, unidadesEnTransito: kits };
  }, [solicitudes]);

  // Filtered equipments for list view
  const filteredEquipos = useMemo(() => {
    return equipos.filter(eq => {
      if (activeTab === 'pendientes') {
        if (!eq.requiereBrandeo) return false;
      } else if (activeTab === 'brandeados') {
        if (!eq.brandeoRealizado) return false;
      }

      // Prioridad filter (for pendientes or todos)
      if (prioridadFiltro !== 'TODAS') {
        const p = (eq.prioridadBrandeo || 'URGENTE').toUpperCase();
        if (p !== prioridadFiltro) return false;
      }

      if (tipoFiltro !== 'Todos') {
        const t = (eq.tipoEquipo || eq.modelo || '').trim().toLowerCase();
        if (t !== tipoFiltro.trim().toLowerCase()) return false;
      }

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const combined = [
          eq.tipoEquipo,
          eq.modelo,
          eq.activo,
          eq.serie,
          eq.cliente,
          eq.tecnico,
          eq.usuarioBrandeo,
          eq.tipoBrandeoUsado,
          eq.fechaBrandeo,
          eq.semanaBrandeo,
          eq.prioridadBrandeo
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!combined.includes(query)) return false;
      }

      return true;
    });
  }, [equipos, activeTab, tipoFiltro, prioridadFiltro, searchTerm]);

  // Launch confetti celebration
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  // Auth Handlers
  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('brandeo_auth_user', JSON.stringify(user));
    setActiveBrander(user.nombre);
    localStorage.setItem('last_brander_name', user.nombre);
    if ((user.rol || '').toLowerCase() === 'brandeador') {
      setActiveTab('pendientes');
    }
    triggerConfetti();
    showToast(`¡Bienvenido, ${user.nombre}!`, 'success');
  };

  const handleLogout = () => {
    if (window.confirm('¿Deseas cerrar sesión en Control de Brandeo?')) {
      setCurrentUser(null);
      localStorage.removeItem('brandeo_auth_user');
      showToast('Sesión cerrada correctamente.', 'info');
    }
  };

  const handleAddUser = async (userData) => {
    if (!db) return;
    try {
      await setDoc(doc(db, 'usuarios_brandeo', userData.id), userData);
      showToast(`Usuario "${userData.nombre}" registrado con éxito.`, 'success');
    } catch (e) {
      console.error('Error creating user:', e);
      showToast('Error al registrar usuario en Firebase.', 'danger');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'usuarios_brandeo', userId));
      showToast('Usuario eliminado con éxito.', 'info');
    } catch (e) {
      console.error('Error deleting user:', e);
      showToast('Error al eliminar usuario en Firebase.', 'danger');
    }
  };

  // Open confirmation modal
  const handleOpenConfirmModal = (eq) => {
    setModalEquipo(eq);
  };

  // Confirm Brandeo: Records timestamp, removes highlight, and DEDUCTS 1 unit from stock!
  const handleConfirmBrandeo = async (id, extraData = {}) => {
    if (!db) return;
    try {
      const branderToRecord = extraData.usuarioBrandeo || currentUser?.nombre || activeBrander || 'Técnico de Brandeo';

      const brandeoRecord = createBrandeoRecord({
        usuarioBrandeo: branderToRecord,
        comentariosBrandeo: extraData.comentariosBrandeo || '',
        tipoBrandeoUsado: extraData.tipoBrandeoUsado || ''
      });

      // 1. Guardar en equipos
      await updateDoc(doc(db, 'equipos', id), brandeoRecord);

      // 2. Descontar 1 unidad del inventario disponible
      let kitDescontado = null;
      if (extraData.inventarioId) {
        const itemInv = inventario.find(i => i.id === extraData.inventarioId);
        if (itemInv) {
          const nuevoSaldo = Math.max(0, (Number(itemInv.disponibles) || 0) - 1);
          await updateDoc(doc(db, 'inventario_brandeo', itemInv.id), {
            disponibles: nuevoSaldo,
            totalConsumidos: increment(1),
            updatedAt: Date.now()
          });
          kitDescontado = itemInv.modelo;
        }
      }

      setModalEquipo(null);
      triggerConfetti();
      const msgKit = kitDescontado ? ` y se descontó 1 kit de ${kitDescontado}` : '';
      showToast(`¡Brandeo guardado con éxito a las ${brandeoRecord.horaBrandeo}! Se retiró el color en Gestor de Equipos${msgKit}.`, 'success');
    } catch (err) {
      console.error('Error confirming brandeo:', err);
      showToast('Error al actualizar en Firebase. Intente nuevamente.', 'danger');
    }
  };

  // Update Stock manually (Master / Admin only)
  const handleUpdateStock = async (id, newDisponibles) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'inventario_brandeo', id), {
        disponibles: Math.max(0, newDisponibles),
        updatedAt: Date.now()
      });
      showToast('Stock de brandeo actualizado.', 'info');
    } catch (err) {
      console.error('Error updating stock:', err);
      showToast('Error al actualizar el stock.', 'danger');
    }
  };

  // Add new machine model to inventory (Master / Admin only)
  const handleAddNewModel = async (newModelData) => {
    if (!db) return;
    try {
      await setDoc(doc(db, 'inventario_brandeo', newModelData.id), {
        ...newModelData,
        updatedAt: Date.now()
      });
      showToast(`Modelo "${newModelData.modelo}" registrado en inventario.`, 'success');
    } catch (err) {
      console.error('Error adding new model:', err);
      showToast('Error al registrar nuevo modelo.', 'danger');
    }
  };

  // Save new weekly request / order (Master / Admin only)
  const handleCreateSolicitud = async (solicitudData) => {
    if (!db) return;
    try {
      await addDoc(collection(db, 'solicitudes_brandeo'), solicitudData);
      triggerConfetti();
      showToast(`¡Solicitud ${solicitudData.numeroSolicitud} guardada con éxito (${solicitudData.totalUnidades} kits)!`, 'success');
    } catch (err) {
      console.error('Error creating solicitud:', err);
      showToast('Error al guardar la solicitud de brandeo.', 'danger');
    }
  };

  // Mark request as received (Transfer to available inventory)
  const handleRecibirSolicitud = async (solicitud) => {
    if (!db) return;
    try {
      const info = getCurrentPeriodInfo();

      // 1. Ingresar cantidades al inventario disponible
      for (const item of (solicitud.items || [])) {
        const invItem = inventario.find(i => i.id === item.id || (i.modelo || '').toLowerCase() === (item.modelo || '').toLowerCase());
        if (invItem) {
          await updateDoc(doc(db, 'inventario_brandeo', invItem.id), {
            disponibles: increment(Number(item.cantidad) || 0),
            updatedAt: Date.now()
          });
        } else {
          // If model doesn't exist, create it
          await setDoc(doc(db, 'inventario_brandeo', item.id), {
            id: item.id,
            modelo: item.modelo,
            disponibles: Number(item.cantidad) || 0,
            minimoAlerta: 3,
            totalConsumidos: 0,
            createdAt: Date.now(),
            updatedAt: Date.now()
          });
        }
      }

      // 2. Marcar la solicitud como RECIBIDO
      await updateDoc(doc(db, 'solicitudes_brandeo', solicitud.id), {
        estado: 'RECIBIDO',
        fechaRecepcion: info.fechaCorta,
        horaRecepcion: info.horaCorta,
        timestampRecepcion: Date.now(),
        recibidoPor: currentUser?.nombre || activeBrander || 'Técnico de Taller',
        updatedAt: Date.now()
      });

      triggerConfetti();
      showToast(`¡Pedido ${solicitud.numeroSolicitud} recibido! Se agregaron ${solicitud.totalUnidades} kits al stock disponible.`, 'success');
    } catch (err) {
      console.error('Error receiving solicitud:', err);
      showToast('Error al ingresar el pedido al inventario.', 'danger');
    }
  };

  // Delete an individual order (Exclusive to Master)
  const handleDeleteSolicitud = async (solicitud) => {
    if (!db) return;
    if ((currentUser?.rol || '').toLowerCase() !== 'master') {
      showToast('Acceso denegado: Solo el Master puede eliminar solicitudes.', 'danger');
      return;
    }

    const isRecibido = solicitud.estado === 'RECIBIDO';
    let revertStock = false;

    if (isRecibido) {
      revertStock = window.confirm(
        `El pedido ${solicitud.numeroSolicitud} ya fue RECIBIDO en inventario.\n\n` +
        `¿Deseas RESTAR las unidades (${solicitud.totalUnidades} kits) del stock disponible al eliminarlo para no dejar sobrantes de prueba?\n\n` +
        `• Clic en [Aceptar] para eliminar el pedido y RESTAR los kits del stock.\n` +
        `• Clic en [Cancelar] para abortar la eliminación.`
      );
      if (!revertStock) return;
    } else {
      const confirmDelete = window.confirm(`¿Estás seguro de eliminar el pedido pendiente ${solicitud.numeroSolicitud}?`);
      if (!confirmDelete) return;
    }

    try {
      if (revertStock && (solicitud.items || []).length > 0) {
        for (const item of (solicitud.items || [])) {
          const invItem = inventario.find(i => i.id === item.id || (i.modelo || '').toLowerCase() === (item.modelo || '').toLowerCase());
          if (invItem) {
            const nuevoStock = Math.max(0, (Number(invItem.disponibles) || 0) - (Number(item.cantidad) || 0));
            await updateDoc(doc(db, 'inventario_brandeo', invItem.id), {
              disponibles: nuevoStock,
              updatedAt: Date.now()
            });
          }
        }
      }

      await deleteDoc(doc(db, 'solicitudes_brandeo', solicitud.id));
      showToast(`Pedido ${solicitud.numeroSolicitud} eliminado correctamente.`, 'info');
    } catch (err) {
      console.error('Error eliminando solicitud:', err);
      showToast('Error al eliminar la solicitud.', 'danger');
    }
  };

  // Reset all orders to zero (Exclusive to Master for clean production start)
  const handleResetSolicitudes = async () => {
    if (!db) return;
    if ((currentUser?.rol || '').toLowerCase() !== 'master') {
      showToast('Acceso denegado: Solo el Master puede reiniciar solicitudes.', 'danger');
      return;
    }

    const confirmReset = window.confirm(
      '¿Deseas reiniciar todas las solicitudes de pedidos a CERO y restablecer el inventario inicial para arrancar en limpio?\n\n' +
      'Esto eliminará los pedidos registrados de prueba y dejará las tablas semanales en 0.'
    );
    if (!confirmReset) return;

    try {
      // 1. Eliminar todas las solicitudes existentes en solicitudes_brandeo
      for (const sol of solicitudes) {
        await deleteDoc(doc(db, 'solicitudes_brandeo', sol.id));
      }

      // 2. Restablecer el inventario a los modelos predeterminados limpios
      for (const def of DEFAULT_BRANDING_MODELS) {
        await setDoc(doc(db, 'inventario_brandeo', def.id), {
          ...def,
          totalConsumidos: 0,
          updatedAt: Date.now()
        }, { merge: true });
      }

      showToast('¡Historial y pedidos reiniciados a cero correctamente para arrancar!', 'success');
    } catch (err) {
      console.error('Error al reiniciar solicitudes:', err);
      showToast('Error al reiniciar pedidos a cero.', 'danger');
    }
  };

  // Toggle or Revert brandeo
  const handleToggleRequiereBrandeo = async (eq, newValue) => {
    if (!db) return;
    try {
      const payload = {
        requiereBrandeo: newValue,
        brandeoRealizado: !newValue ? false : eq.brandeoRealizado || false,
        updatedAt: Date.now()
      };

      // If reverting back to pending or removing brandeo realizado, clean brandeo timestamp
      if (newValue === true) {
        payload.brandeoRealizado = false;
        payload.timestampBrandeo = null;
        payload.fechaBrandeo = '';
        payload.fechaBrandeoCorta = '';
        payload.horaBrandeo = '';
        payload.mesBrandeo = '';
        payload.semanaBrandeo = '';
        payload.tipoBrandeoUsado = '';
      }

      await updateDoc(doc(db, 'equipos', eq.id), payload);

      if (newValue) {
        showToast('Equipo vuelto a marcar como pendiente de brandeo.', 'info');
      } else {
        showToast('Solicitud de brandeo desactivada.', 'info');
      }
    } catch (err) {
      console.error('Error toggling brandeo:', err);
      showToast('Error al actualizar.', 'danger');
    }
  };

  // Change priority directly in Firebase
  const handleUpdatePrioridad = async (id, nuevaPrioridad) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'equipos', id), {
        prioridadBrandeo: nuevaPrioridad,
        updatedAt: Date.now()
      });
      showToast(`Prioridad actualizada a ${nuevaPrioridad}`, 'info');
    } catch (err) {
      console.error('Error actualizando prioridad de brandeo:', err);
      showToast('Error al actualizar la prioridad en Firebase', 'danger');
    }
  };

  // If user is not authenticated, show Login Screen
  if (!currentUser) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        users={users}
      />
    );
  }

  const isBrandeador = (currentUser.rol || '').toLowerCase() === 'brandeador';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 10000,
          backgroundColor: toast.type === 'success' ? '#065f46' : toast.type === 'danger' ? '#991b1b' : '#1e293b',
          color: '#ffffff',
          padding: '12px 18px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          fontWeight: '600',
          animation: 'scaleIn 0.2s ease-out'
        }}>
          {toast.type === 'success' && <CheckCircle size={18} color="#34d399" />}
          {toast.type === 'danger' && <AlertCircle size={18} color="#f87171" />}
          {toast.type === 'info' && <Info size={18} color="#38bdf8" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <BrandeoNavbar
        theme={theme}
        toggleTheme={toggleTheme}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenUsersModal={() => setShowUsersModal(true)}
        isLive={isLive}
        onRefresh={() => window.location.reload()}
      />

      {/* Main Container - Full width to maximize screen usage and eliminate unnecessary scrollbars */}
      <main style={{ flex: 1, width: '100%', margin: '0', padding: '16px 20px', boxSizing: 'border-box' }}>
        
        {/* Error Alert */}
        {error && (
          <div style={{
            padding: '14px 18px',
            marginBottom: '16px',
            borderRadius: '10px',
            backgroundColor: 'var(--danger-light)',
            color: 'var(--danger)',
            border: '1px solid var(--danger)',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Dashboard Statistics */}
        <BrandeoStats
          totalEquipos={equipos.length}
          pendientesCount={pendientesCount}
          brandeadosCount={brandeadosCount}
          urgenteCount={urgenteCount}
          medioCount={medioCount}
          bajoCount={bajoCount}
          totalStockDisponible={totalStockDisponible}
          pedidosPendientesCount={pedidosPendientesCount}
          unidadesEnTransito={unidadesEnTransito}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
        />

        {/* Filters and Tabs */}
        <BrandeoFilters
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendientesCount={pendientesCount}
          brandeadosCount={brandeadosCount}
          totalStockDisponible={totalStockDisponible}
          pedidosPendientesCount={pedidosPendientesCount}
          totalCount={equipos.length}
          tipoFiltro={tipoFiltro}
          setTipoFiltro={setTipoFiltro}
          tiposDisponibles={tiposDisponibles}
          prioridadFiltro={prioridadFiltro}
          setPrioridadFiltro={setPrioridadFiltro}
          urgenteCount={urgenteCount}
          medioCount={medioCount}
          bajoCount={bajoCount}
          onExportExcel={() => exportBrandeoToExcel(filteredEquipos, `Brandeo_${activeTab}`)}
          currentUser={currentUser}
        />

        {/* Tab Content */}
        {loading ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1rem', fontWeight: '600' }}>Cargando datos desde Firebase...</p>
          </div>
        ) : (!isBrandeador && activeTab === 'inventario') ? (
          /* View 1: Brandeo Disponible / Stock por modelo (Master & Admin only) */
          <BrandeoInventarioView
            inventario={inventario}
            solicitudes={solicitudes}
            onUpdateStock={handleUpdateStock}
            onAddNewModel={handleAddNewModel}
            onNavigateToSolicitudes={() => setActiveTab('solicitudes')}
            theme={theme}
          />
        ) : (!isBrandeador && activeTab === 'solicitudes') ? (
          /* View 2: Solicitud de Brandeo / Carrito y Control Semanal (Master & Admin only) */
          <BrandeoSolicitudesView
            inventario={inventario}
            solicitudes={solicitudes}
            onCreateSolicitud={handleCreateSolicitud}
            onRecibirSolicitud={handleRecibirSolicitud}
            onDeleteSolicitud={handleDeleteSolicitud}
            onResetSolicitudes={handleResetSolicitudes}
            currentUser={currentUser}
            activeBrander={currentUser.nombre}
            theme={theme}
          />
        ) : (!isBrandeador && activeTab === 'reportes') ? (
          /* View 3: Weekly and Monthly Analytics (Master & Admin only) */
          <BrandeoReportesView equipos={equipos} theme={theme} />
        ) : (
          /* View 4: Panoramic Table & Mobile Cards (Photo 1 & Photo 3 view) */
          <BrandeoTable
            equipos={filteredEquipos}
            activeTab={activeTab}
            onConfirmBrandeo={handleOpenConfirmModal}
            onToggleRequiereBrandeo={handleToggleRequiereBrandeo}
            onUpdatePrioridad={handleUpdatePrioridad}
            theme={theme}
          />
        )}
      </main>

      {/* Floating PWA Install Banner (Mobile & PC) */}
      {showPWABanner && (
        <PWAInstallPrompt isBanner={true} onClose={() => setShowPWABanner(false)} />
      )}

      {/* Footer */}
      <footer style={{
        padding: '16px 20px',
        textAlign: 'center',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        backgroundColor: 'var(--bg-card)',
        marginTop: '30px'
      }}>
        Control de Brandeo de Equipos • Instalable como App PWA para Computadoras y Teléfonos Celulares
      </footer>

      {/* Confirmation Modal (Photo 5: Select kit to discount and confirm) */}
      {modalEquipo && (
        <ConfirmBrandeoModal
          equipo={modalEquipo}
          inventario={inventario}
          defaultBrander={currentUser?.nombre || activeBrander}
          onClose={() => setModalEquipo(null)}
          onConfirm={handleConfirmBrandeo}
        />
      )}

      {/* Master User Management Modal */}
      {showUsersModal && currentUser?.rol === 'master' && (
        <UserManagementModal
          users={users}
          currentUser={currentUser}
          onAddUser={handleAddUser}
          onDeleteUser={handleDeleteUser}
          onClose={() => setShowUsersModal(false)}
        />
      )}
    </div>
  );
}
