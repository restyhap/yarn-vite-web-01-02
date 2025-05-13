import request from '../../request';

/**
 * Export QC Report as PDF
 * @param id QC Report ID
 * @returns PDF file as blob
 */
export const getPdfExportQcReport = async (id: string): Promise<Blob> => {
  const apiUrl = import.meta.env?.VITE_API_URL || '';
  const response = await fetch(`${apiUrl}/pdf/qcreport/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to export PDF: ${response.statusText}`);
  }
  
  return await response.blob();
};
