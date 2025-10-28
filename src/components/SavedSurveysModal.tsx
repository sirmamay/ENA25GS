import React from 'react';
import { SurveyFormState } from '../types';

interface SavedSurveysModalProps {
    isOpen: boolean;
    onClose: () => void;
    surveys: SurveyFormState[];
    onLoad: (id: number) => void;
    onDelete: (id: number) => void;
}

const SavedSurveysModal: React.FC<SavedSurveysModalProps> = ({ isOpen, onClose, surveys, onLoad, onDelete }) => {
    if (!isOpen) return null;

    const getSurveyTitle = (survey: SurveyFormState) => {
        // FIX: Property 'supervisor' does not exist on type 'SurveyFormState'. Changed to 'jefeDeCampo'.
        const supervisor = survey.jefeDeCampo || 'N/A';
        const date = survey.fechaDeSupervision || new Date(survey.id).toLocaleDateString();
        return `Supervisor: ${supervisor} - Fecha: ${date}`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Encuestas Guardadas</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Cerrar modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-4 overflow-y-auto">
                    {surveys.length > 0 ? (
                        <ul className="space-y-3">
                            {surveys.map((survey) => (
                                <li key={survey.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200">
                                    <span className="text-sm font-medium text-gray-700 truncate pr-4">{getSurveyTitle(survey)}</span>
                                    <div className="flex-shrink-0 flex items-center space-x-2">
                                        <button 
                                            onClick={() => onLoad(survey.id)}
                                            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Cargar
                                        </button>
                                        <button 
                                            onClick={() => onDelete(survey.id)}
                                            className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            Borrar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-8">No hay encuestas guardadas.</p>
                    )}
                </div>
                <div className="p-4 border-t text-right">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SavedSurveysModal;