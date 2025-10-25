import React, { useState, useEffect, useCallback } from 'react';
import { SurveyFormState, YesNoNa } from './types';
import Header from './components/Header';
import QuestionCard from './components/QuestionCard';
import YesNoNaInput from './components/YesNoNaInput';
import ConditionalInput from './components/ConditionalInput';
import Footer from './components/Footer';
import CameraFab from './components/CameraFab';

const App: React.FC = () => {
    const getInitialState = (): SurveyFormState => {
        const savedData = localStorage.getItem('surveyData');
        if (savedData) {
            return JSON.parse(savedData);
        }
        return {
            coordinacionEstatal: '',
            municipio: '',
            localidad: '',
            jefeDeControl: '',
            semana: '',
            numeroDeGuia: '',
            jefeDeCampo: '',
            entrevistador: '',
            supervisor: '',
            fechaDeSupervision: '',
            q1_battery: '',
            q2_departureTime: '',
            q3_arrivalTime: '',
            q4_answer: null,
            q4_cause: '',
            q4_cause_other: '',
            q5_answer: null,
            q6_answer: null,
            q6_cause: [],
            q6_cause_other: '',
            q7_answer: null,
            q8_answer: null,
            q9_answer: null,
            q10_answer: null,
            q10_cause: '',
            q10_cause_other: '',
            q11_answer: null,
            q11_cause: '',
            q11_cause_other: '',
            q12_strategies: [],
            q12_strategy_other: '',
            q13_time: '',
            q13_cause: '',
            q13_cause_other: '',
            q14_time: '',
            q14_cause: '',
            q14_cause_other: '',
            q15_answer: null,
            q15_medium: '',
            q15_medium_other: '',
            q16_answer: null,
            q16_investigation: '',
            q16_investigation_other: '',
            q17_situation: '',
            q17_situation_other: '',
            q18_answer: null,
            q18_cause: '',
            q18_cause_other: '',
            q19_answer: null,
            q19_cause: '',
            q19_cause_other: '',
            q20_answer: null,
            q20_cause: '',
            q20_cause_other: '',
            q21_answer: null,
            q21_cause: '',
            q21_cause_other: '',
            q22_answer: null,
            q22_cause: '',
            q22_cause_other: '',
            q23_answer: null,
            q23_cause: '',
            q23_cause_other: '',
            q24_answer: null,
            q24_situation: '',
            q24_situation_other: '',
            q25_answer: null,
            q25_cause: '',
            q25_cause_other: '',
            q26_answer: null,
            q26_situation: '',
            q26_situation_other: '',
            q27_answer: null,
            q27_cause: '',
            q27_cause_other: '',
            q28_visitNumber: '',
            q29_answer: null,
            q29_cause: '',
            q29_cause_other: '',
            q30_answer: null,
            q30_situation: '',
            q31_answer: null,
            q31_situation: '',
            q32_answer: null,
            q32_situation: '',
            q32_situation_other: '',
            q33_pending_02: '',
            q33_pending_03: '',
            q33_pending_04: '',
            q33_pending_05: '',
            q34_answer: null,
            q34_cause: '',
            q34_cause_other: '',
            q34a_transferMethod: '',
            q35_answer: null,
            q35_cause: '',
            q35_cause_other: '',
            q36_answer: null,
            q36_cause: '',
            q36_cause_other: '',
            q37_questionnaires_week: '',
            q37_1_questionnaires_day: '',
            q38_terrains_week: '',
            q38_1_terrains_captured: '',
            q39_answer: null,
            q39_incidents: [],
            q39_incidents_other: '',
            q40_endTime: '',
            additionalComments: '',
            capturedImage: null,
        };
    };

    const [formData, setFormData] = useState<SurveyFormState>(getInitialState());
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    
    useEffect(() => {
        try {
            localStorage.setItem('surveyData', JSON.stringify(formData));
        } catch (error) {
            console.error("Failed to save survey data to localStorage", error);
        }
    }, [formData]);

    const handleChange = useCallback((field: keyof SurveyFormState, value: string | number | boolean | null | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSync = async () => {
        if (!isOnline) {
            setSyncStatus('error');
            alert("No hay conexión a internet. No se puede sincronizar.");
            setTimeout(() => setSyncStatus('idle'), 3000);
            return;
        }
        setSyncStatus('syncing');
        
        try {
            const response = await fetch('/api/sync-to-sheet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en el servidor');
            }

            console.log("Syncing data:", formData);
            setSyncStatus('success');

        } catch (error) {
            console.error("Sync failed:", error);
            setSyncStatus('error');
        } finally {
            setTimeout(() => setSyncStatus('idle'), 3000);
        }
    };

    const resetForm = () => {
        if(window.confirm("¿Está seguro que desea borrar todos los datos del formulario? Esta acción no se puede deshacer.")) {
            localStorage.removeItem('surveyData');
            setFormData(getInitialState());
        }
    };

    const isTimeMoreThanOneHour = (timeString: string) => {
        if (!timeString) return false;
        const [hours, minutes] = timeString.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) return false;
        return hours > 1 || (hours === 1 && minutes > 0);
    };

    const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
        <div className="mt-8 mb-4 bg-gray-200 p-3 rounded-md text-center">
            <h3 className="font-bold text-gray-700">{title}</h3>
        </div>
    );

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <main className="max-w-4xl mx-auto p-4 md:p-8 bg-white shadow-lg">
                <Header formData={formData} handleChange={handleChange} />
                
                <div className="space-y-6 mt-6">
                    {/* Questions 1-12 */}
                    <QuestionCard number={1} text="Registre el porcentaje de carga de la batería del Dispositivo de Cómputo Móvil (DCM) del (de la) entrevistador(a) al inicio de la jornada laboral.">
                        <div className="flex items-center">
                            <input type="number" min="0" max="100" value={formData.q1_battery} onChange={e => handleChange('q1_battery', e.target.value)} className="w-24 p-2 border rounded-md" />
                            <span className="ml-2 text-lg font-semibold">%</span>
                        </div>
                    </QuestionCard>

                    <QuestionCard number={2} text="Registre la hora de salida del (de la) entrevistador(a) a campo.">
                        <input type="time" value={formData.q2_departureTime} onChange={e => handleChange('q2_departureTime', e.target.value)} className="w-32 p-2 border rounded-md" />
                    </QuestionCard>

                    <QuestionCard number={3} text="Registre la hora de llegada del (de la) entrevistador(a) a la localidad.">
                       <input type="time" value={formData.q3_arrivalTime} onChange={e => handleChange('q3_arrivalTime', e.target.value)} className="w-32 p-2 border rounded-md" />
                    </QuestionCard>

                    <QuestionCard number={4} text="¿El (la) entrevistador(a) acude con las autoridades locales (comisario(a) ejidal, tesorero(a), vocal, representante de colonos(as), delegado(a) municipal, etcétera) para presentarse e informarles acerca de la realización de la Encuesta Nacional Agropecuaria 2025, así como también para solicitarles información?">
                        <div>
                            <YesNoNaInput name="q4_answer" value={formData.q4_answer} onChange={(val) => handleChange('q4_answer', val)} />
                            {formData.q4_answer === 'no' && (
                                <ConditionalInput title="Si la respuesta es NO, indique la causa:" type="radio" options={[{ value: '1', label: 'No lo consideró necesario.' },{ value: '2', label: 'Desconoce dónde se localizan las autoridades.' },{ value: '3', label: 'Otra causa.' },]} value={formData.q4_cause} onChange={(val) => handleChange('q4_cause', val)} otherValue={formData.q4_cause_other} onOtherChange={(val) => handleChange('q4_cause_other', val)} showOther={formData.q4_cause === '3'} />
                            )}
                        </div>
                    </QuestionCard>
                    
                    <QuestionCard number={5} text="El (la) entrevistador(a), ¿porta el uniforme completo y documentos de identificación institucional?">
                         <YesNoNaInput name="q5_answer" value={formData.q5_answer} onChange={(val) => handleChange('q5_answer', val)} options={['yes', 'no']} />
                    </QuestionCard>

                    <QuestionCard number={6} text="El (la) entrevistador(a) ¿cuenta con todo el material necesario para el desarrollo de sus actividades?">
                         <div>
                            <YesNoNaInput name="q6_answer" value={formData.q6_answer} onChange={(val) => handleChange('q6_answer', val)} options={['yes', 'no']} />
                            {formData.q6_answer === 'no' && (
                                <ConditionalInput title="Si la respuesta es NO, especifique el tipo de material faltante:" type="checkbox" options={[{ value: '1', label: 'Material cartográfico de acuerdo con el área de trabajo.' },{ value: '2', label: 'Uniforme completo.' },{ value: '3', label: 'Bitácora de campo.' },{ value: '4', label: 'Guía de preguntas para identificar al informante adecuado.' },{ value: '5', label: 'Oficio de presentación.' },{ value: '6', label: 'Cuestionario impreso.' },{ value: '7', label: 'Otro.' },]} value={formData.q6_cause} onChange={(val) => handleChange('q6_cause', val)} otherValue={formData.q6_cause_other} onOtherChange={(val) => handleChange('q6_cause_other', val)} showOther={formData.q6_cause.includes('7')} />
                            )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number={7} text="¿El área administrativa le entrega al entrevistador los gastos de campo con oportunidad para el desarrollo de sus actividades?">
                        <YesNoNaInput name="q7_answer" value={formData.q7_answer} onChange={(val) => handleChange('q7_answer', val)} options={['yes', 'no']} />
                    </QuestionCard>

                    <QuestionCard number={8} text="Si fuera el caso, ¿le proporcionan con oportunidad al (a la) entrevistador(a) apoyo de transporte vehicular para el desarrollo de sus actividades?">
                        <YesNoNaInput name="q8_answer" value={formData.q8_answer} onChange={(val) => handleChange('q8_answer', val)} />
                    </QuestionCard>

                    <QuestionCard number={9} text="¿El (la) entrevistador(a) revisa su carga de trabajo en el Dispositivo de Cómputo Móvil (DCM)?">
                        <YesNoNaInput name="q9_answer" value={formData.q9_answer} onChange={(val) => handleChange('q9_answer', val)} options={['yes', 'no']} />
                    </QuestionCard>
                    
                    <QuestionCard number={10} text="¿El (la) entrevistador(a) realiza la programación semanal de acuerdo a las visitas a los (las) productores(as) y los terrenos a investigar, según la localidad a trabajar?">
                        <div>
                            <YesNoNaInput name="q10_answer" value={formData.q10_answer} onChange={(val) => handleChange('q10_answer', val)} options={['yes', 'no']} />
                            {formData.q10_answer === 'no' && (
                                <ConditionalInput title="Si la respuesta es NO, indique la causa:" type="radio" options={[{ value: '1', label: 'No cuenta con el material cartográfico y los planos de las localidades a trabajar de manera completa.' },{ value: '2', label: 'No organiza el orden de las visitas.' },{ value: '3', label: 'No conta com estes casos na localidade.' },{ value: '4', label: 'Otra causa.' },]} value={formData.q10_cause} onChange={(val) => handleChange('q10_cause', val)} otherValue={formData.q10_cause_other} onOtherChange={(val) => handleChange('q10_cause_other', val)} showOther={formData.q10_cause === '4'} />
                            )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number={11} text="¿El (la) entrevistador(a) selecciona los domicilios a visitar con base en la programación que realizó?">
                        <div>
                            <YesNoNaInput name="q11_answer" value={formData.q11_answer} onChange={(val) => handleChange('q11_answer', val)} options={['yes', 'no']} />
                            {formData.q11_answer === 'no' && (
                                <ConditionalInput title="Si la respuesta es NO, indique la causa:" type="radio" options={[{ value: '1', label: 'No realizó su programación y visita domicilios al azar.' },{ value: '2', label: 'Omite domicilios sin seguir su programación.' },{ value: '3', label: 'Otra causa.' },]} value={formData.q11_cause} onChange={(val) => handleChange('q11_cause', val)} otherValue={formData.q11_cause_other} onOtherChange={(val) => handleChange('q11_cause_other', val)} showOther={formData.q11_cause === '3'} />
                            )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number={12} text="Selecciona las estrategias observadas durante la visita de supervisión al (la) entrevistador(a).">
                         <ConditionalInput title="" type="checkbox" options={[{ value: '1', label: 'Acude al domicilio del productor.' },{ value: '2', label: 'Acude con autoridades ejidales, organizaciones o asociaciones de productores(as).' },{ value: '3', label: 'Acude al terreno.' },{ value: '4', label: 'Otra estrategia.' },]} value={formData.q12_strategies} onChange={(val) => handleChange('q12_strategies', val)} otherValue={formData.q12_strategy_other} onOtherChange={(val) => handleChange('q12_strategy_other', val)} showOther={formData.q12_strategies.includes('4')} />
                    </QuestionCard>
                    
                    {/* Questions 13 onwards */}
                    <QuestionCard number={13} text="¿Cuánto tiempo le ocupa al (la) entrevistador(a) localizar el domicilio de la persona productora?">
                        <div>
                             <input type="time" value={formData.q13_time} onChange={e => handleChange('q13_time', e.target.value)} className="w-32 p-2 border rounded-md" />
                             {isTimeMoreThanOneHour(formData.q13_time) && (
                                <ConditionalInput title="Si la respuesta es más de una hora, indique la causa:" type="radio" options={[{value: '1', label: 'Se presentaron dificultades para localizar al (la) productor(a).'}, {value: '2', label: 'No se encontró al (la) productor(a).'}, {value: '3', label: 'Otra causa.'}]} value={formData.q13_cause} onChange={(v) => handleChange('q13_cause', v)} otherValue={formData.q13_cause_other} onOtherChange={(v) => handleChange('q13_cause_other', v)} showOther={formData.q13_cause === '3'} />
                             )}
                        </div>
                    </QuestionCard>

                     <QuestionCard number={14} text="¿Cuánto tiempo tarda el (la) entrevistador(a) en acudir o ubicar a alguna autoridad local como: comisario(a) ejidal, encargado(a) del distrito de riego, etcétera?">
                        <div>
                             <input type="time" value={formData.q14_time} onChange={e => handleChange('q14_time', e.target.value)} className="w-32 p-2 border rounded-md" />
                             {isTimeMoreThanOneHour(formData.q14_time) && (
                                <ConditionalInput title="Si la respuesta es más de una hora, indique la causa:" type="radio" options={[{value: '1', label: 'No existe transporte hasta la localidad.'}, {value: '2', label: 'Por problemas de acceso a la localidad (caminos en mal estado).'}, {value: '3', label: 'Otra causa.'}]} value={formData.q14_cause} onChange={(v) => handleChange('q14_cause', v)} otherValue={formData.q14_cause_other} onOtherChange={(v) => handleChange('q14_cause_other', v)} showOther={formData.q14_cause === '3'} />
                             )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number={15} text="¿El (la) entrevistador(a) utiliza medios de transporte alternativos para acudir a los terrenos donde investigará los datos del (la) productor(a)?">
                        <div>
                            <YesNoNaInput name="q15_answer" value={formData.q15_answer} onChange={(v) => handleChange('q15_answer', v)} options={['yes', 'no']} />
                            {formData.q15_answer === 'yes' && (
                                <ConditionalInput title="Si la respuesta es Sí, indique el tipo de medio utilizado:" type="radio" options={[{value: '1', label: 'Vehículo particular.'}, {value: '2', label: 'Transporte público.'}, {value: '3', label: 'Otro tipo de medio.'}]} value={formData.q15_medium} onChange={(v) => handleChange('q15_medium', v)} otherValue={formData.q15_medium_other} onOtherChange={(v) => handleChange('q15_medium_other', v)} showOther={formData.q15_medium === '3'} />
                            )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number={16} text="¿Cuando se trata de un terreno del Marco Área, ¿el (la) entrevistador(a) investiga el nombre del (la) productor(a) y su domicilio?">
                        <div>
                            <YesNoNaInput name="q16_answer" value={formData.q16_answer} onChange={(v) => handleChange('q16_answer', v)} options={['yes', 'no']} />
                            {formData.q16_answer === 'yes' && (
                                <ConditionalInput title="Si la respuesta es Sí, indique las investigaciones realizadas:" type="radio" options={[{value: '1', label: 'Acude con los (las) habitantes de la localidad.'}, {value: '2', label: 'Acude con las autoridades de la localidad.'}, {value: '3', label: 'Otra.'}]} value={formData.q16_investigation} onChange={(v) => handleChange('q16_investigation', v)} otherValue={formData.q16_investigation_other} onOtherChange={(v) => handleChange('q16_investigation_other', v)} showOther={formData.q16_investigation === '3'} />
                            )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number={17} text="Como resultado de las visitas a los domicilios de los (las) productores(as) durante la supervisión, ¿el (la) entrevistador(a) identificó las siguientes situaciones?">
                        <ConditionalInput title="" type="radio" options={[{value: '1', label: 'Productor(a) o informante presente y disponible para la entrevista.'}, {value: '2', label: 'Ausencia de productor(a) o informante.'}, {value: '3', label: 'Negativa.'}, {value: '4', label: 'Productor(a) no localizado en ese domicilio.'}, {value: '5', label: 'Productor(a) no captado por ubicarse en zona de riesgo.'}, {value: '6', label: 'Otra situación.'}]} value={formData.q17_situation} onChange={(v) => handleChange('q17_situation', v)} otherValue={formData.q17_situation_other} onOtherChange={(v) => handleChange('q17_situation_other', v)} showOther={formData.q17_situation === '6'} />
                    </QuestionCard>

                    <QuestionCard number={18} text="Si el (la) productor(a) registrado en el directorio no se encuentra en el domicilio, ¿el entrevistador utiliza la Guía para identificar al informante adecuado, ENA 2025?">
                         <div>
                            <YesNoNaInput name="q18_answer" value={formData.q18_answer} onChange={(v) => handleChange('q18_answer', v)} options={['yes', 'no']} />
                            {formData.q18_answer === 'no' && (
                                <ConditionalInput title="Si la respuesta es NO, indique la causa:" type="radio" options={[{value: '1', label: 'No la conoce.'}, {value: '2', label: 'No la consideró como necesaria para el desarrollo de sus actividades.'}, {value: '3', label: 'No lleva la Guía para identificar al (la) informante adecuado(a), ENA 2025.'}, {value: '4', label: 'Otra causa.'}]} value={formData.q18_cause} onChange={(v) => handleChange('q18_cause', v)} otherValue={formData.q18_cause_other} onOtherChange={(v) => handleChange('q18_cause_other', v)} showOther={formData.q18_cause === '4'} />
                            )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number={19} text="Con base en el periodo de referencia (de octubre del año pasado a septiembre de este año), ¿el (la) entrevistador(a) le pregunta al (la) productor(a) si fue responsable del manejo de terrenos, parcelas o predios?">
                         <div>
                            <YesNoNaInput name="q19_answer" value={formData.q19_answer} onChange={(v) => handleChange('q19_answer', v)} options={['yes', 'no']} />
                            {formData.q19_answer === 'no' && (
                                <ConditionalInput title="Si la respuesta es NO, selecciona la causa por la cual no manejó la unidad de producción en el periodo señalado." type="radio" options={[{value: '1', label: 'Vendió los terrenos.'}, {value: '2', label: 'Rentó los terrenos.'}, {value: '3', label: 'Heredó los terrenos.'}, {value: '4', label: 'Prestó los terrenos.'}, {value: '5', label: 'Nunca manejo terrenos en este municipio.'}, {value: '6', label: 'Otro tipo de cesión de los terrenos.'}]} value={formData.q19_cause} onChange={(v) => handleChange('q19_cause', v)} otherValue={formData.q19_cause_other} onOtherChange={(v) => handleChange('q19_cause_other', v)} showOther={formData.q19_cause === '6'} />
                            )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number={20} text="¿El (la) entrevistador(a) tuvo dificultades para ubicar la vivienda del (de la) productor(a) en el Módulo Cartográfico?">
                         <div>
                            <YesNoNaInput name="q20_answer" value={formData.q20_answer} onChange={(v) => handleChange('q20_answer', v)} options={['yes', 'no']} />
                            {formData.q20_answer === 'yes' && (
                                <ConditionalInput title="Si la respuesta es SÍ, indique la causa:" type="radio" options={[{value: '1', label: 'No se puede realizar el acercamiento a la localidad.'}, {value: '2', label: 'No encontró la manzana.'}, {value: '3', label: 'El (la) entrevistador(a) no sabe ubicarse en la localidad.'}, {value: '4', label: 'Otra causa.'}]} value={formData.q20_cause} onChange={(v) => handleChange('q20_cause', v)} otherValue={formData.q20_cause_other} onOtherChange={(v) => handleChange('q20_cause_other', v)} showOther={formData.q20_cause === '4'} />
                            )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number={21} text="El (la) entrevistador(a), ¿actualiza el nombre y/o domicilio del (de la) productor(a) con base en la Norma Técnica sobre Domicilios Geográficos?">
                        <div>
                            <YesNoNaInput name="q21_answer" value={formData.q21_answer} onChange={(v) => handleChange('q21_answer', v)} options={['yes', 'no']} />
                            {formData.q21_answer === 'no' && (
                                <ConditionalInput title="Si la respuesta es NO, indique la causa:" type="radio" options={[{value: '1', label: 'El (la) entrevistador(a) no verifica con del (la) productor(a) el nombre de la vialidad, ni lo actualiza.'}, {value: '2', label: 'Otra causa.'}]} value={formData.q21_cause} onChange={(v) => handleChange('q21_cause', v)} otherValue={formData.q21_cause_other} onOtherChange={(v) => handleChange('q21_cause_other', v)} showOther={formData.q21_cause === '2'} />
                            )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number={22} text="En caso de presentarse desconfianza o negativa por parte del (la) productor(a), ¿el (la) entrevistador(a) le facilita el número de teléfono o la dirección de internet del INEGI para que verifique su identidad como personal del Instituto, o bien, trata de sensibilizarlo?">
                        <div>
                            <YesNoNaInput name="q22_answer" value={formData.q22_answer} onChange={(v) => handleChange('q22_answer', v)} />
                            {formData.q22_answer === 'no' && (
                                <ConditionalInput title="Si la respuesta es NO, indique la causa:" type="radio" options={[{value: '1', label: 'Olvida proporcionar esta información al (la) productor(a).'}, {value: '2', label: 'No lo consideró necesario.'}, {value: '3', label: 'Solicita apoyo del (de la) jefe(a) de campo para sensibilizarlo.'}, {value: '4', label: 'Otra causa.'}]} value={formData.q22_cause} onChange={(v) => handleChange('q22_cause', v)} otherValue={formData.q22_cause_other} onOtherChange={(v) => handleChange('q22_cause_other', v)} showOther={formData.q22_cause === '4'} />
                            )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number={23} text="Durante el proceso de la verificación de los terrenos, ¿el (la) productor(a) pudo identificar correctamente el (los) terreno(s) mostrados en el sistema?">
                        <div>
                            <YesNoNaInput name="q23_answer" value={formData.q23_answer} onChange={(v) => handleChange('q23_answer', v)} options={['yes', 'no']} />
                            {formData.q23_answer === 'no' && (
                                <ConditionalInput title="Si la respuesta es NO, indique la causa:" type="radio" options={[{value: '1', label: 'Los terrenos mostrados en el módulo cartográfico no corresponden con los manejados por el (la) productor(a).'}, {value: '2', label: 'El C no reconoce los terrenos.'}, {value: '3', label: 'El (la) productor(a) no logra ubicarse en el módulo cartográfico y el (la) entrevistador(a) no pudo orientarlo.'}, {value: '4', label: 'Otra causa.'}]} value={formData.q23_cause} onChange={(v) => handleChange('q23_cause', v)} otherValue={formData.q23_cause_other} onOtherChange={(v) => handleChange('q23_cause_other', v)} showOther={formData.q23_cause === '4'} />
                            )}
                        </div>
                    </QuestionCard>

                    <SectionHeader title="Llenado del cuestionario" />

                    <QuestionCard number={24} text="Durante el llenado del cuestionario, ¿el (la) entrevistador(a) le explica las dudas expresadas por el (la) productor(a) de manera adecuada?">
                        <div>
                            <YesNoNaInput name="q24_answer" value={formData.q24_answer} onChange={(v) => handleChange('q24_answer', v)} options={['yes', 'no']} />
                            {formData.q24_answer === 'yes' && (
                                <ConditionalInput title="Si la respuesta es SÍ, indique el tipo de situación presentada:" type="radio" options={[{value: '1', label: 'Consulta el manual o el glosario del sistema.'}, {value: '2', label: 'Aclara las dudas con sus propias palabras.'}, {value: '3', label: 'Otra.'}]} value={formData.q24_situation} onChange={(v) => handleChange('q24_situation', v)} otherValue={formData.q24_situation_other} onOtherChange={(v) => handleChange('q24_situation_other', v)} showOther={formData.q24_situation === '3'} />
                            )}
                        </div>
                    </QuestionCard>
                    
                    <QuestionCard number={25} text="De la misma manera, ¿se conduce de acuerdo con las indicaciones del Instructivo de llenado del cuestionario de la ENA 2025?">
                         <div>
                            <YesNoNaInput name="q25_answer" value={formData.q25_answer} onChange={(v) => handleChange('q25_answer', v)} options={['yes', 'no']} />
                            {formData.q25_answer === 'no' && (
                                <ConditionalInput title="Si la respuesta es NO, indique la causa:" type="radio" options={[{value: '1', label: 'No lee las preguntas textualmente.'}, {value: '2', label: 'Por observación omite algunas preguntas.'}, {value: '3', label: 'Otra causa.'}]} value={formData.q25_cause} onChange={(v) => handleChange('q25_cause', v)} otherValue={formData.q25_cause_other} onOtherChange={(v) => handleChange('q25_cause_other', v)} showOther={formData.q25_cause === '3'} />
                            )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number={26} text="¿Se le presentó algún tipo de problema al (la) entrevistador(a) durante el llenado del cuestionario con el (la) productor(a)?">
                         <div>
                            <YesNoNaInput name="q26_answer" value={formData.q26_answer} onChange={(v) => handleChange('q26_answer', v)} options={['yes', 'no']} />
                            {formData.q26_answer === 'yes' && (
                                <ConditionalInput title="Si la respuesta es SÍ, especifique la situación presentada:" type="radio" options={[{value: '1', label: 'El (la persona) informante suspendió la entrevista.'}, {value: '2', label: 'El (la persona) informante no entiende las preguntas del cuestionario.'}, {value: '3', label: 'El (la persona) informante manifestó que el cuestionario es demasiado largo.'}, {value: '4', label: 'El (la persona) informante se negó a proporcionar algún dato o respuesta a una pregunta del cuestionario.'}, {value: '5', label: 'Otra situación.'}]} value={formData.q26_situation} onChange={(v) => handleChange('q26_situation', v)} otherValue={formData.q26_situation_other} onOtherChange={(v) => handleChange('q26_situation_other', v)} showOther={formData.q26_situation === '5'} />
                            )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number={27} text="Al término de la aplicación del cuestionario, ¿el (la) entrevistador(a) le entrega la Carta de Agradecimiento al (la) productor(a)?">
                         <div>
                            <YesNoNaInput name="q27_answer" value={formData.q27_answer} onChange={(v) => handleChange('q27_answer', v)} options={['yes', 'no']} />
                            {formData.q27_answer === 'no' && (
                                <ConditionalInput title="Si la respuesta es NO, indique la causa:" type="radio" options={[{value: '1', label: 'El (la) entrevistador(a) olvida entregar esta carta al productor.'}, {value: '2', label: 'El (la) entrevistador(a) no lleva a campo este formato.'}, {value: '3', label: 'Otra causa.'}]} value={formData.q27_cause} onChange={(v) => handleChange('q27_cause', v)} otherValue={formData.q27_cause_other} onOtherChange={(v) => handleChange('q27_cause_other', v)} showOther={formData.q27_cause === '3'} />
                            )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number={28} text="¿En qué número de visita captó la información de esta unidad de producción en el cuestionario?">
                        <input type="number" min="1" value={formData.q28_visitNumber} onChange={e => handleChange('q28_visitNumber', e.target.value)} className="w-24 p-2 border rounded-md" />
                    </QuestionCard>

                    <QuestionCard number={29} text="Si el (la) entrevistador(a) no encuentra al (la) productor(a) en el domicilio, ¿registra la visita en el DCM y le entrega a la persona que lo atendió un Aviso de visita?">
                         <div>
                            <YesNoNaInput name="q29_answer" value={formData.q29_answer} onChange={(v) => handleChange('q29_answer', v)} options={['yes', 'no']} />
                            {formData.q29_answer === 'no' && (
                                <ConditionalInput title="Si la respuesta es NO, indique la causa:" type="radio" options={[{value: '1', label: 'No registra la visita en el DCM y no entrega el aviso de visita.'}, {value: '2', label: 'No conta com avisos de visita.'}, {value: '3', label: 'No conoce el aviso de visita.'}, {value: '4', label: 'Otra causa.'}]} value={formData.q29_cause} onChange={(v) => handleChange('q29_cause', v)} otherValue={formData.q29_cause_other} onOtherChange={(v) => handleChange('q29_cause_other', v)} showOther={formData.q29_cause === '4'} />
                            )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number={30} text="¿El (la) entrevistador(a) investiga el nuevo domicilio del (de la) productor(a) cuando este ya no reside en el domicilio, o ya no es el (la) mismo(a) productor(a) que tiene egistrado en el directorio?">
                         <div>
                            <YesNoNaInput name="q30_answer" value={formData.q30_answer} onChange={(v) => handleChange('q30_answer', v)} options={['yes', 'no']} />
                            {formData.q30_answer === 'yes' && (
                                <ConditionalInput title="Si la respuesta es SÍ, indique el tipo de situación presentada:" type="radio" options={[{value: '1', label: 'El domicilio visitado es una vivienda deshabitada y se desconoce el nuevo domicilio del (de la) productor(a).'}, {value: '2', label: 'En la vivienda visitada, informan que el (la) productor(a) no vive ahí y desconocen el nuevo domicilio del (de la) productor(a).'}, {value: '3', label: 'La obtención del nuevo domicilio de un (una) productor (a), se ubica en una localidad urbana y los datos registrados son insuficientes.'}]} value={formData.q30_situation} onChange={(v) => handleChange('q30_situation', v)} />
                            )}
                        </div>
                    </QuestionCard>
                    
                    <QuestionCard number={31} text="A pesar de la investigación realizada no se obtiene el nuevo domicilio del (de la) productor (a), ¿el (la) entrevistador(a) determina las circunstancias por las cuales no se puede obtener su residencia actual?">
                        <div>
                            <YesNoNaInput name="q31_answer" value={formData.q31_answer} onChange={(v) => handleChange('q31_answer', v)} options={['yes', 'no']} />
                            {formData.q31_answer === 'yes' && (
                                <ConditionalInput title="Si la respuesta es SÍ, indique el tipo de situación presentada:" type="radio" options={[{value: '1', label: 'Los (las) informantes consultados(as) desconocen al (a la) productor(a) actual de la UP y se asignó un código de productor no localizado.'}, {value: '2', label: 'Al acudir al terreno, este presenta actividad pero no se encontró algún (alguna) informante que pudiera dar los datos del (de la) productor(a).'}, {value: '3', label: 'Son terrenos que no presentan actividad por lo que se aplicó un cuestionario por terreno.'}]} value={formData.q31_situation} onChange={(v) => handleChange('q31_situation', v)} />
                            )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number={32} text="Durante la visita de supervisión, ¿el (la) entrevistador(a) se encontró con algún domicilio que se localice en una zona de alto riesgo y que no pueda visitar?">
                         <div>
                            <YesNoNaInput name="q32_answer" value={formData.q32_answer} onChange={(v) => handleChange('q32_answer', v)} options={['yes', 'no']} />
                            {formData.q32_answer === 'yes' && (
                                <ConditionalInput title="Si la respuesta es SÍ, indique el tipo de situación presentada:" type="radio" options={[{value: '1', label: 'El (la) jefe(a) de campo le informó de estos casos en campo con anterioridad.'}, {value: '2', label: 'El (la) entrevistador(a) los detectó durante su visita a la localidad.'}, {value: '3', label: 'Otra.'}]} value={formData.q32_situation} onChange={(v) => handleChange('q32_situation', v)} otherValue={formData.q32_situation_other} onOtherChange={(v) => handleChange('q32_situation_other', v)} showOther={formData.q32_situation === '3'} />
                            )}
                        </div>
                    </QuestionCard>
                    
                    <QuestionCard number={33} text="Solicita al (a la) entrevistador(a) que te muestre en el DCM el reporte de productores(as) por código y registra la cantidad de códigos pendientes:">
                        <div className="w-full md:w-96 space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-4 items-center">
                                <span className="font-semibold">Tipo de código de pendiente:</span>
                                <span className="font-semibold text-center">¿Cuántos?</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 items-center">
                                <span><span className="font-bold">02</span> Ausencia de productor(a) o informante.</span>
                                <input type="number" min="0" value={formData.q33_pending_02} onChange={e => handleChange('q33_pending_02', e.target.value)} className="w-24 p-1 border rounded-md mx-auto" />
                            </div>
                             <div className="grid grid-cols-2 gap-4 items-center">
                                <span><span className="font-bold">03</span> Negativa.</span>
                                <input type="number" min="0" value={formData.q33_pending_03} onChange={e => handleChange('q33_pending_03', e.target.value)} className="w-24 p-1 border rounded-md mx-auto" />
                            </div>
                             <div className="grid grid-cols-2 gap-4 items-center">
                                <span><span className="font-bold">04</span> Entrevista incompleta.</span>
                                <input type="number" min="0" value={formData.q33_pending_04} onChange={e => handleChange('q33_pending_04', e.target.value)} className="w-24 p-1 border rounded-md mx-auto" />
                            </div>
                             <div className="grid grid-cols-2 gap-4 items-center">
                                <span><span className="font-bold">05</span> Productor(a) en proceso de investigación.</span>
                                <input type="number" min="0" value={formData.q33_pending_05} onChange={e => handleChange('q33_pending_05', e.target.value)} className="w-24 p-1 border rounded-md mx-auto" />
                            </div>
                        </div>
                    </QuestionCard>

                    <QuestionCard number={34} text="¿El (la) entrevistador(a) realiza la transferencia de la información diariamente desde su DCM?">
                        <div>
                            <YesNoNaInput name="q34_answer" value={formData.q34_answer} onChange={(v) => handleChange('q34_answer', v)} options={['yes', 'no']} />
                            {formData.q34_answer === 'no' && (
                                <ConditionalInput title="Si la respuesta es NO, indique la causa:" type="radio" options={[{value: '1', label: 'Tuvo fallas con el DCM al momento de hacer la transferencia de la información.'}, {value: '2', label: 'En el área de trabajo no se cuenta con acceso a internet.'}, {value: '3', label: 'Otra causa.'}]} value={formData.q34_cause} onChange={(v) => handleChange('q34_cause', v)} otherValue={formData.q34_cause_other} onOtherChange={(v) => handleChange('q34_cause_other', v)} showOther={formData.q34_cause === '3'} />
                            )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number="34.4A" text="De acuerdo con lo anterior, ¿cómo realizas la transferencia de la información?">
                        <input type="text" value={formData.q34a_transferMethod} onChange={e => handleChange('q34a_transferMethod', e.target.value)} className="w-full md:w-80 p-2 border rounded-md" />
                    </QuestionCard>

                    <QuestionCard number={35} text="Desde el inicio de la supervisión, ¿el (la) entrevistador(a) ha recibido visitas de supervisión, ya sea del (de la) jefe(a) de campo o de otra figura operativa?">
                        <div>
                            <YesNoNaInput name="q35_answer" value={formData.q35_answer} onChange={(v) => handleChange('q35_answer', v)} options={['yes', 'no']} />
                            {formData.q35_answer === 'no' && (
                                <ConditionalInput title="Si la respuesta es NO, indique la causa:" type="radio" options={[{value: '1', label: 'La localidad está muy alejada de la oficina.'}, {value: '2', label: 'No ha visto a nadie de los (las) supervisores(as) u otra figura operativa en el área de trabajo.'}, {value: '3', label: 'Otra causa.'}]} value={formData.q35_cause} onChange={(v) => handleChange('q35_cause', v)} otherValue={formData.q35_cause_other} onOtherChange={(v) => handleChange('q35_cause_other', v)} showOther={formData.q35_cause === '3'} />
                            )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number={36} text="Si el (la) entrevistador(a) ya recibió alguna visita de supervisión y apoyo, ¿los resultados obtenidos de estas visitas fueron los esperados?">
                        <div>
                            <YesNoNaInput name="q36_answer" value={formData.q36_answer} onChange={(v) => handleChange('q36_answer', v)} options={['yes', 'no']} />
                            {formData.q36_answer === 'no' && (
                                <ConditionalInput title="Si la respuesta es NO, indique la causa:" type="radio" options={[{value: '1', label: 'No le pudieron resolver la situación presentada.'}, {value: '2', label: 'No pudo reportar la situación presentada con oportunidad.'}, {value: '3', label: 'Otra causa.'}]} value={formData.q36_cause} onChange={(v) => handleChange('q36_cause', v)} otherValue={formData.q36_cause_other} onOtherChange={(v) => handleChange('q36_cause_other', v)} showOther={formData.q36_cause === '3'} />
                            )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number={37} text="¿Cuántos cuestionarios ha aplicado el (la) entrevistador(a) en esta semana?">
                        <input type="number" min="0" value={formData.q37_questionnaires_week} onChange={e => handleChange('q37_questionnaires_week', e.target.value)} className="w-24 p-2 border rounded-md" />
                    </QuestionCard>

                     <QuestionCard number="37.1" text="Y, ¿cuántos cuestionarios ha captado en promedio por día durante esta semana?">
                        <input type="number" min="0" value={formData.q37_1_questionnaires_day} onChange={e => handleChange('q37_1_questionnaires_day', e.target.value)} className="w-24 p-2 border rounded-md" />
                    </QuestionCard>

                    <QuestionCard number={38} text="¿De cuántos terrenos sin productor(a) se ha obtenido informacion durante esta semana?">
                        <input type="number" min="0" value={formData.q38_terrains_week} onChange={e => handleChange('q38_terrains_week', e.target.value)} className="w-24 p-2 border rounded-md" />
                    </QuestionCard>

                     <QuestionCard number="38.1" text="Y de estos, ¿de cuántos se ha captado un cuestionario?">
                        <input type="number" min="0" value={formData.q38_1_terrains_captured} onChange={e => handleChange('q38_1_terrains_captured', e.target.value)} className="w-24 p-2 border rounded-md" />
                    </QuestionCard>

                    <SectionHeader title="Dispositivo de Cómputo Móvil" />

                    <QuestionCard number={39} text="Durante tu supervisión al entrevistador, ¿el DCM presentó alguna incidencia o falla?">
                         <div>
                            <YesNoNaInput name="q39_answer" value={formData.q39_answer} onChange={(v) => handleChange('q39_answer', v)} options={['yes', 'no']} />
                            {formData.q39_answer === 'yes' && (
                                <ConditionalInput title="Si la respuesta es SÍ, selecciona el tipo de incidencia o falla presentada:" type="checkbox" options={[{value: '1', label: 'Robo.'}, {value: '2', label: 'Presencia de grupos delictivos, autodefensa, etcétera.'}, {value: '3', label: 'Presencia de cambios climatológicos y dañaron el DCM.'}, {value: '4', label: 'Por caída del Dispositivo de Cómputo Móvil.'}, {value: '5', label: 'Falla en el Módulo Cartográfico Censal.'}, {value: '6', label: 'Se inhibió el sistema.'}, {value: '7', label: 'Problemas con las transferencias de envío.'}, {value: '8', label: 'Otro.'}]} value={formData.q39_incidents} onChange={(v) => handleChange('q39_incidents', v)} otherValue={formData.q39_incidents_other} onOtherChange={(v) => handleChange('q39_incidents_other', v)} showOther={formData.q39_incidents.includes('8')} />
                            )}
                        </div>
                    </QuestionCard>

                    <QuestionCard number={40} text="Registre la hora de término de la jornada laboral del (la) entrevistador(a).">
                       <input type="time" value={formData.q40_endTime} onChange={e => handleChange('q40_endTime', e.target.value)} className="w-32 p-2 border rounded-md" />
                    </QuestionCard>
                </div>
                
                <div className="mt-8 border-t-2 border-black pt-4">
                     <h3 className="font-bold text-gray-700 mb-2">COMENTARIOS ADICIONALES DEL (LA) SUPERVISOR(A).</h3>
                     <textarea value={formData.additionalComments} onChange={e => handleChange('additionalComments', e.target.value)} className="w-full h-32 p-2 border rounded-md" placeholder="Escriba sus comentarios aquí..."></textarea>
                </div>

            </main>
            <CameraFab image={formData.capturedImage} onCapture={(image) => handleChange('capturedImage', image)} />
            <Footer isOnline={isOnline} syncStatus={syncStatus} onSync={handleSync} onReset={resetForm} />
        </div>
    );
};

export default App;