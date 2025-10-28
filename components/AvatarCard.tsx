import React from 'react';
import { GenerateButton } from './GenerateButton';
import ShareButtons from './ShareButtons';

interface AvatarCardProps {
  imageUrl: string;
  onRegenerate: () => void;
  onStartOver: () => void;
}

const AvatarCard: React.FC<AvatarCardProps> = ({ imageUrl, onRegenerate, onStartOver }) => {
  return (
    <div className="flex flex-col items-center animate-fade-in w-full">
      <img
        src={imageUrl}
        alt="Generated AI Avatar"
        className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-purple-500 shadow-2xl shadow-purple-500/20"
      />
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <GenerateButton onClick={onRegenerate} text="Generate Another" />
        <button 
          onClick={onStartOver}
          className="px-8 py-4 bg-gray-700 text-white font-bold rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-600/50"
        >
            Start Over
        </button>
      </div>
      <ShareButtons imageUrl={imageUrl} />
    </div>
  );
};

export default AvatarCard;