// api/sync-to-sheet.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  try {
    // Valida que las variables de entorno están presentes
    if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
        throw new Error("Missing Google Sheets credentials in environment variables.");
    }
      
    const serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Vercel escapa los saltos de línea
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);

    await doc.loadInfo(); 
    const sheet = doc.sheetsByIndex[0]; // O usa doc.sheetsByTitle['Tu Titulo']

    const formData = req.body;

    // Obtiene los encabezados de la hoja para mapear dinámicamente
    await sheet.loadHeaderRow();
    const headers = sheet.headerValues;
    
    // Construye el objeto de la fila basado en los encabezados
    const rowData: Record<string, any> = {};
    
    for (const header of headers) {
        if (formData[header] !== undefined && formData[header] !== null) {
            // Convierte arrays (de checkboxes) a un string separado por comas
            if (Array.isArray(formData[header])) {
                rowData[header] = formData[header].join(', ');
            } else {
                rowData[header] = formData[header];
            }
        }
    }
    
    await sheet.addRow(rowData);

    res.status(200).json({ message: 'Data saved successfully!' });
  } catch (error) {
    console.error('Error in /api/sync-to-sheet:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to save data to Google Sheet.', details: errorMessage });
  }
}
