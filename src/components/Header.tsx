import React from 'react';
import { SurveyFormState } from '../types';

interface HeaderProps {
    formData: SurveyFormState;
    handleChange: (field: keyof SurveyFormState, value: string) => void;
}

const InfoInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, value, onChange }) => (
    <div className="flex flex-col">
        <label className="text-xs font-semibold text-gray-600 mb-1">{label}</label>
        <input type="text" value={value} onChange={onChange} className="border-b-2 border-gray-300 focus:border-blue-500 outline-none px-1 py-0.5 text-sm"/>
    </div>
);


const Header: React.FC<HeaderProps> = ({ formData, handleChange }) => {
    return (
        <header className="border-2 border-black p-4 space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <img src="https://www.inegi.org.mx/inegi/img/inegi_logo.png" alt="INEGI Logo" className="h-12"/>
                    <div>
                        <h1 className="font-bold text-lg">ENCUESTA NACIONAL AGROPECUARIA 2025</h1>
                        <h2 className="text-md text-gray-700">Guía de supervisión al (a la) entrevistador(a)</h2>
                    </div>
                </div>
                 <div className="text-center border-2 border-black p-2">
                    <p className="font-bold text-xl">ENA</p>
                    <p className="text-xs">Agropecuaria</p>
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