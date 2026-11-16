# Control de Brandeo de Equipos

Aplicación web moderna y colaborativa diseñada para el control, seguimiento y confirmación en tiempo real del brandeo de equipos de taller, totalmente integrada con el ecosistema de **Gestor de Equipos PRO**.

## 🚀 Características Principales

1. **Sincronización en Tiempo Real con Firebase Firestore**:
   - Conectada a la misma base de datos del **Gestor de Equipos PRO** (`gestor-de-equipos-pro-3ed23`).
   - Cuando en el Gestor de Equipos se activa la opción **"¿Requiere brandeo?"** (en Información Técnica o en el modal de Restauración), el equipo se destaca en un color distintivo (púrpura luminoso) y aparece inmediatamente aquí.
   - Cuando la persona que realiza el brandeo confirma el trabajo en esta aplicación, **el color distintivo se remueve de inmediato en el Gestor de Equipos** y el contador se actualiza.

2. **Indicadores y Estadísticas en Vivo (KPIs)**:
   - **Falta por Brandear (Pendientes)**: Equipos que requieren brandeo urgente.
   - **Equipos Brandeados**: Historial y total de equipos con brandeo completado.
   - **Total Registrados**: Catálogo completo en base de datos.
   - **Avance de Brandeo (%)**: Barra de progreso dinámica.

3. **Vista de Tabla Panorámica**:
   - Replica y muestra los campos clave: **Equipo / Modelo**, **Activo**, **Serie**, **Cliente**, **Lugar / Ubicación**, **Estado**.
   - Casilla de confirmación con 1 clic o modal con nombre del responsable y notas opcionales.
   - Efecto visual de celebración al confirmar y opción de deshacer si hubo error.

4. **Filtros Avanzados y Búsqueda Instantánea**:
   - Pestaña de Pendientes (por defecto para el taller de brandeo).
   - Pestaña de Historial de Brandeados (con fecha y responsable).
   - Pestaña de Todos los Equipos (con posibilidad de solicitar brandeo si surge la necesidad).
   - Filtro por Modelo de Máquina.
   - Búsqueda en tiempo real por Activo, Serie, Cliente o Modelo.
   - Exportación completa de reportes a Excel (.xlsx).

5. **Multi-usuario y Multi-dispositivo**:
   - Funciona fluidamente en computadoras, tablets y teléfonos móviles.
   - Modo Oscuro y Modo Claro.

---

## 🛠️ Tecnologías

- **React 19** + **Vite 8**
- **Firebase Firestore 12**
- **Lucide Icons**
- **Canvas-Confetti**
- **SheetJS (XLSX)**
- **Netlify** para despliegue automatizado continuo

---

## 📦 Instalación y Ejecución Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

---

## 🌐 Despliegue en Netlify

El archivo `netlify.toml` ya está preconfigurado para compilar con `npm run build` y publicar la carpeta `dist`. Conectando este repositorio en GitHub con Netlify, cada commit desplegará automáticamente la versión más reciente.
