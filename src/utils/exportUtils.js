import * as XLSX from 'xlsx';

export const exportBrandeoToExcel = (equipos, filename = 'Equipos_Brandeo') => {
  if (!equipos || equipos.length === 0) {
    alert('No hay datos para exportar.');
    return;
  }

  const exportData = equipos.map(eq => ({
    'Equipo / Modelo': eq.tipoEquipo || eq.modelo || 'Sin Asignar',
    'Activo': eq.activo || 'N/A',
    'Serie': eq.serie || 'N/A',
    'Cliente': eq.cliente || 'N/A',
    'Lugar': eq.lugar || 'N/A',
    'Requiere Brandeo': eq.requiereBrandeo ? 'SÍ' : 'NO',
    'Brandeo Realizado': eq.brandeoRealizado ? 'SÍ' : 'NO',
    'Fecha de Brandeo': eq.fechaBrandeo || 'N/A',
    'Técnico / Responsable': eq.usuarioBrandeo || eq.tecnico || 'N/A',
    'Notas / Comentarios': eq.comentariosBrandeo || eq.comentario || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Brandeo');

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  XLSX.writeFile(workbook, `${filename}_${dateStr}.xlsx`);
};
