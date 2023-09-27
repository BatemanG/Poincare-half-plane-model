import React, { createContext, useState, useContext } from 'react';

// Create the context
const ModeContext = createContext();

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}

export function ModeProvider({ children }) {
  const [mode, setMode] = useState('Drawing');  // You can set the initial mode here

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}
