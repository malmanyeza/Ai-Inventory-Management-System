// context/AppContext.js
import { createContext, useContext, useState } from 'react';
import { auth } from '../config/firebaseConfig';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const value = {
    loading,
    setLoading,
    error,
    setError,
    currentUser,
    setCurrentUser
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);