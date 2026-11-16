export const MESES_NOMBRES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

/**
 * Retorna el número de semana dentro del mes (1 a 5)
 */
export const getSemanaNumFromDate = (year, monthIdx, day) => {
  const firstDay = new Date(year, monthIdx, 1);
  const firstDayVal = firstDay.getDay(); // 0 = Domingo, 1 = Lunes
  const diff = firstDayVal === 0 ? -6 : 1 - firstDayVal;
  const mondayOfFirstWeek = new Date(firstDay);
  mondayOfFirstWeek.setDate(firstDay.getDate() + diff);

  const targetDate = new Date(year, monthIdx, day);
  const diffTime = targetDate.getTime() - mondayOfFirstWeek.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weekNum = Math.floor(diffDays / 7) + 1;

  return Math.min(5, Math.max(1, weekNum));
};

/**
 * Retorna la etiqueta legible de la semana con rango de fechas (ej: "Semana 3 (16/11 al 22/11)")
 */
export const getSemanaLabel = (semanaId, mesName, year = new Date().getFullYear()) => {
  if (!semanaId) return 'Semana';
  const match = String(semanaId).match(/Semana (\d)/);
  if (!match) return semanaId;

  const weekNum = parseInt(match[1], 10);
  const monthIdx = MESES_NOMBRES.indexOf(mesName);
  if (monthIdx === -1) return semanaId;

  const firstDay = new Date(year, monthIdx, 1);
  const firstDayVal = firstDay.getDay();
  const diff = firstDayVal === 0 ? -6 : 1 - firstDayVal;
  const mondayOfFirstWeek = new Date(firstDay);
  mondayOfFirstWeek.setDate(firstDay.getDate() + diff);

  const mon = new Date(mondayOfFirstWeek);
  mon.setDate(mondayOfFirstWeek.getDate() + (weekNum - 1) * 7);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);

  const monStr = `${String(mon.getDate()).padStart(2, '0')}/${String(mon.getMonth() + 1).padStart(2, '0')}`;
  const sunStr = `${String(sun.getDate()).padStart(2, '0')}/${String(sun.getMonth() + 1).padStart(2, '0')}`;

  return `Semana ${weekNum} (${monStr} al ${sunStr})`;
};

/**
 * Genera el paquete de metadatos exactos de fecha y hora cuando se realiza el brandeo
 */
export const createBrandeoRecord = (extraData = {}) => {
  const now = new Date();
  const year = now.getFullYear();
  const monthIdx = now.getMonth();
  const day = now.getDate();

  const mesName = MESES_NOMBRES[monthIdx];
  const semanaNum = getSemanaNumFromDate(year, monthIdx, day);
  const semanaName = `Semana ${semanaNum}`;

  const fechaCorta = `${String(day).padStart(2, '0')}/${String(monthIdx + 1).padStart(2, '0')}/${year}`;
  const horaCorta = now.toLocaleTimeString('es-CR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  const fechaCompleta = `${fechaCorta} ${horaCorta}`;

  return {
    requiereBrandeo: false, // Quita el color distintivo en el Gestor de Equipos
    brandeoRealizado: true,
    fechaBrandeo: fechaCompleta,
    fechaBrandeoCorta: fechaCorta,
    horaBrandeo: horaCorta,
    timestampBrandeo: now.getTime(),
    mesBrandeo: mesName,
    añoBrandeo: year,
    semanaBrandeo: semanaName,
    mesAñoBrandeo: `${mesName} ${year}`,
    usuarioBrandeo: extraData.usuarioBrandeo || 'Técnico de Brandeo',
    comentariosBrandeo: extraData.comentariosBrandeo || '',
    updatedAt: now.getTime()
  };
};

/**
 * Agrupa los equipos brandeados por mes y por semana para analíticas y métricas
 */
export const groupBrandeosByPeriod = (equipos = []) => {
  const brandeados = equipos.filter(eq => eq.brandeoRealizado === true && eq.timestampBrandeo);
  
  // Agrupar por Mes-Año
  const porMes = {};

  brandeados.forEach(eq => {
    let mesKey = eq.mesAñoBrandeo;
    if (!mesKey) {
      if (eq.timestampBrandeo) {
        const d = new Date(eq.timestampBrandeo);
        mesKey = `${MESES_NOMBRES[d.getMonth()]} ${d.getFullYear()}`;
      } else {
        mesKey = 'Sin Fecha';
      }
    }

    if (!porMes[mesKey]) {
      porMes[mesKey] = {
        mes: mesKey,
        total: 0,
        porSemana: {
          'Semana 1': [],
          'Semana 2': [],
          'Semana 3': [],
          'Semana 4': [],
          'Semana 5': []
        },
        equipos: []
      };
    }

    porMes[mesKey].total += 1;
    porMes[mesKey].equipos.push(eq);

    const semKey = eq.semanaBrandeo || 'Semana 1';
    if (!porMes[mesKey].porSemana[semKey]) {
      porMes[mesKey].porSemana[semKey] = [];
    }
    porMes[mesKey].porSemana[semKey].push(eq);
  });

  return porMes;
};
