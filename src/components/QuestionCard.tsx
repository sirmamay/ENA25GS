import React from 'react';

interface QuestionCardProps {
    number: number | string;
    text: string;
    children: React.ReactNode;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ number, text, children }) => {
    return (
        <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 flex flex-col md:flex-row md:space-x-4">
                <div className="flex-grow">
                    <p className="text-gray-800 leading-relaxed">
                        <span className="font-bold text-lg mr-2">{number}.</span>
                        {text}
                    </p>
                </div>
                <div className="mt-4 md:mt-0 md:ml-auto flex-shrink-0">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
