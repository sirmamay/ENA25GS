import React from 'react';

interface FooterProps {
    isOnline: boolean;
    syncStatus: 'idle' | 'syncing' | 'success' | 'error';
    onSync: () => void;
    onSaveAndNew: () => void;
    onShowSaved: () => void;
    onDownloadCsv: () => void;
}

const SyncIcon: React.FC<{ status: 'idle' | 'syncing' | 'success' | 'error' }> = ({ status }) => {
    switch (status) {
        case 'syncing':
            return <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
        case 'success':
            return <svg className="h-5 w-5 mr-3 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
        case 'error':
            return <svg className="h-5 w-5 mr-3 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
        default:
             return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15v4m-3-3l3 3 3-3" /></svg>
    }
}

const getSyncButtonText = (status: 'idle' | 'syncing' | 'success' | 'error') => {
    switch (status) {
        case 'syncing': return 'Sincronizando...';
        case 'success': return 'Sincronizado';
        case 'error': return 'Error al Sincronizar';
        default: return 'Sincronizar a la Nube';
    }
}

const getSyncButtonClass = (status: 'idle' | 'syncing' | 'success' | 'error', isOnline: boolean) => {
    let base = "flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2";
    if (!isOnline) return `${base} bg-gray-400 cursor-not-allowed`;
    switch(status) {
        case 'syncing': return `${base} bg-blue-500 cursor-wait`;
        case 'success': return `${base} bg-green-600`;
        case 'error': return `${base} bg-red-600`;
        default: return `${base} bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`;
    }
}

const Footer: React.FC<FooterProps> = ({ isOnline, syncStatus, onSync, onSaveAndNew, onShowSaved, onDownloadCsv }) => {
    return (
        <footer className="sticky bottom-0 bg-white border-t-2 border-gray-200 shadow-top z-10">
            <div className="max-w-4xl mx-auto p-4 flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium text-gray-700">{isOnline ? 'En línea' : 'Sin conexión'}</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                     <button
                        onClick={onSaveAndNew}
                        className="px-3 py-2 border border-gray-400 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Guardar y Nuevo
                    </button>
                     <button
                        onClick={onDownloadCsv}
                        className="px-3 py-2 border border-gray-400 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Descargar CSV
                    </button>
                    <button
                        onClick={onShowSaved}
                        className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Encuestas Guardadas
                    </button>
                    <button
                        onClick={onSync}
                        disabled={!isOnline || syncStatus === 'syncing'}
                        className={getSyncButtonClass(syncStatus, isOnline)}
                    >
                       <SyncIcon status={isOnline ? syncStatus : 'error'} />
                        {getSyncButtonText(isOnline ? syncStatus : 'error')}
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;