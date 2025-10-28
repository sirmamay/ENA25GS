import React from 'react';
import { SurveyFormState } from '../types';

interface HeaderProps {
    formData: SurveyFormState;
    handleChange: (field: keyof SurveyFormState, value: string) => void;
    onShowGuide: () => void;
}

const InfoInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, value, onChange }) => (
    <div className="flex flex-col">
        <label className="text-xs font-semibold text-gray-600 mb-1">{label}</label>
        <input type="text" value={value} onChange={onChange} className="border-b-2 border-gray-300 focus:border-blue-500 outline-none px-1 py-0.5 text-sm"/>
    </div>
);


const Header: React.FC<HeaderProps> = ({ formData, handleChange, onShowGuide }) => {
    return (
        <header className="border-2 border-black p-4 space-y-4">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                    <div>
                        <h1 className="font-bold text-lg">ENA 2025</h1>
                        <h2 className="text-md text-gray-700">Guía de Supervisión</h2>
                    </div>
                </div>
                 <div className="flex flex-col items-end space-y-2">
                    <div className="text-center border-2 border-black p-2">
                        <p className="font-bold text-xl">ENA</p>
                        <p className="text-xs">Agropecuaria</p>
                    </div>
                    <button
                        onClick={onShowGuide}
                        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1 px-3 border border-gray-300 rounded shadow-sm text-sm transition-colors"
                        aria-label="Mostrar guía visual"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>Ver Guía</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t-2 border-black">
                 <InfoInput label="MUNICIPIO" value={formData.municipio} onChange={e => handleChange('municipio', e.target.value)} />
                 <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">JEFE(A) DE CAMPO</label>
                    <select
                        value={formData.jefeDeCampo}
                        onChange={e => handleChange('jefeDeCampo', e.target.value)}
                        className="border-b-2 border-gray-300 focus:border-blue-500 outline-none px-1 py-0.5 text-sm bg-white"
                    >
                        <option value="">Seleccione un jefe</option>
                        {[...Array(7).keys()].map(i => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                </div>
                 <InfoInput label="ENTREVISTADOR(A)" value={formData.entrevistador} onChange={e => handleChange('entrevistador', e.target.value)} />
                 <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">FECHA DE SUPERVISIÓN</label>
                    <input type="date" value={formData.fechaDeSupervision} onChange={e => handleChange('fechaDeSupervision', e.target.value)} className="border-b-2 border-gray-300 focus:border-blue-500 outline-none px-1 py-0.5 text-sm"/>
                </div>
                <InfoInput label="SEMANA" value={formData.semana} onChange={e => handleChange('semana', e.target.value)} />
            </div>

            <div className="text-sm bg-gray-50 p-3 border border-gray-200 rounded-md">
                <p><span className="font-bold">Instrucciones:</span> De acuerdo con el desarrollo de la entrevista, para cada una de las preguntas, registra el código de respuesta según lo observado en el desempeño del (de la) entrevistador(a): cuando la respuesta sea NO, o cuando en algunos casos, la respuesta sea SÍ, deberás especificar la o las causas.</p>
            </div>
        </header>
    );
};

export default Header;