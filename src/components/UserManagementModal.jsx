import React, { useState } from 'react';
import { X, Users, UserPlus, Trash2, Key, Shield, Check, AlertCircle } from 'lucide-react';
import { getRoleInfo } from '../utils/authUtils';

export default function UserManagementModal({
  users = [],
  currentUser,
  onAddUser,
  onDeleteUser,
  onClose
}) {
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [nuevoPassword, setNuevoPassword] = useState('');
  const [nuevoRol, setNuevoRol] = useState('brandeador');
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = nuevoEmail.trim().toLowerCase();
    if (!cleanEmail || !nuevoPassword.trim() || !nuevoNombre.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    // Check duplicate
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      setError('Ya existe un usuario con este correo electrónico.');
      return;
    }

    onAddUser({
      id: `user-${Date.now()}`,
      nombre: nuevoNombre.trim(),
      email: cleanEmail,
      password: nuevoPassword.trim(),
      rol: nuevoRol,
      createdAt: Date.now()
    });

    setNuevoNombre('');
    setNuevoEmail('');
    setNuevoPassword('');
    setNuevoRol('brandeador');
    setShowAddForm(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(192, 132, 252, 0.12)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: '#a855f7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Users size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                Gestión de Usuarios y Roles
              </h2>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Panel de control exclusivo Master
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Header Action: Add User Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
              Usuarios Registrados ({users.length})
            </span>
            <button
              type="button"
              className={showAddForm ? "btn btn-outline" : "btn btn-primary"}
              onClick={() => setShowAddForm(!showAddForm)}
              style={{ fontSize: '0.8rem', height: '34px', gap: '6px' }}
            >
              <UserPlus size={15} />
              <span>{showAddForm ? 'Cancelar' : 'Crear Nuevo Usuario'}</span>
            </button>
          </div>

          {/* New User Form */}
          {showAddForm && (
            <form onSubmit={handleCreate} style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid #8b5cf6',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                Crear Nuevo Acceso
              </h3>

              {error && (
                <div style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: '700' }}>
                  ⚠️ {error}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                    Nombre Completo:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: Juan Pérez"
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                    Correo Electrónico:
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="usuario@taller.com"
                    value={nuevoEmail}
                    onChange={(e) => setNuevoEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                    Contraseña:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contraseña segura"
                    value={nuevoPassword}
                    onChange={(e) => setNuevoPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                    Rol Asignado:
                  </label>
                  <select
                    className="form-control"
                    value={nuevoRol}
                    onChange={(e) => setNuevoRol(e.target.value)}
                    style={{ fontWeight: '700' }}
                  >
                    <option value="brandeador">🎨 Brandeador (Solo marcar/descontar)</option>
                    <option value="admin">🛡️ Admin Secundario (Acceso completo operativo)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowAddForm(false)}
                  style={{ height: '34px', fontSize: '0.8rem' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  style={{ height: '34px', fontSize: '0.8rem' }}
                >
                  <Check size={14} />
                  <span>Guardar Usuario</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Users */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {users.map(u => {
              const roleInfo = getRoleInfo(u.rol);
              const isMaster = (u.rol || '').toLowerCase() === 'master';
              const isCurrent = currentUser && currentUser.email === u.email;

              return (
                <div
                  key={u.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {u.nombre}
                      </span>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: roleInfo.bg,
                        color: roleInfo.color,
                        border: `1px solid ${roleInfo.border}`
                      }}>
                        {roleInfo.badge}
                      </span>
                      {isCurrent && (
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>(Tú)</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span>✉️ {u.email}</span>
                      <span>🔑 Contraseña: <strong style={{ fontFamily: 'var(--font-mono)' }}>{u.password}</strong></span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {roleInfo.description}
                    </div>
                  </div>

                  {!isMaster && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`¿Estás seguro de eliminar el acceso de ${u.nombre}?`)) {
                          onDeleteUser(u.id);
                        }
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--danger)',
                        padding: '6px',
                        borderRadius: '6px'
                      }}
                      title="Eliminar usuario"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'flex-end',
          backgroundColor: 'var(--bg-surface)'
        }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
