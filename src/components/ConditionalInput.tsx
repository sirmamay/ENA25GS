import React from 'react';

interface Option {
    value: string;
    label: string;
}

interface ConditionalInputProps {
    title: string;
    type: 'radio' | 'checkbox';
    options: Option[];
    value: string | string[];
    onChange: (value: any) => void;
    otherValue?: string;
    onOtherChange?: (value: string) => void;
    showOther?: boolean;
    name: string;
}

const ConditionalInput: React.FC<ConditionalInputProps> = ({ title, type, options, value, onChange, otherValue, onOtherChange, showOther, name }) => {
    
    const handleCheckboxChange = (optionValue: string) => {
        const currentValue = Array.isArray(value) ? value : [];
        const newValue = currentValue.includes(optionValue)
            ? currentValue.filter(v => v !== optionValue)
            : [...currentValue, optionValue];
        onChange(newValue);
    };

    return (
        <div className="mt-4 bg-lime-50 border-l-4 border-lime-500 p-4">
            {title && <h4 className="font-semibold text-sm text-gray-700 mb-3">{title}</h4>}
            <div className="space-y-2">
                {options.map((option) => (
                    <label key={option.value} className="flex items-center text-sm text-gray-800">
                        {type === 'radio' ? (
                             <input
                                type="radio"
                                name={name}
                                value={option.value}
                                checked={value === option.value}
                                onChange={(e) => onChange(e.target.value)}
                                className="mr-3 h-4 w-4 text-lime-600 focus:ring-lime-500 border-gray-300"
                            />
                        ) : (
                            <input
                                type="checkbox"
                                name={option.value}
                                value={option.value}
                                checked={Array.isArray(value) && value.includes(option.value)}
                                onChange={() => handleCheckboxChange(option.value)}
                                className="mr-3 h-4 w-4 text-lime-600 focus:ring-lime-500 border-gray-300 rounded"
                            />
                        )}
                        <span><span className="font-bold mr-2">{option.value}</span>{option.label}</span>
                    </label>
                ))}
                {showOther && onOtherChange && (
                    <div className="pl-7 mt-2">
                        <label className="text-xs font-semibold text-gray-600">Especifique:</label>
                        <input
                            type="text"
                            value={otherValue || ''}
                            onChange={(e) => onOtherChange(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md text-sm"
                            placeholder="Especifique aquí..."
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConditionalInput;