import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('donor'); // 'donor' or 'institution'
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem('olaAuth');
    if (storedAuth) {
      try {
        const { userName: storedName, email: storedEmail, userType: storedType } = JSON.parse(storedAuth);
        if (storedName && storedEmail) {
          setUserName(storedName);
          setEmail(storedEmail);
          setUserType(storedType || 'donor');
          setIsAuthenticated(true);
        }
      } catch (error) {
        localStorage.removeItem('olaAuth');
      }
    }
  }, []);

  const login = (name, userEmail) => {
    setUserName(name);
    setEmail(userEmail);
    setUserType('donor');
    setIsAuthenticated(true);
    localStorage.setItem('olaAuth', JSON.stringify({ userName: name, email: userEmail, userType: 'donor' }));
  };

  const loginInstitution = (name, userEmail) => {
    setUserName(name);
    setEmail(userEmail);
    setUserType('institution');
    setIsAuthenticated(true);
    localStorage.setItem('olaAuth', JSON.stringify({ userName: name, email: userEmail, userType: 'institution' }));
  };

  const logout = () => {
    setUserName('');
    setEmail('');
    setUserType('donor');
    setIsAuthenticated(false);
    localStorage.removeItem('olaAuth');
  };

  return (
    <AuthContext.Provider value={{ userName, email, userType, isAuthenticated, login, loginInstitution, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};