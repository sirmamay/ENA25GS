import React from 'react';
import { YesNoNa } from '../types';

interface YesNoNaInputProps {
    name: string;
    value: YesNoNa | 'yes' | 'no' | null;
    onChange: (value: YesNoNa) => void;
    options?: Array<'yes' | 'no' | 'na'>;
}

const optionMap = {
    yes: { label: 'Sí', value: 'yes' },
    no: { label: 'No', value: 'no' },
    na: { label: 'No Aplica', value: 'na' },
};

const YesNoNaInput: React.FC<YesNoNaInputProps> = ({ name, value, onChange, options = ['yes', 'no', 'na'] }) => {
    return (
        <div className="flex items-center space-x-2 border border-gray-400 p-1 rounded-md">
            {options.map((optKey) => {
                const option = optionMap[optKey];
                return (
                    <label key={option.value} className={`flex items-center justify-center px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors duration-200 ${
                        value === option.value ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}>
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(option.value as YesNoNa)}
                            className="sr-only"
                        />
                        {option.label}
                    </label>
                );
            })}
        </div>
    );
};

export default YesNoNaInput;
