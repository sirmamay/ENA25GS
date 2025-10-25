import React, { useRef } from 'react';

interface CameraFabProps {
    image: string | null;
    onCapture: (image: string | null) => void;
}

const CameraFab: React.FC<CameraFabProps> = ({ image, onCapture }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFabClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onCapture(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
        event.target.value = '';
    };

    const handleClearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        onCapture(null);
    };

    return (
        <div className="fixed bottom-24 right-4 md:right-8 z-20 flex flex-col items-end space-y-2">
            {image && (
                <div className="relative group">
                    <img src={image} alt="Captured" className="w-24 h-24 rounded-lg object-cover shadow-lg border-2 border-white" />
                    <button
                        onClick={handleClearImage}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Eliminar imagen"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            )}
            <button
                onClick={handleFabClick}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-110"
                aria-label="Tomar foto"
            >
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={inputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    aria-hidden="true"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
        </div>
    );
};

export default CameraFab;
