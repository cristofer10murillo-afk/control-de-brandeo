import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import confetti from 'canvas-confetti';
import { db } from './firebase';
import BrandeoNavbar from './components/BrandeoNavbar';
import BrandeoStats from './components/BrandeoStats';
import BrandeoFilters from './components/BrandeoFilters';
import BrandeoTable from './components/BrandeoTable';
import ConfirmBrandeoModal from './components/ConfirmBrandeoModal';
import { exportBrandeoToExcel } from './utils/exportUtils';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function App() {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false);

  // Appearance & Personalization
  const [theme, setTheme] = useState(() => localStorage.getItem('brandeo_theme') || 'dark');
  const [activeBrander, setActiveBrander] = useState(() => localStorage.getItem('last_brander_name') || '');

  // Filters & Tabs
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pendientes'); // 'pendientes' | 'brandeados' | 'todos'
  const [tipoFiltro, setTipoFiltro] = useState('Todos');

  // Confirmation Modal
  const [modalEquipo, setModalEquipo] = useState(null);

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

  // Real-time synchronization with Firestore "equipos" collection
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
        // Sort: most recent first if createdAt exists
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

  // Compute counts
  const pendientesCount = useMemo(() => {
    return equipos.filter(eq => eq.requiereBrandeo === true).length;
  }, [equipos]);

  const brandeadosCount = useMemo(() => {
    return equipos.filter(eq => eq.brandeoRealizado === true).length;
  }, [equipos]);

  const tiposDisponibles = useMemo(() => {
    const set = new Set();
    equipos.forEach(eq => {
      const t = (eq.tipoEquipo || eq.modelo || '').trim();
      if (t) set.add(t);
    });
    return Array.from(set).sort();
  }, [equipos]);

  // Filtered equipments based on activeTab, search, and type
  const filteredEquipos = useMemo(() => {
    return equipos.filter(eq => {
      // 1. Tab filter
      if (activeTab === 'pendientes') {
        if (!eq.requiereBrandeo) return false;
      } else if (activeTab === 'brandeados') {
        if (!eq.brandeoRealizado) return false;
      }

      // 2. Model / Type filter
      if (tipoFiltro !== 'Todos') {
        const t = (eq.tipoEquipo || eq.modelo || '').trim().toLowerCase();
        if (t !== tipoFiltro.trim().toLowerCase()) return false;
      }

      // 3. Search Term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const combined = [
          eq.tipoEquipo,
          eq.modelo,
          eq.activo,
          eq.serie,
          eq.cliente,
          eq.lugar,
          eq.tecnico,
          eq.usuarioBrandeo
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!combined.includes(query)) return false;
      }

      return true;
    });
  }, [equipos, activeTab, tipoFiltro, searchTerm]);

  // Launch confetti celebration
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  // Open confirmation modal or quick confirm
  const handleOpenConfirmModal = (eq) => {
    setModalEquipo(eq);
  };

  // Confirm Brandeo
  const handleConfirmBrandeo = async (id, extraData = {}) => {
    if (!db) return;
    try {
      const nowStr = new Date().toLocaleString('es-CR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });

      const payload = {
        requiereBrandeo: false, // Inmediatamente remueve el color en Gestor de Equipos
        brandeoRealizado: true,
        fechaBrandeo: nowStr,
        usuarioBrandeo: extraData.usuarioBrandeo || activeBrander || 'Técnico de Brandeo',
        comentariosBrandeo: extraData.comentariosBrandeo || '',
        updatedAt: Date.now()
      };

      await updateDoc(doc(db, 'equipos', id), payload);

      setModalEquipo(null);
      triggerConfetti();
      showToast('¡Brandeo confirmado! Se ha quitado el color distintivo en el Gestor de Equipos.', 'success');
    } catch (err) {
      console.error('Error confirming brandeo:', err);
      showToast('Error al actualizar en Firebase. Intente nuevamente.', 'danger');
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

      await updateDoc(doc(db, 'equipos', eq.id), payload);

      if (newValue) {
        showToast('Equipo marcado como pendiente de brandeo (destacado en Gestor de Equipos).', 'info');
      } else {
        showToast('Solicitud de brandeo desactivada.', 'info');
      }
    } catch (err) {
      console.error('Error toggling brandeo:', err);
      showToast('Error al actualizar.', 'danger');
    }
  };

  // Prompt user to update default brander name
  const handleChangeBrander = () => {
    const newName = window.prompt('Ingresa el nombre o iniciales de la persona que realiza el brandeo:', activeBrander);
    if (newName !== null) {
      const trimmed = newName.trim();
      setActiveBrander(trimmed);
      localStorage.setItem('last_brander_name', trimmed);
      showToast(`Responsable actualizado a: ${trimmed || 'Sin asignar'}`, 'info');
    }
  };

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
        activeBrander={activeBrander}
        onChangeBrander={handleChangeBrander}
        isLive={isLive}
        onRefresh={() => window.location.reload()}
      />

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '24px' }}>
        
        {/* Error Alert */}
        {error && (
          <div style={{
            padding: '14px 18px',
            marginBottom: '20px',
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
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Filters and Tabs */}
        <BrandeoFilters
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendientesCount={pendientesCount}
          brandeadosCount={brandeadosCount}
          totalCount={equipos.length}
          tipoFiltro={tipoFiltro}
          setTipoFiltro={setTipoFiltro}
          tiposDisponibles={tiposDisponibles}
          onExportExcel={() => exportBrandeoToExcel(filteredEquipos, `Brandeo_${activeTab}`)}
        />

        {/* Table View */}
        {loading ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1rem', fontWeight: '600' }}>Cargando datos desde Firebase...</p>
          </div>
        ) : (
          <BrandeoTable
            equipos={filteredEquipos}
            activeTab={activeTab}
            onConfirmBrandeo={handleOpenConfirmModal}
            onToggleRequiereBrandeo={handleToggleRequiereBrandeo}
            theme={theme}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        padding: '16px 24px',
        textAlign: 'center',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        backgroundColor: 'var(--bg-card)',
        marginTop: '30px'
      }}>
        Sistema de Control y Seguimiento de Brandeo • Integrado con Gestor de Equipos PRO en Tiempo Real
      </footer>

      {/* Confirmation Modal */}
      {modalEquipo && (
        <ConfirmBrandeoModal
          equipo={modalEquipo}
          defaultBrander={activeBrander}
          onClose={() => setModalEquipo(null)}
          onConfirm={handleConfirmBrandeo}
        />
      )}
    </div>
  );
}
