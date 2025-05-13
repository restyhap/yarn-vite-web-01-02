import request from '../../request';

/**
 * Export Quotation as PDF
 * @param id Quotation ID
 * @returns PDF file as blob
 */
export const getPdfExportQuotation = async (id: string): Promise<Blob> => {
  const apiUrl = import.meta.env?.VITE_API_URL || '';
  const response = await fetch(`${apiUrl}/pdf/quotation/${id}`, {
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
