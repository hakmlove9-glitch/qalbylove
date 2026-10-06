'use client';

import React, { useState } from 'react';

export default function ThemeToggleWidget() {
  const [isPinkTheme, setIsPinkTheme] = useState(false);

  const toggleThemeMode = () => {
    setIsPinkTheme(!isPinkTheme);
  };

  return (
    <div className="fixed top-24 right-6 z-50">
      <button
        onClick={toggleThemeMode}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-2xl text-xs font-black text-white transition-all duration-300 border backdrop-blur-md ${
          isPinkTheme
            ? 'bg-pink-600/90 border-pink-400 hover:bg-pink-700 shadow-pink-950/50'
            : 'bg-rose-800/90 border-rose-600 hover:bg-rose-700 shadow-slate-950/50'
        }`}
      >
        <span>🌙</span>
        <span>تبديل الوضع</span>
      </button>

      {isPinkTheme && (
        <style jsx global>{`
          ::selection {
            background-color: #db2777 !important;
            color: #ffffff !important;
          }
        `}</style>
      )}
    </div>
  );
}
