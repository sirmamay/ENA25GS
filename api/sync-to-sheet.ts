// api/sync-to-sheet.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Helper para logs con timestamp
const log = (message: string) => console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
const logError = (message: string, error?: any) => console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);


export default async function handler(req: VercelRequest, res: VercelResponse) {
  log("Received request for /api/sync-to-sheet");

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    log("Rejected non-POST request");
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  try {
    log("Starting sync process...");

    if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
        logError("Missing Google Sheets credentials in environment variables.");
        throw new Error("Missing Google Sheets credentials in environment variables.");
    }
    log("Environment variables seem to be present.");
      
    const serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    log(`JWT created for service account: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`);

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    log(`Connecting to Google Sheet ID: ${process.env.GOOGLE_SHEET_ID}`);

    await doc.loadInfo(); 
    log(`Successfully loaded document info: "${doc.title}"`);
    const sheet = doc.sheetsByIndex[0];
    log(`Selected sheet by index 0: "${sheet.title}" with ${sheet.rowCount} rows.`);

    const formData = req.body;
    log(`Received form data with ${Object.keys(formData).length} keys.`);

    await sheet.loadHeaderRow();
    const headers = sheet.headerValues;
    log(`Sheet headers loaded: ${headers.join(', ')}`);
    
    const rowData: Record<string, any> = {};
    rowData['timestamp'] = new Date().toISOString();

    for (const header of headers) {
        if (header === 'timestamp') continue;
        
        if (formData[header] !== undefined && formData[header] !== null) {
            if (Array.isArray(formData[header])) {
                rowData[header] = formData[header].join(', ');
            } else {
                rowData[header] = formData[header];
            }
        } else {
             rowData[header] = '';
        }
    }
    log("Prepared row data for submission.");
    
    await sheet.addRow(rowData);
    log("Successfully added row to the sheet.");

    res.status(200).json({ message: 'Data saved successfully!' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError('An error occurred during the sync process.', { message: errorMessage, stack: (error as Error).stack });
    res.status(500).json({ error: 'Failed to save data to Google Sheet.', details: errorMessage });
  }
}
