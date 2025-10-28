import React from 'react';

interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  text?: string;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, disabled, text = "Generate My Avatar" }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
            {text}
        </button>
    );
};
