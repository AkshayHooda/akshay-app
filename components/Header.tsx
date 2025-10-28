import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full text-center">
       <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Geo Avatar AI
        </span>
      </h1>
    </header>
  );
};

export default Header;
