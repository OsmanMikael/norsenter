import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    // Hent innloggingsstatus fra localStorage
    return JSON.parse(localStorage.getItem('isAdmin')) || false;
  });

  useEffect(() => {
    // Lagre innloggingsstatus i localStorage
    localStorage.setItem('isAdmin', JSON.stringify(isAdmin));

    // Sett opp inaktivitetstimer
    let timeoutId;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(logout, 3 * 60 * 1000); // 3 minutter
    };

    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('keydown', resetTimer);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousemove', resetTimer);
      document.removeEventListener('keydown', resetTimer);
    };
  }, [isAdmin]);

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, setIsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};