import React from 'react';

interface GuiaVisualProps {
    onBack: () => void;
}

const GuiaVisual: React.FC<GuiaVisualProps> = ({ onBack }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <style>
                {`
                    @media print {
                        body, .bg-gray-100 {
                            background-color: #fff !important;
                        }
                        #guia-visual-container {
                             padding: 0;
                        }
                        #guia-visual {
                            box-shadow: none;
                            margin: 0;
                            max-width: 100%;
                        }
                        .no-print {
                            display: none;
                        }
                    }
                `}
            </style>
            <div id="guia-visual-container" className="p-4 md:p-8">
                 <div id="guia-visual" className="max-w-4xl mx-auto bg-white shadow-lg p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Guía Visual de Llenado</h1>
                            <p className="text-lg text-gray-600">Encuesta Nacional Agropecuaria 2025</p>
                        </div>
                        <div className="no-print flex items-center space-x-2">
                            <button onClick={onBack} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors">
                                Volver
                            </button>
                            <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                                Imprimir / Guardar PDF
                            </button>
                        </div>
                    </div>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-blue-800 no-print">
                        <p><span className="font-bold">Nota:</span> Para guardar esta guía como PDF, haga clic en el botón "Imprimir / Guardar PDF" y en el diálogo de impresión, seleccione "Guardar como PDF" en el destino.</p>
                    </div>

                    {/* Sections */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold border-b-2 border-gray-300 pb-2 mb-4">1. Introducción y Funciones Principales</h2>
                        <p className="mb-4">Esta guía proporciona instrucciones y aclara las restricciones para el llenado correcto del cuestionario de supervisión. La aplicación está diseñada para funcionar sin conexión a internet, guardando todos los datos localmente en su dispositivo.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-md border">
                                <h3 className="font-bold">Guardar y Nuevo</h3>
                                <p className="text-sm">Crea un nuevo formulario en blanco y guarda el actual. Útil para iniciar la supervisión de un nuevo entrevistador.</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md border">
                                <h3 className="font-bold">Encuestas Guardadas</h3>
                                <p className="text-sm">Muestra una lista de todas las encuestas que ha guardado. Puede cargar una encuesta existente para continuarla o borrarla.</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md border">
                                <h3 className="font-bold">Descargar CSV</h3>
                                <p className="text-sm">Genera un archivo CSV con los datos de la encuesta activa. Es una medida de seguridad para respaldar la información en su dispositivo.</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md border">
                                <h3 className="font-bold">Sincronizar a la Nube</h3>
                                <p className="text-sm">Envía los datos de la encuesta activa a la hoja de cálculo central. Este botón solo funciona cuando tiene conexión a internet.</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md border">
                                <h3 className="font-bold">Botón de Cámara</h3>
                                <p className="text-sm">Permite tomar una foto (o seleccionarla de la galería) para adjuntarla como evidencia a la supervisión. Aparece en la esquina inferior derecha.</p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold border-b-2 border-gray-300 pb-2 mb-4">2. Llenado de la Cabecera</h2>
                        <p className="mb-4">La primera sección contiene datos de identificación. Todos los campos son importantes.</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>MUNICIPIO, ENTREVISTADOR(A), SEMANA:</strong> Campos de texto libre.</li>
                            <li><strong>JEFE(A) DE CAMPO:</strong> Es un menú desplegable. <span className="font-bold text-red-600">Debe seleccionar una opción del 1 al 7.</span> No se puede dejar en blanco.</li>
                            <li><strong>FECHA DE SUPERVISIÓN:</strong> Utilice el selector de fecha para ingresar la fecha correcta.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold border-b-2 border-gray-300 pb-2 mb-4">3. Restricciones en Preguntas</h2>
                        <p className="mb-4">Es crucial respetar las siguientes reglas para garantizar la calidad de los datos:</p>
                        <ul className="list-disc list-inside space-y-3">
                            <li>
                                <strong>Preguntas de Sí / No / No Aplica:</strong>
                                <p className="pl-6 text-sm">Seleccione la opción que corresponda. En muchas preguntas, al seleccionar "No" (o a veces "Sí"), aparecerá un sub-formulario de color verde lima para que especifique la causa. Es obligatorio llenar esta información adicional.</p>
                            </li>
                            <li>
                                <strong>Preguntas 13 y 14 (Tiempo tardado):</strong>
                                <p className="pl-6 text-sm">Estos campos ahora son de texto libre. Puede escribir duraciones como <span className="font-mono bg-gray-200 px-1 rounded">"1 hora 20 minutos"</span>, <span className="font-mono bg-gray-200 px-1 rounded">"45 min"</span>, etc. Si el tiempo es superior a una hora, se mostrará un campo adicional para indicar la causa.</p>
                            </li>
                            <li>
                                <strong>Preguntas con Múltiples Opciones (Checkbox):</strong>
                                <p className="pl-6 text-sm">En preguntas como la 6 o la 12, puede seleccionar más de una opción. Si selecciona "Otro", debe especificar en el campo de texto que aparece.</p>
                            </li>
                            <li>
                                <strong>Campos Numéricos:</strong>
                                <p className="pl-6 text-sm">Preguntas como la 1 (Batería), 28 (No. de visita) o 33 (Códigos pendientes) solo aceptan números. Ingrese únicamente dígitos.</p>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold border-b-2 border-gray-300 pb-2 mb-4">4. Flujo de Trabajo Recomendado</h2>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>Al iniciar, complete toda la información de la cabecera.</li>
                            <li>Responda cada pregunta en orden. Lea cuidadosamente cada pregunta antes de responder.</li>
                            <li>Si una pregunta requiere una causa o especificación, llénela antes de continuar.</li>
                            <li>Use el botón de la cámara para tomar una foto relevante si es necesario. Puede ser del lugar, de un documento, etc.</li>
                            <li>Al finalizar, escriba sus observaciones en la sección de "Comentarios Adicionales".</li>
                            <li>Use "Guardar y Nuevo" si va a supervisar a otro entrevistador.</li>
                            <li>Periódicamente (al final del día o cuando tenga conexión), use "Sincronizar a la Nube" para enviar los datos.</li>
                            <li>Use "Descargar CSV" como respaldo personal en cualquier momento.</li>
                        </ol>
                    </section>

                    <div className="mt-12 pt-4 border-t text-center text-xs text-gray-500">
                        <p>Guía generada para la Encuesta Nacional Agropecuaria 2025. Versión 1.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuiaVisual;
