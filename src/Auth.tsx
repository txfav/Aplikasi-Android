import React, { createContext, useState } from 'react';

type AppContextType = {
  name: string;
  setName: (name: string) => void;
};

export const AppContext = createContext<AppContextType>({
  name: '',
  setName: () => {},
});

export const AppProvider = ({ children }) => {
  const [name, setName] = useState('');

  return (
    <AppContext.Provider value={{ name, setName }}>
      {children}
    </AppContext.Provider>
  );
};